import {useState} from "react";
import {testDbConnection, createSimpleAppointment, getAppointmentsForDate, cancelAppointment, getAvailableSlots} from "./services/TS_scheduling";
import { useAuth } from "./auth/AuthContext";

const PROVIDERS = ["Abdulhafidh Salim", "Talib Ali"] as const;

export default function TestFirebase() {
  const { logout } = useAuth();
  const [status, setStatus] = useState("idle");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [providerName, setProviderName] = useState("");
  const [date, setDate] = useState("");
  const [timeHour, setTimeHour] = useState("");
  const [timeAmPm, setTimeAmPm] = useState("AM");
  const [viewDate, setViewDate] = useState("");
  const [viewProvider, setViewProvider] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availProviderName, setAvailProviderName] = useState("");
  const [availDate, setAvailDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  async function handleTestConnection() {
    setStatus("running test...");
    try {
      await testDbConnection();
      setStatus("connection OK (see _debug_tests)");
    } catch (err: any) {
      setStatus("error: " + (err.message ?? "unknown"));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!timeHour) {
      setStatus("please select a time");
      return;
    }
    const timeSlotValue = `${timeHour}${timeAmPm.toLowerCase()}`;
    setStatus("creating appointment...");
    try {
      const id = await createSimpleAppointment({patientName, phone, providerName, date, timeSlot: timeSlotValue});
      setStatus("appointment created with id: " + id);
      // Reset form
      setPatientName("");
      setPhone("");
      setProviderName("");
      setDate("");
      setTimeHour("");
      setTimeAmPm("AM");
    } catch (err: any) {
      setStatus("error: " + (err.message ?? "unknown"));
    }
  }

  async function handleLoadAppointments() {
    if (!viewDate) {
      setStatus("please choose a date to view appointments");
      return;
    }
    setStatus("loading appointments...");
    try {
      const result = await getAppointmentsForDate(viewDate, viewProvider);
      setAppointments(result);
      setStatus(`loaded ${result.length} appointment(s)`);
    } catch (err: any) {
      setStatus("error loading appointments: " + (err.message ?? "unknown"));
    }
  }

  async function handleCancelAppointment(id: string) {
    setStatus("cancelling...");
    try {
      await cancelAppointment(id);
      setStatus("appointment cancelled");
      // Reload the schedule for the currently selected date and provider
      if (viewDate) {
        const result = await getAppointmentsForDate(viewDate, viewProvider);
        setAppointments(result);
      }
    } catch (err: any) {
      setStatus("error cancelling appointment: " + (err.message ?? "unknown"));
    }
  }

  async function handleSignOut() {
    try {
      await logout();
    } catch (err: any) {
      console.error("Error signing out:", err);
      setStatus("error signing out: " + (err.message ?? "unknown"));
    }
  }

  async function handleCheckAvailability() {
    if (!availProviderName || !availDate) {
      setStatus("please enter provider name and date");
      return;
    }
    setStatus("checking availability...");
    try {
      const slots = await getAvailableSlots(availProviderName, availDate);
      setAvailableSlots(slots);
      setStatus(`found ${slots.length} available slot(s)`);
    } catch (err: any) {
      setStatus("error checking availability: " + (err.message ?? "unknown"));
      setAvailableSlots([]);
    }
  }

  return (
    <div style={{position: "relative"}}>
      <button 
        onClick={handleSignOut}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: "0.5rem 1rem",
          fontSize: "0.875rem"
        }}
      >
        Sign Out
      </button>
      <button onClick={handleTestConnection}>Run Firebase Test</button>
      
      <form onSubmit={handleSubmit} style={{marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "300px"}}>
        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
          style={{padding: "0.5rem"}}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{padding: "0.5rem"}}
        />
        <select
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
          required
          style={{padding: "0.5rem"}}
        >
          <option value="">Select provider</option>
          {PROVIDERS.map(provider => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{padding: "0.5rem"}}
        />
        <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
          <select
            value={timeHour}
            onChange={(e) => setTimeHour(e.target.value)}
            required
            style={{padding: "0.5rem"}}
          >
            <option value="">Select time</option>
            <option value="8:00">8:00</option>
            <option value="8:30">8:30</option>
            <option value="9:00">9:00</option>
            <option value="9:30">9:30</option>
            <option value="10:00">10:00</option>
            <option value="10:30">10:30</option>
            <option value="11:00">11:00</option>
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
            <option value="12:30">12:30</option>
            <option value="1:00">1:00</option>
            <option value="1:30">1:30</option>
            <option value="2:00">2:00</option>
            <option value="2:30">2:30</option>
            <option value="3:00">3:00</option>
            <option value="3:30">3:30</option>
            <option value="4:00">4:00</option>
            <option value="4:30">4:30</option>
            <option value="5:00">5:00</option>
            <option value="5:30">5:30</option>
          </select>
          <select
            value={timeAmPm}
            onChange={(e) => setTimeAmPm(e.target.value)}
            required
            style={{padding: "0.5rem"}}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <button type="submit" style={{padding: "0.5rem", marginTop: "0.5rem"}}>
          Create Appointment
        </button>
      </form>
      
      <p style={{marginTop: "1rem"}}>Status: {status}</p>

      <section style={{marginTop: "2rem"}}>
        <h2>View Day Schedule</h2>
        <div>
          <input
            type="date"
            value={viewDate}
            onChange={(e) => setViewDate(e.target.value)}
            style={{padding: "0.5rem"}}
          />
          <select
            value={viewProvider}
            onChange={(e) => setViewProvider(e.target.value)}
            style={{marginLeft: "0.5rem", padding: "0.5rem"}}
          >
            <option value="">All providers</option>
            {PROVIDERS.map((provider) => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
          <button style={{marginLeft: "0.5rem", padding: "0.5rem"}} onClick={handleLoadAppointments}>
            Load Appointments
          </button>
        </div>

        <ul style={{marginTop: "1rem", listStyle: "none", padding: 0}}>
          {appointments.map(appt => (
            <li key={appt.id} style={{padding: "0.5rem", marginBottom: "0.5rem", border: "1px solid #ccc", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span>
                {appt.timeSlot} — {appt.patientName} ({appt.providerName}) [{appt.status}]
              </span>
              {appt.status !== "cancelled" && (
                <button 
                  onClick={() => handleCancelAppointment(appt.id)}
                  style={{padding: "0.25rem 0.5rem", marginLeft: "0.5rem", fontSize: "0.875rem"}}
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section style={{marginTop: "2rem"}}>
        <h2>Check Availability</h2>
        <div>
          <select
            value={availProviderName}
            onChange={e => setAvailProviderName(e.target.value)}
            style={{padding: "0.5rem"}}
          >
            <option value="">Select provider</option>
            {PROVIDERS.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
          <input
            type="date"
            value={availDate}
            onChange={e => setAvailDate(e.target.value)}
            style={{marginLeft: "0.5rem", padding: "0.5rem"}}
          />
          <button 
            style={{marginLeft: "0.5rem", padding: "0.5rem"}} 
            onClick={handleCheckAvailability}
          >
            Check Available Slots
          </button>
        </div>

        <div style={{marginTop: "1rem"}}>
          {availableSlots.length > 0 ? (
            <>
              <h3>Available Slots:</h3>
              <ul style={{listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
                {availableSlots.map((slot, index) => (
                  <li 
                    key={index} 
                    style={{
                      padding: "0.5rem",
                      border: "1px solid #4a9eff",
                      borderRadius: "4px",
                      backgroundColor: "#2a2a2a"
                    }}
                  >
                    {slot}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p style={{color: "#999"}}>No available slots found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
