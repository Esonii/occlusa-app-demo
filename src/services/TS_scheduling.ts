// src/services/TS_scheduling.ts
// Core scheduling engine for Occlusa

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";


// ---------- Types ----------

export type UserRole = "admin" | "dentist" | "frontdesk";
  
  export type UserContext = {
    userId:string;
    role:UserRole;
    providerId?:string; // if this user is a dentist, link to provider record
  };
  
  export type AppointmentStatus = "scheduled" | "canceled" | "completed";
  
  export type Appointment = {
    id:string;
    patientId:string;
    providerId:string;
    startTime:Date;
    endTime:Date;
    reason?:string;
    status:AppointmentStatus;
    createdBy:string;
    createdAt:Date;
  };
  
  export type CreateAppointmentInput = {
    patientId:string;
    providerId:string;
    startTime:Date;
    endTime:Date;
    reason?:string;
  };
  
  export type UpdateAppointmentInput = {
    startTime?:Date;
    endTime?:Date;
    reason?:string;
    status?:AppointmentStatus;
  };
  
  // ---------- Helpers ----------
  
  function assertCanModifyAppointments(ctx:UserContext) {
    if (ctx.role !== "admin" && ctx.role !== "frontdesk") {
      throw new Error("You do not have permission to modify appointments.");
    }
  }
  
  function toDate(timestamp:Timestamp):Date {
    return timestamp.toDate();
  }
  
  function toTimestamp(date:Date):Timestamp {
    return Timestamp.fromDate(date);
  }
  
  function getDayRange(date:Date):{start:Date; end:Date} {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
  
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
  
    return {start, end};
  }
  
  function mapAppointmentDoc(docSnap:any):Appointment {
    const data = docSnap.data();
    return {
      id:docSnap.id,
      patientId:data.patientId,
      providerId:data.providerId,
      startTime:toDate(data.startTime),
      endTime:toDate(data.endTime),
      reason:data.reason,
      status:data.status as AppointmentStatus,
      createdBy:data.createdBy,
      createdAt:toDate(data.createdAt),
    };
  }
  
  // optional audit log
  async function logAudit(params:{
    userId:string;
    action:"created" | "updated" | "canceled";
    appointmentId:string;
  }) {
    const {userId, action, appointmentId} = params;
    const auditRef = collection(db, "auditLog");
    await addDoc(auditRef, {
      userId,
      action,
      appointmentId,
      timestamp:Timestamp.now(),
    });
  }
  
  // ---------- Conflict Checking ----------
  
  export async function checkConflicts(params:{
    providerId:string;
    startTime:Date;
    endTime:Date;
    excludeAppointmentId?:string;
  }):Promise<boolean> {
    const {providerId, startTime, endTime, excludeAppointmentId} = params;
  
    const appointmentsRef = collection(db, "appointments");
  
    // existing.startTime < newEnd AND existing.endTime > newStart
    const q = query(
      appointmentsRef,
      where("providerId", "==", providerId),
      where("status", "==", "scheduled"),
      where("startTime", "<", toTimestamp(endTime)),
      where("endTime", ">", toTimestamp(startTime)),
    );
  
    const snap = await getDocs(q);
    if (snap.empty) return false;
  
    if (!excludeAppointmentId) return true;
  
    const hasRealConflict = snap.docs.some((d) => d.id !== excludeAppointmentId);
    return hasRealConflict;
  }
  
  // ---------- Create Appointment ----------
  
  export async function createAppointment(
    input:CreateAppointmentInput,
    ctx:UserContext,
  ):Promise<{ok:true; appointment:Appointment} | {ok:false; error:string}> {
    try {
      assertCanModifyAppointments(ctx);
  
      if (input.startTime >= input.endTime) {
        return {ok:false, error:"End time must be after start time."};
      }
  
      const conflict = await checkConflicts({
        providerId:input.providerId,
        startTime:input.startTime,
        endTime:input.endTime,
      });
  
      if (conflict) {
        return {ok:false, error:"Time slot already booked for this provider."};
      }
  
      const appointmentsRef = collection(db, "appointments");
      const now = Timestamp.now();
  
      const docRef = await addDoc(appointmentsRef, {
        patientId:input.patientId,
        providerId:input.providerId,
        startTime:toTimestamp(input.startTime),
        endTime:toTimestamp(input.endTime),
        reason:input.reason ?? "",
        status:"scheduled",
        createdBy:ctx.userId,
        createdAt:now,
      });
  
      const createdSnap = await getDoc(docRef);
      const appointment = mapAppointmentDoc(createdSnap);
  
      await logAudit({
        userId:ctx.userId,
        action:"created",
        appointmentId:appointment.id,
      });
  
      return {ok:true, appointment};
    } catch (err:any) {
      console.error("createAppointment error:", err);
      return {ok:false, error:err.message ?? "Failed to create appointment."};
    }
  }
  
  // ---------- Get Appointments For a Day ----------
  
  export async function getAppointmentsForDay(params:{
    date:Date;
    providerId?:string;
  }):Promise<Appointment[]> {
    const {date, providerId} = params;
    const {start, end} = getDayRange(date);
  
    const appointmentsRef = collection(db, "appointments");
  
    const filters:any[] = [
      where("startTime", ">=", toTimestamp(start)),
      where("startTime", "<=", toTimestamp(end)),
    ];
  
    if (providerId) {
      filters.push(where("providerId", "==", providerId));
    }
  
    const q = query(appointmentsRef, ...filters, orderBy("startTime", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return [];
  
    return snap.docs.map(mapAppointmentDoc);
  }
  
  // ---------- Update Appointment ----------
  
  export async function updateAppointment(
    appointmentId:string,
    updates:UpdateAppointmentInput,
    ctx:UserContext,
  ):Promise<{ok:true; appointment:Appointment} | {ok:false; error:string}> {
    try {
      assertCanModifyAppointments(ctx);
  
      const docRef = doc(db, "appointments", appointmentId);
      const existingSnap = await getDoc(docRef);
  
      if (!existingSnap.exists()) {
        return {ok:false, error:"Appointment not found."};
      }
  
      const existing = mapAppointmentDoc(existingSnap);
  
      const newStart = updates.startTime ?? existing.startTime;
      const newEnd = updates.endTime ?? existing.endTime;
  
      if (newStart >= newEnd) {
        return {ok:false, error:"End time must be after start time."};
      }
  
      const timeChanged =
        updates.startTime !== undefined || updates.endTime !== undefined;
  
      if (timeChanged) {
        const conflict = await checkConflicts({
          providerId:existing.providerId,
          startTime:newStart,
          endTime:newEnd,
          excludeAppointmentId:appointmentId,
        });
  
        if (conflict) {
          return {
            ok:false,
            error:"New time slot conflicts with another appointment.",
          };
        }
      }
  
      const updatePayload:any = {};
  
      if (updates.startTime) {
        updatePayload.startTime = toTimestamp(updates.startTime);
      }
      if (updates.endTime) {
        updatePayload.endTime = toTimestamp(updates.endTime);
      }
      if (updates.reason !== undefined) {
        updatePayload.reason = updates.reason;
      }
      if (updates.status) {
        updatePayload.status = updates.status;
      }
  
      await updateDoc(docRef, updatePayload);
  
      const updatedSnap = await getDoc(docRef);
      const updated = mapAppointmentDoc(updatedSnap);
  
      await logAudit({
        userId:ctx.userId,
        action:"updated",
        appointmentId,
      });
  
      return {ok:true, appointment:updated};
    } catch (err:any) {
      console.error("updateAppointment error:", err);
      return {ok:false, error:err.message ?? "Failed to update appointment."};
    }
  }
  
  // ---------- Cancel Appointment (soft delete) ----------
  // Note: The cancelAppointment function for the scheduling engine has been replaced
  // with cancelSimpleAppointment for the form-based flow. The original function
  // required UserContext and is no longer exported.
  
  export async function testDbConnection() {
    try {
      const col = collection(db, "_debug_tests");
      const docRef = await addDoc(col, {
        message: "hello from scheduling engine",
        createdAt: Timestamp.now()
      });
  
      console.log("Test doc written with id:", docRef.id);
    } catch (err) {
      console.error("Test failed:", err);
      throw err;
    }
  }
  
  export type NewAppointment = {
    patientName: string;
    phone: string;
    providerName: string;
    date: string;     // "YYYY-MM-DD"
    timeSlot: string; // e.g. "10:30 AM"
  };

  const normalizeDateKey = (raw: string): string => {
    if (!raw) return "";
    if (raw.includes("/")) {
      const parts = raw.split("/");
      if (parts.length !== 3) return raw;
      const [mm, dd, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    return raw; // assume "YYYY-MM-DD"
  };

  const normalizeTimeSlot = (raw: string): string => {
    if (!raw) return "";
    const trimmed = raw.trim().toLowerCase();
    return trimmed.replace(/\s+/g, "");
  };
  
// Simple appointment creation function for the test form
export async function createSimpleAppointment(data: NewAppointment) {
  const col = collection(db, "appointments");
  const dateKey = normalizeDateKey(data.date);
  const normalizedTimeSlot = normalizeTimeSlot(data.timeSlot);

  console.log("createSimpleAppointment INPUT - raw date:", data.date, "normalized dateKey:", dateKey, "providerName:", data.providerName, "timeSlot:", data.timeSlot, "normalized:", normalizedTimeSlot);

  // Check for existing appointment with same provider, date, and timeSlot
  const checkQuery = query(
    col,
    where("dateKey", "==", dateKey),
    where("providerName", "==", data.providerName),
    where("timeSlot", "==", normalizedTimeSlot)
  );
  
  const existingSnapshot = await getDocs(checkQuery);
  console.log("createSimpleAppointment duplicate check - found", existingSnapshot.docs.length, "existing appointments");
  
  // Check if there's at least one active (non-cancelled) appointment
  const hasActive = existingSnapshot.docs.some((doc) => doc.data().status !== "cancelled");
  
  if (hasActive) {
    throw new Error("This time slot is already booked for this provider.");
  }

  // No conflict found, create the appointment
  const appointmentData = {
    patientName: data.patientName,
    phone: data.phone,
    providerName: data.providerName,
    timeSlot: normalizedTimeSlot,
    dateKey: dateKey,
    status: "booked",
    createdAt: Timestamp.now(),
  };
  
  console.log("createAppointment saving:", appointmentData);
  console.log("createSimpleAppointment WRITING document:", JSON.stringify(appointmentData));
  console.log("createSimpleAppointment providerName value:", JSON.stringify(data.providerName), "length:", data.providerName.length);
  const docRef = await addDoc(col, appointmentData);

  console.log("createSimpleAppointment SUCCESS - dateKey:", dateKey, "providerName:", data.providerName, "id:", docRef.id);
  return docRef.id;
}

// Type for appointments stored from the form
type StoredAppointment = {
  id: string;
  patientName: string;
  phone: string;
  providerName: string;
  dateKey: string;
  timeSlot: string;
  status: string;
  createdAt?: Timestamp;
};

export type Provider = {
  id: string;
  name: string;
  workDays: number[];       // 0 = Sunday ... 6 = Saturday
  startTime: string;        // "09:00"  (24h format)
  endTime: string;          // "17:00"
  slotLengthMinutes: number; // e.g. 30
};

export async function getAppointmentsForDate(date: string, providerName?: string): Promise<StoredAppointment[]> {
  const colRef = collection(db, "appointments");
  const dateKey = normalizeDateKey(date);

  console.log("getAppointmentsForDate INPUT - raw date:", date, "normalized dateKey:", dateKey, "providerName:", providerName);

  let q;
  if (providerName && providerName.trim() !== "") {
    q = query(colRef, where("dateKey", "==", dateKey), where("providerName", "==", providerName));
  } else {
    q = query(colRef, where("dateKey", "==", dateKey));
  }

  const snapshot = await getDocs(q);
  console.log("getAppointmentsForDate QUERY - found", snapshot.docs.length, "documents");

  const results: StoredAppointment[] = snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    const result = {
      id: doc.id,
      patientName: data.patientName ?? "",
      phone: data.phone ?? "",
      providerName: data.providerName ?? "",
      dateKey: data.dateKey ?? "",
      timeSlot: data.timeSlot ?? "",
      status: data.status ?? "",
      createdAt: data.createdAt,
    };
    console.log("getAppointmentsForDate DOCUMENT:", doc.id, "dateKey:", result.dateKey, "providerName:", result.providerName, "timeSlot:", result.timeSlot);
    return result;
  });

  // Sort by timeSlot in JavaScript to avoid needing a composite index
  results.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  console.log("getAppointmentsForDate RESULT - dateKey:", dateKey, "providerName:", providerName, "count:", results.length);
  return results;
}

export async function cancelAppointment(id: string): Promise<void> {
  const docRef = doc(db, "appointments", id);
  await updateDoc(docRef, {
    status: "cancelled",
  });
}

export async function getProviderByName(name: string): Promise<Provider | null> {
  const colRef = collection(db, "providers");
  const q = query(colRef, where("name", "==", name));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const docData = snapshot.docs[0].data();
  return {
    id: snapshot.docs[0].id,
    name: docData.name ?? "",
    workDays: docData.workDays ?? [],
    startTime: docData.startTime ?? "",
    endTime: docData.endTime ?? "",
    slotLengthMinutes: docData.slotLengthMinutes ?? 30,
  };
}

export async function getAppointmentsForProviderAndDate(providerName: string, date: string): Promise<StoredAppointment[]> {
  const colRef = collection(db, "appointments");
  const dateKey = normalizeDateKey(date);
  
  console.log("getAppointmentsForProviderAndDate INPUT - raw date:", date, "normalized dateKey:", dateKey, "providerName:", providerName);
  console.log("getAppointmentsForProviderAndDate providerName value:", JSON.stringify(providerName), "length:", providerName.length);
  console.log("getAppointmentsForProviderAndDate QUERY - where providerName == ", JSON.stringify(providerName), "AND dateKey == ", dateKey);
  
  const q = query(
    colRef,
    where("providerName", "==", providerName),
    where("dateKey", "==", dateKey)
  );
  
  const snapshot = await getDocs(q);
  console.log("getAppointmentsForProviderAndDate QUERY - found", snapshot.docs.length, "documents");
  
  // Debug: log all documents in the collection for this dateKey to see what's actually stored
  const allDocsQuery = query(colRef, where("dateKey", "==", dateKey));
  const allDocsSnapshot = await getDocs(allDocsQuery);
  console.log("getAppointmentsForProviderAndDate DEBUG - all docs for dateKey", dateKey, ":", allDocsSnapshot.docs.length);
  allDocsSnapshot.docs.forEach((doc) => {
    const docData = doc.data();
    console.log("  - Doc ID:", doc.id, "providerName:", JSON.stringify(docData.providerName), "length:", docData.providerName?.length, "timeSlot:", docData.timeSlot);
  });
  
  const results: StoredAppointment[] = snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    const result = {
      id: doc.id,
      patientName: data.patientName ?? "",
      phone: data.phone ?? "",
      providerName: data.providerName ?? "",
      dateKey: data.dateKey ?? "",
      timeSlot: data.timeSlot ?? "",
      status: data.status ?? "",
      createdAt: data.createdAt,
    };
    console.log("getAppointmentsForProviderAndDate DOCUMENT:", doc.id, "dateKey:", result.dateKey, "providerName:", result.providerName, "timeSlot:", result.timeSlot, "status:", result.status);
    return result;
  });
  
  console.log("getAppointmentsForProviderAndDate RESULT - dateKey:", dateKey, "providerName:", providerName, "count:", results.length);
  return results;
}

