import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { classifyBP, classifyHR, classifySugar } from "../utils/vitalsClassifier";

export default function SmartwatchSimulator() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(async () => {
      const bp = Math.floor(Math.random() * (160 - 90 + 1)) + 90;
      const hr = Math.floor(Math.random() * (130 - 55 + 1)) + 55;
      const sugar = Math.floor(Math.random() * (260 - 110 + 1)) + 110;

      const bpStatus = classifyBP(bp);
      const hrStatus = classifyHR(hr);
      const sugarStatus = classifySugar(sugar);

      try {
        await addDoc(collection(db, "vitals"), {
          bp,
          hr,
          sugar,
          bpStatus,
          hrStatus,
          sugarStatus,
          source: "smartwatch",
          createdAt: new Date()
        });

        console.log("📡 Smartwatch data sent");
      } catch (err) {
        console.error("Smartwatch error:", err);
      }
    }, 6000); // every 6 seconds

    return () => clearInterval(interval);
  }, [running]);

  return (
    <div style={{
      marginTop: "20px",
      padding: "15px",
      border: "1px solid #2ecc71",
      borderRadius: "8px"
    }}>
      <h3>⌚ Smartwatch Simulator</h3>

      <button
        onClick={() => setRunning(!running)}
        style={{
          background: running ? "#e74c3c" : "#2ecc71",
          color: "white",
          padding: "8px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {running ? "Stop Smartwatch" : "Start Smartwatch"}
      </button>

      <p style={{ marginTop: "10px", fontSize: "14px" }}>
        Status: {running ? "📡 Streaming vitals" : "⏸️ Stopped"}
      </p>
    </div>
  );
}
