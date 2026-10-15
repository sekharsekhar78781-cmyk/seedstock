
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Sprout,
  ArrowLeftRight,
  Truck,
  ShoppingCart,
  FileText,
  Bell,
  Search,
  Menu,
  ChevronDown,
  Leaf,
  LogOut,
} from "lucide-react";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/seeds",
    label: "Seeds",
    icon: Sprout,
  },
  {
    to: "/stock",
    label: "Stock In/Out",
    icon: ArrowLeftRight,
  },
  {
    to: "/suppliers",
    label: "Suppliers",
    icon: Truck,
  },
  {
    to: "/sales",
    label: "Sales",
    icon: ShoppingCart,
  },
  {
    to: "/reports",
    label: "Reports",
    icon: FileText,
  },
];

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <Leaf size={22} />
          </div>

          <div>
            <strong>SeedStock</strong>
            <span>Grow Together</span>
          </div>
        </div>

        <nav className="nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Leaf size={22} />

          <p>
            Better Seeds
            <br />
            Better Harvests
          </p>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            className="icon-button"
            aria-label="Menu"
            type="button"
          >
            <Menu size={19} />
          </button>

          <div className="top-search">
            <Search size={15} />

            <input
              type="text"
              placeholder="Search seeds, suppliers, etc..."
            />
          </div>

          <div className="topbar-right">
            <button
              className="icon-button"
              aria-label="Notifications"
              type="button"
            >
              <Bell size={18} />
            </button>

            <div className="user">
              <div className="avatar">CS</div>

              <div className="user-text">
                <strong>Chandrasekhar</strong>
                <span>Admin</span>
              </div>

              <ChevronDown size={14} />
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
