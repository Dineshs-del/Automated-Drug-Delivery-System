import React, { useEffect, useState } from "react";
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { classifyBP, classifyHR, classifySugar } from "../utils/vitalsClassifier";
import SmartwatchSimulator from "../smartwatch/SmartwatchSimulator";


export default function VitalsSection() {
  const [bp, setBP] = useState("");
  const [sugar, setSugar] = useState("");
  const [hr, setHR] = useState("");

  const [latestVitals, setLatestVitals] = useState(null);

  // 🔹 Fetch latest vitals for Health Summary
  useEffect(() => {
    const fetchLatestVitals = async () => {
      try {
        const q = query(
          collection(db, "vitals"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setLatestVitals(snapshot.docs[0].data());
        }
      } catch (err) {
        console.error("Error fetching latest vitals:", err);
      }
    };

    fetchLatestVitals();
  }, []);

  // 🔹 Save vitals
  const handleAdd = async () => {
    if (!bp || !sugar || !hr) {
      alert("Enter all vitals");
      return;
    }

    const bpStatus = classifyBP(Number(bp));
    const hrStatus = classifyHR(Number(hr));
    const sugarStatus = classifySugar(Number(sugar));

    try {
      await addDoc(collection(db, "vitals"), {
        bp: Number(bp),
        hr: Number(hr),
        sugar: Number(sugar),
        bpStatus,
        hrStatus,
        sugarStatus,
        createdAt: new Date()
      });

      alert("Vitals saved to Firebase");

      setBP("");
      setSugar("");
      setHR("");

      // refresh summary after save
      setLatestVitals({
        bp: Number(bp),
        hr: Number(hr),
        sugar: Number(sugar),
        bpStatus,
        hrStatus,
        sugarStatus
      });
    } catch (error) {
      console.error("Firebase error:", error);
      alert("Failed to save vitals");
    }
  };

  // 🧠 AI Health Summary Logic
  const getHealthSummary = () => {
    if (!latestVitals) return null;

    let abnormal = 0;
    let issues = [];

    if (latestVitals.bpStatus.label !== "Normal BP") {
      abnormal++;
      issues.push("Blood Pressure");
    }

    if (latestVitals.hrStatus.label !== "Normal HR") {
      abnormal++;
      issues.push("Heart Rate");
    }

    if (latestVitals.sugarStatus.label !== "Normal") {
      abnormal++;
      issues.push("Sugar Level");
    }

    if (abnormal === 0) {
      return {
        title: "Healthy",
        color: "#2ecc71",
        message: "All vitals are within normal range.",
        advice: "Maintain your healthy routine."
      };
    }

    if (abnormal === 1) {
      return {
        title: "Needs Attention",
        color: "#f39c12",
        message: `${issues[0]} is slightly abnormal.`,
        advice: "Monitor vitals regularly."
      };
    }

    return {
      title: "Critical",
      color: "#e74c3c",
      message: `${issues.join(", ")} are abnormal.`,
      advice: "Doctor consultation recommended."
    };
  };

  const healthSummary = getHealthSummary();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Record Vitals</h2>

      <input
        placeholder="BP"
        value={bp}
        onChange={(e) => setBP(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Sugar"
        value={sugar}
        onChange={(e) => setSugar(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Heart Rate"
        value={hr}
        onChange={(e) => setHR(e.target.value)}
      />
      <br /><br />

      <button onClick={handleAdd}>Add Vitals</button>
      <SmartwatchSimulator />


      {/* 🧠 AI HEALTH SUMMARY CARD */}
      {healthSummary && (
        <div
          style={{
            marginTop: "30px",
            padding: "16px",
            borderRadius: "8px",
            background: "#1e1e1e",
            borderLeft: `6px solid ${healthSummary.color}`
          }}
        >
          <h3 style={{ color: healthSummary.color }}>
            🧠 AI Health Summary — {healthSummary.title}
          </h3>

          <p><strong>Summary:</strong> {healthSummary.message}</p>
          <p><strong>Advice:</strong> {healthSummary.advice}</p>
        </div>
      )}
    </div>
  );
}
