import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function VitalsHistory() {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const q = query(
        collection(db, "vitals"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const vitalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVitals(vitalsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vitals:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading vitals...</p>;
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Vitals History</h2>

      {vitals.length === 0 ? (
        <p>No vitals recorded yet</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            marginTop: "15px",
            borderCollapse: "collapse",
            backgroundColor: "#1e1e2f",
            color: "#ffffff",
          }}
        >
          <thead style={{ backgroundColor: "#2d2d44" }}>
            <tr>
              <th>Date</th>
              <th>BP</th>
              <th>BP Status</th>
              <th>Heart Rate</th>
              <th>HR Status</th>
              <th>Sugar</th>
              <th>Sugar Status</th>
            </tr>
          </thead>

          <tbody>
            {vitals.map((v) => (
              <tr key={v.id}>
                <td>
                  {v.createdAt?.toDate
                    ? v.createdAt.toDate().toLocaleString()
                    : "—"}
                </td>

                <td>{v.bp}</td>
                <td style={{ color: v.bpStatus?.color }}>
                  {v.bpStatus?.label}
                </td>

                <td>{v.hr}</td>
                <td style={{ color: v.hrStatus?.color }}>
                  {v.hrStatus?.label}
                </td>

                <td>{v.sugar}</td>
                <td style={{ color: v.sugarStatus?.color }}>
                  {v.sugarStatus?.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
