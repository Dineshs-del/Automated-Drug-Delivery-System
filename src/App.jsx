import React from "react";
import { AppDataProvider } from "./context/AppDataContext";
import PatientSection from "./components/PatientSection";
import VitalsSection from "./components/VitalsSection";
import InventorySection from "./components/InventorySection";
import ScheduleAndReportsSection from "./components/ScheduleAndReportsSection";
import VitalsHistory from "./components/VitalsHistory";


export default function App() {
  return (
    <AppDataProvider>
      <div className="app">
        <header>
          <h1>Smart Automated Drug Delivery System And
                 AI Enabled Healthcare Monitoring
          </h1>
          <p>
            Web-based Smart Healthcare System with patient profiles,vitals analytics, AI-based health
            Classification and drug safety checks with smartwatch vitals simulation
      
          </p>
          <span className="badge">
            Semester Project • Simulation Only
          </span>
        </header>

        <div className="grid">
          <div>
            <PatientSection />
            <VitalsSection />
            

          </div>
          <div>
            <InventorySection />
            <VitalsHistory />
          </div>
        </div>

        <ScheduleAndReportsSection />
      </div>
    </AppDataProvider>
  );
}
