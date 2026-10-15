import {
  Sprout,
  Boxes,
  Truck,
  IndianRupee,
  ArrowDownToLine,
  ShoppingBag,
  ArrowUpFromLine,
  UserPlus,
} from "lucide-react";

import { useInventory } from "../context/InventoreyContext";

let activities = [
  {
    icon: ArrowDownToLine,
    tone: "green",
    title: "Stock In - Paddy 100 kg",
    time: "Today, 10:24 AM",
  },
  {
    icon: ShoppingBag,
    tone: "purple",
    title: "Sale - Maize 50 kg",
    time: "Yesterday, 6:08:32 PM",
  },
  {
    icon: ArrowUpFromLine,
    tone: "red",
    title: "Stock Out - Groundnut 25 kg",
    time: "Yesterday, 11:15 AM",
  },
  {
    icon: UserPlus,
    tone: "green",
    title: "New Supplier Added",
    time: "M/S Green Agro Traders, 2 days ago",
  },
];

function Dashboard() {
  const { seeds } = useInventory();

  const totalStock = seeds.reduce(
    (sum, seed) => sum + Number(seed.stock || 0),
    0
  );

  const topSeeds = [...seeds]
    .sort((a, b) => Number(b.stock) - Number(a.stock))
    .slice(0, 5);

  const maxStock = Math.max(...topSeeds.map((s) => Number(s.stock)), 1);

  return (
    <div className="page">
      <section className="hero">
        <h2>Welcome, Chandrasekhar!</h2>
        <p>
          Manage your seed inventory, suppliers, sales and reports all in one
          place.
        </p>
      </section>

      <div className="stat-grid">
        <div className="stat-card green">
          <Sprout size={22} />
          <span>Total Seeds</span>
          <strong>{seeds.length}</strong>
          <small>+2 new this month</small>
        </div>

        <div className="stat-card blue">
          <Boxes size={22} />
          <span>Total Stock</span>
          <strong>{totalStock.toLocaleString("en-IN")} kg</strong>
          <small>-5% this week</small>
        </div>

        <div className="stat-card orange">
          <Truck size={22} />
          <span>Suppliers</span>
          <strong>5</strong>
          <small>Active suppliers</small>
        </div>

        <div className="stat-card purple">
          <IndianRupee size={22} />
          <span>Total Sales</span>
          <strong>₹ 48,750</strong>
          <small>+12% this month</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <h3>Stock Overview (Top 5 Seeds)</h3>

          <div className="bar-chart">
            {topSeeds.map((seed) => (
              <div className="bar-col" key={seed.id}>
                <div
                  className="bar"
                  style={{
                    height: `${(Number(seed.stock) / maxStock) * 100}%`,
                  }}
                  title={`${seed.stock} kg`}
                />
                <span>{seed.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h3>Recent Activities</h3>

          <ul className="activity-list">
            {activities.map(({ icon: Icon, tone, title, time }) => (
              <li key={title}>
                <div className={`activity-icon ${tone}`}>
                  <Icon size={15} />
                </div>
                <div>
                  <strong>{title}</strong>
                  <span>{time}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;