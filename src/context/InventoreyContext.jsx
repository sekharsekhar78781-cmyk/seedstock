import { createContext, useContext, useEffect, useState } from "react";

const InventoryContext = createContext();

const defaultSeeds = [
  {
    id: "P001",
    name: "Paddy",
    variety: "MTU-1010",
    category: "Cereal",
    stock: 300,
    price: 60,
  },
  {
    id: "P002",
    name: "Maize",
    variety: "Hybrid-900",
    category: "Cereal",
    stock: 250,
    price: 55,
  },
  {
    id: "P003",
    name: "Cotton",
    variety: "Bt Cotton",
    category: "Fiber",
    stock: 180,
    price: 120,
  },
  {
    id: "P004",
    name: "Groundnut",
    variety: "TMV-2",
    category: "Oilseed",
    stock: 220,
    price: 80,
  },
  {
    id: "P005",
    name: "Sunflower",
    variety: "KBSH-44",
    category: "Oilseed",
    stock: 150,
    price: 90,
  },
  {
    id: "P006",
    name: "Soybean",
    variety: "JS-335",
    category: "Oilseed",
    stock: 120,
    price: 70,
  },
  {
    id: "P007",
    name: "Red Gram",
    variety: "ICPL-88039",
    category: "Pulse",
    stock: 100,
    price: 75,
  },
  {
    id: "P008",
    name: "Black Gram",
    variety: "TBG-104",
    category: "Pulse",
    stock: 90,
    price: 70,
  },
];

const defaultSuppliers = [
  {
    id: "S001",
    name: "M/S Green Agro",
    phone: "9876543210",
    location: "Vijayawada",
    status: "Active",
  },
  {
    id: "S002",
    name: "Sri Sai Seeds",
    phone: "9845678901",
    location: "Guntur",
    status: "Active",
  },
  {
    id: "S003",
    name: "Lakshmi Agro Traders",
    phone: "9988776655",
    location: "Kurnool",
    status: "Active",
  },
  {
    id: "S004",
    name: "Rythu Seeds Center",
    phone: "9876501234",
    location: "Kadapa",
    status: "Inactive",
  },
  {
    id: "S005",
    name: "Bharat Agro",
    phone: "9123456780",
    location: "Tirupati",
    status: "Active",
  },
];

const defaultSales = [
  {
    id: "SL001",
    customer: "Ramesh Farmers",
    seedId: "P001",
    seed: "Paddy MTU-1010",
    quantity: 50,
    price: 60,
    total: 3000,
    date: "2026-10-06",
  },
  {
    id: "SL002",
    customer: "Sai Agro Farm",
    seedId: "P002",
    seed: "Maize Hybrid-900",
    quantity: 40,
    price: 55,
    total: 2200,
    date: "2026-10-05",
  },
];

const defaultTransactions = [];

export function InventoryProvider({ children }) {
  const [seeds, setSeeds] = useState(() => {
    const saved = localStorage.getItem("seedstock_seeds");
    return saved ? JSON.parse(saved) : defaultSeeds;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem("seedstock_suppliers");
    return saved ? JSON.parse(saved) : defaultSuppliers;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem("seedstock_sales");
    return saved ? JSON.parse(saved) : defaultSales;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("seedstock_transactions");
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  useEffect(() => {
    localStorage.setItem("seedstock_seeds", JSON.stringify(seeds));
  }, [seeds]);

  useEffect(() => {
    localStorage.setItem(
      "seedstock_suppliers",
      JSON.stringify(suppliers)
    );
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem("seedstock_sales", JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(
      "seedstock_transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const addSeed = (seed) => {
    setSeeds((current) => [...current, seed]);
  };

  const updateSeed = (id, updatedSeed) => {
    setSeeds((current) =>
      current.map((seed) =>
        seed.id === id ? { ...seed, ...updatedSeed } : seed
      )
    );
  };

  const deleteSeed = (id) => {
    setSeeds((current) =>
      current.filter((seed) => seed.id !== id)
    );
  };

  const addSupplier = (supplier) => {
    setSuppliers((current) => [...current, supplier]);
  };

  const updateSupplier = (id, updatedSupplier) => {
    setSuppliers((current) =>
      current.map((supplier) =>
        supplier.id === id
          ? { ...supplier, ...updatedSupplier }
          : supplier
      )
    );
  };

  const deleteSupplier = (id) => {
    setSuppliers((current) =>
      current.filter((supplier) => supplier.id !== id)
    );
  };

  const addSale = (sale) => {
    setSales((current) => [sale, ...current]);

    setSeeds((current) =>
      current.map((seed) =>
        seed.id === sale.seedId
          ? {
              ...seed,
              stock:
                Number(seed.stock) -
                Number(sale.quantity),
            }
          : seed
      )
    );
  };

  const deleteSale = (id) => {
    const sale = sales.find((item) => item.id === id);

    if (!sale) {
      return;
    }

    setSales((current) =>
      current.filter((item) => item.id !== id)
    );

    if (sale.seedId) {
      setSeeds((current) =>
        current.map((seed) =>
          seed.id === sale.seedId
            ? {
                ...seed,
                stock:
                  Number(seed.stock) +
                  Number(sale.quantity),
              }
            : seed
        )
      );
    }
  };

  const updateSale = (id, updatedSale) => {
    const oldSale = sales.find((item) => item.id === id);

    if (!oldSale) {
      return;
    }

    setSales((current) =>
      current.map((sale) =>
        sale.id === id
          ? { ...sale, ...updatedSale }
          : sale
      )
    );

    setSeeds((current) =>
      current.map((seed) => {
        if (oldSale.seedId === seed.id) {
          return {
            ...seed,
            stock:
              Number(seed.stock) +
              Number(oldSale.quantity),
          };
        }

        if (updatedSale.seedId === seed.id) {
          return {
            ...seed,
            stock:
              Number(seed.stock) -
              Number(updatedSale.quantity),
          };
        }

        return seed;
      })
    );
  };

  const addTransaction = (transaction) => {
    setTransactions((current) => [
      transaction,
      ...current,
    ]);

    setSeeds((current) =>
      current.map((seed) => {
        if (seed.id !== transaction.seedId) {
          return seed;
        }

        const quantity = Number(transaction.quantity);

        return {
          ...seed,
          stock:
            transaction.type === "Stock In"
              ? Number(seed.stock) + quantity
              : Number(seed.stock) - quantity,
        };
      })
    );
  };

  let  value = {
    seeds,
    setSeeds,
    addSeed,
    updateSeed,
    deleteSeed,

    suppliers,
    setSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,

    sales,
    setSales,
    addSale,
    updateSale,
    deleteSale,

    transactions,
    setTransactions,
    addTransaction,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}



