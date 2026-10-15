import { useState } from "react";
import { Plus, Eye, X } from "lucide-react";
import { useInventory } from "../context/InventoreyContext";

function formatDate(value) {
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function Stock() {
  const { seeds, transactions, addTransaction } = useInventory();

  const [tab, setTab] = useState("Stock In");
  let [seedFilter, setSeedFilter] = useState("All Seeds");
  const [fromDate, setFromDate] = useState("");
  let [toDate, setToDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    date: today(),
    type: "Stock In",
    seed: "",
    quantity: "",
    notes: "",
  });

  const filtered = transactions.filter((item) => {
    const matchesTab = item.type === tab;
    const matchesSeed = seedFilter === "All Seeds" || item.seed === seedFilter;
    const matchesFrom = !fromDate || item.date >= fromDate;
    const matchesTo = !toDate || item.date <= toDate;

    return matchesTab && matchesSeed && matchesFrom && matchesTo;
  });

  const openModal = () => {
    setForm({
      date: today(),
      type: tab,
      seed: seeds[0] ? seeds[0].name : "",
      quantity: "",
      notes: "",
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const quantity = Number(form.quantity);

    if (!form.seed || quantity <= 0) {
      setError("Select a seed and enter a quantity.");
      return;
    }

    if (form.type === "Stock Out") {
      const seed = seeds.find((item) => item.name === form.seed);

      if (seed && quantity > Number(seed.stock)) {
        setError(`Only ${seed.stock} kg available for ${seed.name}.`);
        return;
      }
    }

    addTransaction({
      date: form.date,
      type: form.type,
      seed: form.seed,
      quantity,
      notes: form.notes.trim(),
    });

    setTab(form.type);
    closeModal();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Stock In / Out</h1>
        </div>

        <button className="primary-button" onClick={openModal}>
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      <div className="tabs">
        <button
          className={tab === "Stock In" ? "tab active" : "tab"}
          onClick={() => setTab("Stock In")}
        >
          Stock In
        </button>

        <button
          className={tab === "Stock Out" ? "tab active" : "tab"}
          onClick={() => setTab("Stock Out")}
        >
          Stock Out
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <select
            className="filter-select"
            value={seedFilter}
            onChange={(e) => setSeedFilter(e.target.value)}
          >
            <option>All Seeds</option>

            {seeds.map((seed) => (
              <option key={seed.id}>{seed.name}</option>
            ))}
          </select>

          <input
            type="date"
            className="date-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="From date"
          />

          <input
            type="date"
            className="date-input"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="To date"
          />
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Seed Name</th>
                <th>Quantity (kg)</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>

                    <td>
                      <span
                        className={
                          item.type === "Stock In"
                            ? "status-badge in"
                            : "status-badge out"
                        }
                      >
                        {item.type}
                      </span>
                    </td>

                    <td>{item.seed}</td>
                    <td>{Number(item.quantity).toLocaleString("en-IN")}</td>
                    <td>{item.notes || "-"}</td>

                    <td>
                      <button
                        className="view-button"
                        title="View"
                        onClick={() =>
                          window.alert(
                            `${item.type}: ${item.seed}, ${item.quantity} kg\n${item.notes || "No notes"}`
                          )
                        }
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Add Transaction</h2>
                <span>Record stock coming in or going out</span>
              </div>

              <button className="modal-close" onClick={closeModal}>
                <X size={19} />
              </button>
            </div>

            <form className="seed-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option>Stock In</option>
                    <option>Stock Out</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Seed</label>
                <select name="seed" value={form.seed} onChange={handleChange}>
                  {seeds.map((seed) => (
                    <option key={seed.id}>{seed.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity (kg)</label>
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Example: New stock"
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;
