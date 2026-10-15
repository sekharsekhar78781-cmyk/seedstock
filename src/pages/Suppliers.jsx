import { useState } from "react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { useInventory } from "../context/InventoreyContext";

const emptyForm = {
  name: "",
  phone: "",
  location: "",
  status: "Active",
};

function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } =
    useInventory();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filtered = suppliers.filter((supplier) => {
    const text = search.toLowerCase();

    const matchesSearch =
      supplier.name.toLowerCase().includes(text) ||
      supplier.phone.includes(text) ||
      supplier.location.toLowerCase().includes(text);

    const matchesStatus = status === "All Status" || supplier.status === status;

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingSupplier(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      phone: supplier.phone,
      location: supplier.location,
      status: supplier.status,
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
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

    if (!form.name.trim() || !form.phone.trim() || !form.location.trim()) {
      setError("Fill in name, phone and location.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Phone number must be 10 digits.");
      return;
    }

    const data = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      status: form.status,
    };

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, data);
    } else {
      addSupplier(data);
    }

    closeModal();
  };

  const handleDelete = (supplier) => {
    const confirmed = window.confirm(`Delete ${supplier.name}?`);

    if (confirmed) {
      deleteSupplier(supplier.id);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Suppliers</h1>
        </div>

        <button className="primary-button" onClick={openAddModal}>
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search suppliers by name, phone or location..."
            />
          </div>

          <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Supplier Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.id}</td>
                    <td>
                      <strong>{supplier.name}</strong>
                    </td>
                    <td>{supplier.phone}</td>
                    <td>{supplier.location}</td>

                    <td>
                      <span
                        className={
                          supplier.status === "Active"
                            ? "status-badge active"
                            : "status-badge out"
                        }
                      >
                        {supplier.status}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-button"
                          title="Edit"
                          onClick={() => openEditModal(supplier)}
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          className="delete-button"
                          title="Delete"
                          onClick={() => handleDelete(supplier)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No suppliers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          Showing {filtered.length} of {suppliers.length} suppliers
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>
                  {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                </h2>
                <span>Enter supplier details below</span>
              </div>

              <button className="modal-close" onClick={closeModal}>
                <X size={19} />
              </button>
            </div>

            <form className="seed-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Supplier Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Sri Sai Seeds"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="10 digit number"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Example: Guntur"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
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
                  {editingSupplier ? "Update Supplier" : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Suppliers;