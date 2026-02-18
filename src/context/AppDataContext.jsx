import React, { createContext, useContext, useEffect, useState } from "react";

const AppDataContext = createContext(null);
const STORAGE_KEY = "drugDeliveryPhase1";

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { patients: [], meds: [], activePatientId: null };
    }
    const parsed = JSON.parse(raw);
    return {
      patients: parsed.patients || [],
      meds: parsed.meds || [],
      activePatientId: parsed.activePatientId || null,
    };
  } catch (e) {
    console.warn("Failed to load from storage:", e);
    return { patients: [], meds: [], activePatientId: null };
  }
}

export function AppDataProvider({ children }) {
  const [{ patients, meds, activePatientId }, setState] = useState(
    loadInitialState
  );

  useEffect(() => {
    try {
      const payload = JSON.stringify({ patients, meds, activePatientId });
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (e) {
      console.warn("Failed to save to storage:", e);
    }
  }, [patients, meds, activePatientId]);

  const setActivePatientId = (id) =>
    setState((prev) => ({ ...prev, activePatientId: id }));

  const addOrUpdatePatient = (patientData) => {
    setState((prev) => {
      const existingIndex = prev.patients.findIndex(
        (p) =>
          p.name.trim().toLowerCase() ===
          patientData.name.trim().toLowerCase()
      );
      let patients;
      if (existingIndex !== -1) {
        const updated = { ...prev.patients[existingIndex], ...patientData };
        patients = [...prev.patients];
        patients[existingIndex] = updated;
        return { ...prev, patients, activePatientId: updated.id };
      } else {
        const id = Date.now().toString();
        const newPatient = {
          id,
          name: patientData.name,
          age: patientData.age,
          gender: patientData.gender,
          condition: patientData.condition,
          vitals: [],
          schedules: [],
        };
        patients = [...prev.patients, newPatient];
        return { ...prev, patients, activePatientId: id };
      }
    });
  };

  const addVitalReading = (patientId, reading) => {
    setState((prev) => {
      const patients = prev.patients.map((p) =>
        p.id === patientId ? { ...p, vitals: [...p.vitals, reading] } : p
      );
      return { ...prev, patients };
    });
  };

  const addOrUpdateMed = (medData) => {
    setState((prev) => {
      const existingIndex = prev.meds.findIndex(
        (m) => m.name.trim().toLowerCase() === medData.name.trim().toLowerCase()
      );
      let meds;
      if (existingIndex !== -1) {
        meds = [...prev.meds];
        meds[existingIndex] = { ...meds[existingIndex], ...medData };
      } else {
        meds = [...prev.meds, { id: Date.now().toString(), ...medData }];
      }
      return { ...prev, meds };
    });
  };

  const addSchedule = (patientId, scheduleData) => {
    setState((prev) => {
      const patients = prev.patients.map((p) => {
        if (p.id !== patientId) return p;
        const newSchedule = {
          id: Date.now().toString() + Math.random().toString(16).slice(2),
          medName: scheduleData.medName,
          time: scheduleData.time,
          lastTakenDate: null,
        };
        return { ...p, schedules: [...p.schedules, newSchedule] };
      });
      return { ...prev, patients };
    });
  };

  const markScheduleTaken = (patientId, scheduleId) => {
    setState((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const patients = prev.patients.map((p) => {
        if (p.id !== patientId) return p;
        const schedules = p.schedules.map((s) =>
          s.id === scheduleId ? { ...s, lastTakenDate: today } : s
        );
        return { ...p, schedules };
      });

      let meds = prev.meds;
      patients.forEach((p) => {
        p.schedules.forEach((s) => {
          if (s.id === scheduleId) {
            meds = meds.map((m) =>
              m.name === s.medName && m.qty > 0
                ? { ...m, qty: m.qty - 1 }
                : m
            );
          }
        });
      });

      return { ...prev, patients, meds };
    });
  };

  const value = {
    patients,
    meds,
    activePatientId,
    setActivePatientId,
    addOrUpdatePatient,
    addVitalReading,
    addOrUpdateMed,
    addSchedule,
    markScheduleTaken,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider");
  return ctx;
}
