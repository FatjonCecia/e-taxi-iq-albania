import { Outlet, useLocation, Link } from "react-router-dom";

function Layout() {

  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="app-layout">

      {/* ==============================
          NAVBAR
      ============================== */}

      <nav className="dashboard-navbar">

        <Link
          to="/"
          className="dashboard-brand"
        >
          E-Taxi IQ Albania
        </Link>

        <div className="dashboard-nav-links">

          <Link
            to="/"
            className={isActive("/")}
          >
            Dashboard
          </Link>

          <Link
            to="/reviews"
            className={isActive("/reviews")}
          >
            Reviews
          </Link>

          <Link
            to="/submit-review"
            className={isActive("/submit-review")}
          >
            Submit Review
          </Link>

          <Link
            to="/company-intelligence"
            className={isActive("/company-intelligence")}
          >
            Company
          </Link>

          <Link
            to="/company-comparison"
            className={isActive("/company-comparison")}
          >
            Comparison
          </Link>

          <Link
            to="/review-trends"
            className={isActive("/review-trends")}
          >
            Review Trends
          </Link>

        </div>

      </nav>


      {/* ==============================
          PAGE CONTENT
      ============================== */}

      <main className="app-content">

        <Outlet />

      </main>


      {/* ==============================
          FOOTER
      ============================== */}

      <footer className="dashboard-footer">

        <div className="footer-content">

          <div>

            <h5>
              E-Taxi IQ Albania
            </h5>

            <p>
              Electric taxi review intelligence
              powered by data and machine learning.
            </p>

          </div>


          <div className="footer-links">

            <Link to="/">
              Dashboard
            </Link>

            <Link to="/reviews">
              Reviews
            </Link>

            <Link to="/company-comparison">
              Comparison
            </Link>

            <Link to="/review-trends">
              Review Trends
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            E-Taxi IQ Albania
          </span>

          <span>
            Machine Learning Analytics Platform
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Layout;