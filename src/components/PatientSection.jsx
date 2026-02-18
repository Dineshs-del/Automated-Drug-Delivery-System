import React, { useState } from "react";
import { useAppData } from "../context/AppDataContext";

export default function PatientSection() {
  const { patients, activePatientId, setActivePatientId, addOrUpdatePatient } =
    useAppData();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [condition, setCondition] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      alert("Enter patient name");
      return;
    }

    addOrUpdatePatient({
      name,
      age: age || "",
      gender,
      condition,
    });

    setName("");
    setAge("");
    setGender("Male");
    setCondition("");
  };

  return (
    <section className="card">
      <h2>Patient Profiles</h2>

      <div className="input-row">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          placeholder="Medical Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />

        <button className="primary" onClick={handleAdd}>
          Add / Update
        </button>
      </div>

      <h3>Select Active Patient</h3>
      <select
        value={activePatientId || ""}
        onChange={(e) => setActivePatientId(e.target.value)}
      >
        <option value="">-- Select --</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.age})
          </option>
        ))}
      </select>
    </section>
  );
}
