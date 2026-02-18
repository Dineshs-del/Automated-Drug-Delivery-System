import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function HealthSummary() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestVitals();
  }, []);

  const fetchLatestVitals = async () => {
    try {
      const q = query(
        collection(db, "vitals"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setLatest(snapshot.docs[0].data());
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSummary = () => {
    if (!latest) return null;

    let abnormalCount = 0;
    let reasons = [];

    if (latest.bpStatus?.label !== "Normal BP") {
      abnormalCount++;
      reasons.push("Blood Pressure abnormal");
    }

    if (latest.hrStatus?.label !== "Normal HR") {
      abnormalCount++;
      reasons.push("Heart Rate abnormal");
    }

    if (latest.sugarStatus?.label !== "Normal") {
      abnormalCount++;
      reasons.push("Sugar level abnormal");
    }

    if (abnormalCount === 0) {
      return {
        status: "Healthy",
        color: "green",
        message: "All vitals are within normal range.",
        advice: "Maintain your current healthy lifestyle."
      };
    }

    if (abnormalCount === 1) {
      return {
        status: "Needs Attention",
        color: "orange",
        message: reasons.join(", "),
        advice: "Monitor vitals regularly and follow precautions."
      };
    }

    return {
      status: "Critical",
      color: "red",
      message: reasons.join(", "),
      advice: "Doctor consultation is strongly recommended."
    };
  };

  if (loading) return <p>Loading health summary...</p>;
  if (!latest) return <p>No vitals available.</p>;

  const summary = getSummary();

  return (
    <div
      style={{
        marginTop: "25px",
        padding: "20px",
        borderRadius: "10px",
        border: `2px solid ${summary.color}`,
        backgroundColor: "#111"
      }}
    >
      <h2 style={{ color: summary.color }}>🧠 AI Health Summary</h2>

      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color: summary.color }}>{summary.status}</span>
      </p>

      <p>
        <strong>AI Analysis:</strong> {summary.message}
      </p>

      <p>
        <strong>Recommendation:</strong> {summary.advice}
      </p>
    </div>
  );
}