export async function getAvailableSlots(providerName: string, date: string): Promise<string[]> {
  const dateKey = normalizeDateKey(date);
  
  console.log("getAvailableSlots INPUT - raw date:", date, "normalized dateKey:", dateKey, "providerName:", providerName);
  console.log("getAvailableSlots providerName value:", JSON.stringify(providerName), "length:", providerName.length);
  
  // Load provider by name
  const provider = await getProviderByName(providerName);
  
  // Default schedule if provider not found in providers collection
  let startTime = "09:00";
  let endTime = "17:00";
  let slotLengthMinutes = 30;
  let workDays = [1, 2, 3, 4, 5]; // Monday to Friday
  
  if (provider) {
    startTime = provider.startTime;
    endTime = provider.endTime;
    slotLengthMinutes = provider.slotLengthMinutes;
    workDays = provider.workDays;
  } else {
    console.log("getAvailableSlots provider not found in providers collection, using defaults:", providerName);
  }
  
  // Check if provider works that day
  // Parse YYYY-MM-DD format date
  const [year, month, day] = dateKey.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day); // month is 0-indexed
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
  
  if (!workDays.includes(dayOfWeek)) {
    console.log("getAvailableSlots provider does not work on day:", dayOfWeek);
    return [];
  }
  
  // Generate all time slots between startTime and endTime
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  for (let minutes = startMinutes; minutes < endMinutes; minutes += slotLengthMinutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    // Convert 24-hour format to 12-hour format with am/pm (lowercase, no space) to match stored format
    let displayHour = hours;
    let amPm = "am";
    if (hours === 0) {
      displayHour = 12;
    } else if (hours === 12) {
      amPm = "pm";
    } else if (hours > 12) {
      displayHour = hours - 12;
      amPm = "pm";
    }
    const timeString = `${displayHour}:${mins.toString().padStart(2, "0")}${amPm}`;
    slots.push(timeString);
  }
  
  // Load all non-cancelled appointments for that provider and date
  // REUSE the same function that "View Day Schedule" uses to ensure consistency
  console.log("getAvailableSlots calling getAppointmentsForDate with providerName:", JSON.stringify(providerName), "date:", date);
  const appointments = await getAppointmentsForDate(date, providerName);
  console.log("getAvailableSlots received", appointments.length, "appointments from getAppointmentsForDate");
  const bookedSlots = appointments
    .filter((appt) => appt.status !== "cancelled")
    .map((appt) => normalizeTimeSlot(appt.timeSlot));
  
  // Normalize all generated slots for comparison
  const normalizedSlots = slots.map((slot) => normalizeTimeSlot(slot));
  
  console.log("getAvailableSlots bookedSlots (normalized):", bookedSlots);
  console.log("getAvailableSlots generated slots (normalized):", normalizedSlots);
  
  // Remove any time slot that is already booked (using normalized strings)
  const availableSlots = slots.filter((slot) => !bookedSlots.includes(normalizeTimeSlot(slot)));
  
  console.log("getAvailableSlots RESULT - dateKey:", dateKey, "providerName:", providerName, "totalSlots:", slots.length, "booked:", bookedSlots.length, "available:", availableSlots.length);
  return availableSlots;
}

