import React, { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import jsPDF from "jspdf";

export default function ScheduleAndReportsSection() {
  const {
    patients,
    activePatientId,
    meds,
    addSchedule,
    markScheduleTaken,
  } = useAppData();

  const active = patients.find((p) => p.id === activePatientId);

  const [medName, setMedName] = useState("");
  const [time, setTime] = useState("");

  if (!active)
    return (
      <section className="card">
        <h2>Schedules & Reports</h2>
        <p className="muted">Select a patient to continue.</p>
      </section>
    );

const handleAdd = () => {
  // At least medicine must be selected
  if (!medName) {
    alert("Select a medicine first");
    return;
  }

  // If time is empty or browser didn't send it, show "--"
  const finalTime = (time && time.trim() !== "") ? time : "--";

  addSchedule(active.id, { medName, time: finalTime });

  // clear fields
  setMedName("");
  setTime("");
};




  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Smart Automated Drug Delivery System Report", 10, 10);
    doc.text(`Patient: ${active.name}`, 10, 20);

    doc.text("Medicine Schedules:", 10, 30);
    active.schedules.forEach((s, i) => {
      doc.text(
        `${i + 1}. ${s.medName} at ${s.time} — Last Taken: ${
          s.lastTakenDate || "Not Taken Yet"
        }`,
        10,
        40 + i * 10
      );
    });

    doc.save(`${active.name}-report.pdf`);
  };

  return (
    <section className="card">
      <h2>Schedules & Reports — {active.name}</h2>

      <div className="input-row">
        <select value={medName} onChange={(e) => setMedName(e.target.value)}>
          <option value="">Select Medicine</option>
          {meds.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button className="primary" onClick={handleAdd}>
          Add Schedule
        </button>
      </div>

      <h3>Existing Schedules</h3>
      {active.schedules.length === 0 ? (
        <p className="muted">No schedules added yet.</p>
      ) : (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Time</th>
              <th>Last Taken</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {active.schedules.map((s) => (
              <tr key={s.id}>
                <td>{s.medName}</td>
                <td>{s.time}</td>
                <td>{s.lastTakenDate || "—"}</td>
                <td>
                  <button
                    className="secondary"
                    onClick={() => markScheduleTaken(active.id, s.id)}
                  >
                    Mark Taken
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="primary" onClick={generatePDF}>
        Download PDF Report
      </button>
    </section>
  );
}
