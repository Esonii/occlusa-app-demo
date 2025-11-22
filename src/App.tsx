import TestFirebase from "./TestFirebase";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./auth/LoginPage";

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        minHeight: "100vh"
      }}>
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div style={{padding: "2rem"}}>
      <h1>Firebase Test</h1>
      <TestFirebase />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

