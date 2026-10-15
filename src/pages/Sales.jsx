
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  X,
  ShoppingCart,
} from "lucide-react";

const initialSales = [
  {
    id: "S001",
    customer: "Ramesh",
    seed: "Paddy",
    packetSize: "1 kg",
    quantity: 20,
    price: 80,
    date: "2026-10-08",
  },
  {
    id: "S002",
    customer: "Suresh",
    seed: "Maize",
    packetSize: "500 g",
    quantity: 15,
    price: 50,
    date: "2026-10-09",
  },
];

const seedOptions = [
  "Paddy",
  "Maize",
  "Cotton",
  "Groundnut",
  "Sunflower",
];

const packetSizes = [
  { label: "500 g", value: "500 g" },
  { label: "1 kg", value: "1 kg" },
  { label: "5 kg", value: "5 kg" },
];

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Sales() {
  const [sales, setSales] = useState(initialSales);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer: "",
    seed: "Paddy",
    packetSize: "500 g",
    quantity: "",
    price: "",
    date: getToday(),
  });

  const total =
    Number(form.quantity || 0) * Number(form.price || 0);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        sale.customer.toLowerCase().includes(searchText) ||
        sale.seed.toLowerCase().includes(searchText) ||
        sale.id.toLowerCase().includes(searchText) ||
        sale.packetSize.toLowerCase().includes(searchText);

      const matchesDate =
        selectedDate === "" || sale.date === selectedDate;

      return matchesSearch && matchesDate;
    });
  }, [sales, search, selectedDate]);

  const totalSales = filteredSales.reduce(
    (sum, sale) => sum + sale.quantity * sale.price,
    0
  );

  const totalPackets = filteredSales.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  };

  const resetForm = () => {
    setForm({
      customer: "",
      seed: "Paddy",
      packetSize: "500 g",
      quantity: "",
      price: "",
      date: getToday(),
    });

    setError("");
  };

  const handleAddSale = (e) => {
    e.preventDefault();

    if (!form.customer.trim()) {
      setError("Please enter customer name.");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Please enter a valid number of packets.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) <= 0
    ) {
      setError("Please enter a valid price per packet.");
      return;
    }

    if (!form.date) {
      setError("Please select the sale date.");
      return;
    }

    const newSale = {
      id: `S${Date.now()}`,
      customer: form.customer.trim(),
      seed: form.seed,
      packetSize: form.packetSize,
      quantity: Number(form.quantity),
      price: Number(form.price),
      date: form.date,
    };

    setSales((previousSales) => [newSale, ...previousSales]);

    resetForm();
    setShowModal(false);
  };

  const handleDeleteSale = (id) => {
    setSales((previousSales) =>
      previousSales.filter((sale) => sale.id !== id)
    );
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Sales Management</h1>
          <p>Manage seed packet sales and customer transactions.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add Sale
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card green">
          <div className="stat-icon">
            <ShoppingCart size={22} />
          </div>
          <p>Total Sales</p>
          <h2>₹{totalSales.toLocaleString("en-IN")}</h2>
          <span>Based on filtered records</span>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">
            <ShoppingCart size={22} />
          </div>
          <p>Total Packets Sold</p>
          <h2>{totalPackets}</h2>
          <span>Based on filtered records</span>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search customer, seed, packet size or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <input
            className="date-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {selectedDate && (
            <button
              className="secondary-button"
              onClick={() => setSelectedDate("")}
            >
              Clear Date
            </button>
          )}
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Customer</th>
                <th>Seed Name</th>
                <th>Packet Size</th>
                <th>Packets</th>
                <th>Price / Packet</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{sale.customer}</td>
                    <td>{sale.seed}</td>
                    <td>{sale.packetSize}</td>
                    <td>{sale.quantity}</td>
                    <td>
                      ₹{sale.price.toLocaleString("en-IN")}
                    </td>
                    <td>
                      ₹
                      {(sale.quantity * sale.price).toLocaleString(
                        "en-IN"
                      )}
                    </td>
                    <td>{sale.date}</td>
                    <td>
                      <button
                        className="delete-button"
                        title="Delete sale"
                        onClick={() => handleDeleteSale(sale.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-table">
                    No sales records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          Showing {filteredSales.length} of {sales.length} transactions
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>Add New Sale</h2>
                <p>Enter seed packet and customer details.</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form className="seed-form" onSubmit={handleAddSale}>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  name="customer"
                  type="text"
                  placeholder="Enter customer name"
                  value={form.customer}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Seed Name</label>
                  <select
                    name="seed"
                    value={form.seed}
                    onChange={handleChange}
                  >
                    {seedOptions.map((seed) => (
                      <option key={seed} value={seed}>
                        {seed}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Packet Size</label>
                  <select
                    name="packetSize"
                    value={form.packetSize}
                    onChange={handleChange}
                  >
                    {packetSizes.map((packet) => (
                      <option
                        key={packet.value}
                        value={packet.value}
                      >
                        {packet.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Packets</label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter packet quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price per Packet (₹)</label>
                  <input
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter packet price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Sale Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Amount</label>
                <input
                  type="text"
                  value={`₹${total.toLocaleString("en-IN")}`}
                  readOnly
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
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;

