import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Sprout,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useInventory } from "../context/InventoreyContext";

const PAGE_SIZE = 8;

const categories = ["Cereal", "Fiber", "Oilseed", "Pulse", "Spice"];

const emptyForm = {
  name: "",
  variety: "",
  category: "Cereal",
  stock: "",
  price: "",
};

function Seeds() {
  const { seeds, addSeed, updateSeed, deleteSeed } = useInventory();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingSeed, setEditingSeed] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredSeeds = seeds.filter((seed) => {
    const text = search.toLowerCase();

    const matchesSearch =
      seed.name.toLowerCase().includes(text) ||
      seed.variety.toLowerCase().includes(text) ||
      seed.category.toLowerCase().includes(text) ||
      seed.id.toLowerCase().includes(text);

    const matchesCategory =
      category === "All Categories" || seed.category === category;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSeeds.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleSeeds = filteredSeeds.slice(startIndex, startIndex + PAGE_SIZE);

  const openAddModal = () => {
    setEditingSeed(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (seed) => {
    setEditingSeed(seed);
    setForm({
      name: seed.name,
      variety: seed.variety,
      category: seed.category,
      stock: seed.stock,
      price: seed.price,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSeed(null);
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

    if (
      !form.name.trim() ||
      !form.variety.trim() ||
      form.stock === "" ||
      form.price === ""
    ) {
      return;
    }

    const data = {
      name: form.name.trim(),
      variety: form.variety.trim(),
      category: form.category,
      stock: Number(form.stock),
      price: Number(form.price),
    };

    if (editingSeed) {
      updateSeed(editingSeed.id, data);
    } else {
      const nextNumber =
        seeds.length > 0
          ? Math.max(...seeds.map((seed) => Number(seed.id.replace("P", "")))) +
            1
          : 1;

      addSeed({
        id: `P${String(nextNumber).padStart(3, "0")}`,
        ...data,
      });
    }

    closeModal();
  };

  const handleDelete = (seed) => {
    const confirmed = window.confirm(`Delete ${seed.name} ${seed.variety}?`);

    if (confirmed) {
      deleteSeed(seed.id);
    }
  };

  const from = filteredSeeds.length === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + PAGE_SIZE, filteredSeeds.length);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Seeds</h1>
        </div>

        <button className="primary-button" onClick={openAddModal}>
          <Plus size={16} />
          Add Seed
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search seeds by name, variety or category..."
            />
          </div>

          <select
            className="filter-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option>All Categories</option>

            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Seed Name</th>
                <th>Variety</th>
                <th>Category</th>
                <th>Stock (kg)</th>
                <th>Price (₹/kg)</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleSeeds.length > 0 ? (
                visibleSeeds.map((seed) => (
                  <tr key={seed.id}>
                    <td>{seed.id}</td>

                    <td>
                      <div className="seed-name">
                        <div className="seed-row-icon">
                          <Sprout size={14} />
                        </div>

                        <strong>{seed.name}</strong>
                      </div>
                    </td>

                    <td>{seed.variety}</td>

                    <td>
                      <span className="category-badge">{seed.category}</span>
                    </td>

                    <td>
                      <strong>
                        {Number(seed.stock).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>₹{Number(seed.price).toLocaleString("en-IN")}</td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-button"
                          onClick={() => openEditModal(seed)}
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(seed)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No seeds found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing {from} to {to} of {filteredSeeds.length} seeds
          </span>

          <div className="pagination">
            <button
              className="page-number"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  className={
                    number === currentPage ? "page-number active" : "page-number"
                  }
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              )
            )}

            <button
              className="page-number"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{editingSeed ? "Edit Seed" : "Add New Seed"}</h2>
                <span>Enter seed details below</span>
              </div>

              <button className="modal-close" onClick={closeModal}>
                <X size={19} />
              </button>
            </div>

            <form className="seed-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Seed Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Paddy"
                />
              </div>

              <div className="form-group">
                <label>Variety</label>
                <input
                  name="variety"
                  value={form.variety}
                  onChange={handleChange}
                  placeholder="Example: MTU-1010"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock (kg)</label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹/kg)</label>
                  <input
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingSeed ? "Update Seed" : "Add Seed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Seeds;




// import { useEffect, useState } from "react";

// function Seeds() {
//   const [seeds, setSeeds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchSeeds() {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/seeds"
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch seeds");
//         }

//         const data = await response.json();
//         setSeeds(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSeeds();
//   }, []);

//   if (loading) return <p>Loading seeds...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Seeds Management</h1>

//       {seeds.map((seed) => (
//         <div key={seed.id}>
//           <h3>{seed.name}</h3>
//           <p>Stock: {seed.stock}</p>
//           <p>Price: ₹{seed.price}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Seeds;

