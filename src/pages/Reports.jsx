
import { useMemo } from "react";
import {
  BarChart3,
  Sprout,
  Package,
  ShoppingCart,
  IndianRupee,
  CalendarDays,
  Leaf,
  TrendingUp,
} from "lucide-react";
import { useInventory } from "../context/InventoreyContext";


const categoryColors = [
  "#087f5b",
  "#45a66c",
  "#86c94b",
  "#f4b51b",
  "#31a6a0",
  "#6e83d9",
  "#e98b45",
  "#a47bd1",
  "#df6685",
  "#668b9d",
];

function Reports() {
  const { seeds = [], sales = [] } = useInventory();

  const totalStock = seeds.reduce(
    (sum, seed) => sum + Number(seed.stock || 0),
    0
  );

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + Number(sale.total || 0),
    0
  );

  const categoryData = useMemo(() => {
    const categories = {};

    seeds.forEach((seed) => {
      const name = seed.category || "Other";
      categories[name] =
        (categories[name] || 0) + Number(seed.stock || 0);
    });

    return Object.entries(categories)
      .map(([name, stock], index) => ({
        name,
        stock,
        color: categoryColors[index % categoryColors.length],
        percentage: totalStock
          ? (stock / totalStock) * 100
          : 0,
      }))
      .sort((a, b) => b.stock - a.stock);
  }, [seeds, totalStock]);

  const categoryGradient = useMemo(() => {
    if (!totalStock || !categoryData.length) {
      return "#e6efeb 0% 100%";
    }

    let current = 0;

    return categoryData
      .map((category) => {
        const start = current;
        current += category.percentage;
        return `${category.color} ${start}% ${current}%`;
      })
      .join(", ");
  }, [categoryData, totalStock]);

  const topSeeds = useMemo(
    () =>
      [...seeds]
        .sort(
          (a, b) =>
            Number(b.stock || 0) - Number(a.stock || 0)
        )
        .slice(0, 10),
    [seeds]
  );

  const recentSales = useMemo(
    () =>
      [...sales]
        .sort((a, b) => {
          const dateDifference =
            new Date(b.date || 0).getTime() -
            new Date(a.date || 0).getTime();

          return dateDifference ||
            String(b.id || "").localeCompare(String(a.id || ""));
        })
        .slice(0, 10),
    [sales]
  );

  const maxStock = Math.max(
    ...topSeeds.map((seed) => Number(seed.stock || 0)),
    1
  );

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  const formatCurrency = (value) =>
    `₹${formatNumber(value)}`;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const stats = [
    {
      label: "Total Seeds",
      value: formatNumber(seeds.length),
      description: "Seed varieties",
      icon: Sprout,
      color: "report-green",
    },
    {
      label: "Total Stock",
      value: `${formatNumber(totalStock)} kg`,
      description: "Current inventory",
      icon: Package,
      color: "report-blue",
    },
    {
      label: "Total Sales",
      value: formatNumber(sales.length),
      description: "Recorded orders",
      icon: ShoppingCart,
      color: "report-orange",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "Recorded sales value",
      icon: IndianRupee,
      color: "report-purple",
    },
  ];

  return (
    <div className="page reports-page">
      <header className="reports-heading">
        <div className="reports-title-group">
          <div className="reports-heading-icon">
            <BarChart3 size={27} />
          </div>

          <div>
            <h1>Reports & Analytics</h1>
            <p>
              Insights into your seed inventory and sales.
            </p>
          </div>
        </div>

        <div className="reports-period">
          <CalendarDays size={18} />
          <span>All recorded data</span>
        </div>
      </header>

      <section className="reports-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="report-stat-card" key={stat.label}>
              <div className={`report-stat-icon ${stat.color}`}>
                <Icon size={23} />
              </div>

              <div className="report-stat-content">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.description}</small>
              </div>
            </article>
          );
        })}
      </section>

      <section className="reports-chart-grid">
        <article className="report-panel category-panel">
          <div className="report-panel-heading">
            <div className="report-panel-title">
              <div className="report-panel-icon">
                <Leaf size={20} />
              </div>
              <div>
                <h2>Stock by Category</h2>
                <p>Stock distribution across categories</p>
              </div>
            </div>
          </div>

          {categoryData.length ? (
            <div className="category-chart-content">
              <div
                className="category-donut"
                style={{
                  background: `conic-gradient(${categoryGradient})`,
                }}
                role="img"
                aria-label="Seed stock distribution by category"
              >
                <div className="category-donut-center">
                  <strong>{formatNumber(totalStock)} kg</strong>
                  <span>Total Stock</span>
                </div>
              </div>

              <div className="category-legend">
                {categoryData.map((category) => (
                  <div
                    className="category-legend-row"
                    key={category.name}
                  >
                    <span
                      className="category-legend-dot"
                      style={{ background: category.color }}
                    />
                    <span className="category-legend-name">
                      {category.name}
                    </span>
                    <strong>
                      {formatNumber(category.stock)} kg
                    </strong>
                    <span className="category-percentage">
                      {Math.round(category.percentage)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="report-empty-state">
              <Sprout size={30} />
              <strong>No category data yet</strong>
              <span>Add seeds to view the stock chart.</span>
            </div>
          )}
        </article>

        <article className="report-panel top-seeds-panel">
          <div className="report-panel-heading">
            <div className="report-panel-title">
              <div className="report-panel-icon">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2>Top 10 Seeds by Stock</h2>
                <p>Highest available seed quantities</p>
              </div>
            </div>
            <span className="top-seeds-count">
              {topSeeds.length} seeds
            </span>
          </div>

          {topSeeds.length ? (
            <div className="top-seeds-list">
              {topSeeds.map((seed, index) => {
                const stock = Number(seed.stock || 0);
                const percentage = (stock / maxStock) * 100;

                return (
                  <div className="top-seed-row" key={seed.id}>
                    <div className="top-seed-rank">
                      {index + 1}
                    </div>

                    <div className="top-seed-info">
                      <strong>{seed.name}</strong>
                      <span>{seed.variety || "Standard variety"}</span>
                    </div>

                    <div
                      className="top-seed-progress"
                      role="progressbar"
                      aria-valuenow={stock}
                      aria-valuemin={0}
                      aria-valuemax={maxStock}
                      aria-label={`${seed.name} stock`}
                    >
                      <div
                        className="top-seed-progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <strong className="top-seed-quantity">
                      {formatNumber(stock)} kg
                    </strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="report-empty-state">
              <Package size={30} />
              <strong>No seed stock yet</strong>
              <span>Add seeds to view the top 10 ranking.</span>
            </div>
          )}
        </article>
      </section>

      <section className="report-panel recent-sales-panel">
        <div className="report-panel-heading">
          <div className="report-panel-title">
            <div className="report-panel-icon">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2>Recent Sales</h2>
              <p>Latest customer orders</p>
            </div>
          </div>

          <span className="recent-sales-count">
            {sales.length} total
          </span>
        </div>

        {recentSales.length ? (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Sale ID</th>
                  <th>Customer</th>
                  <th>Seed</th>
                  <th>Quantity</th>
                  <th>Price / kg</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <span className="report-sale-id">
                        {sale.id}
                      </span>
                    </td>

                    <td>
                      <div className="report-customer">
                        <div className="report-customer-avatar">
                          {(sale.customer || "C")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span>{sale.customer || "Customer"}</span>
                      </div>
                    </td>

                    <td>
                      <span className="report-seed-name">
                        {sale.seed || "Seed"}
                      </span>
                    </td>

                    <td>{formatNumber(sale.quantity)} kg</td>

                    <td>{formatCurrency(sale.price)}</td>

                    <td>
                      <strong className="report-sale-total">
                        {formatCurrency(sale.total)}
                      </strong>
                    </td>

                    <td>{formatDate(sale.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="report-empty-state sales-empty-state">
            <ShoppingCart size={30} />
            <strong>No sales recorded yet</strong>
            <span>New sales will appear here automatically.</span>
          </div>
        )}
      </section>

      <footer className="reports-footer">
        <Leaf size={18} />
        <span>SeedStock Inventory Reports</span>
        <span className="reports-footer-dot" />
        <span>Based on current application data</span>
      </footer>
    </div>
  );
}

export default Reports;