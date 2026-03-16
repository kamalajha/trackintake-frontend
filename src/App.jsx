import { useState } from "react";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/UserDashboard";
import NutritionistDashboard from "./pages/NutritionistDashboard";

export default function App() {
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role={role} onRoleSwitch={setRole} />
      <main className="max-w-7xl mx-auto px-6 py-6">
        {role === "user" ? <UserDashboard /> : <NutritionistDashboard />}
      </main>
    </div>
  );
}
