import React, { useState } from "react";
import { useAppData } from "../context/AppDataContext";

export default function InventorySection() {
  const { meds, addOrUpdateMed } = useAppData();

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [minQty, setMinQty] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      alert("Enter medicine name");
      return;
    }

    addOrUpdateMed({
      name,
      qty: qty ? Number(qty) : 0,
      minQty: minQty ? Number(minQty) : 0,
      expiry,
    });

    setName("");
    setQty("");
    setMinQty("");
    setExpiry("");
  };

  return (
    <section className="card">
      <h2>Medications & Inventory</h2>

      <div className="input-row">
        <input
          placeholder="Medicine Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Qty in Stock"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <input
          placeholder="Minimum Qty"
          value={minQty}
          onChange={(e) => setMinQty(e.target.value)}
        />

        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />

        <button className="primary" onClick={handleAdd}>
          Add / Update
        </button>
      </div>

      <h3>Inventory Items</h3>
      {meds.length === 0 ? (
        <p className="muted">No medicines added yet.</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Min Qty</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {meds.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td className={m.qty <= m.minQty ? "danger" : ""}>{m.qty}</td>
                <td>{m.minQty}</td>
                <td>{m.expiry || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
