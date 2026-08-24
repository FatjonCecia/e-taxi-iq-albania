import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Outlet
} from "react-router-dom";

import { getAnalytics } from "./services/api";

import SubmitReview from "./pages/SubmitReview";
import Reviews from "./pages/Reviews";
import CompanyIntelligence from "./pages/CompanyIntelligence";
import CompanyComparison from "./pages/CompanyComparison";
import ReviewTrends from "./pages/ReviewTrends";

import SentimentChart from "./components/SentimentChart";
import CompanyChart from "./components/CompanyChart";
import AspectChart from "./components/AspectChart";
import RatingChart from "./components/RatingChart";
import AnomalyChart from "./components/AnomalyChart";

import "./App.css";


// ======================================================
// NAVBAR
// ======================================================

function Navbar() {

  const location = useLocation();


  const isActive = (path) => {

    return location.pathname === path
      ? "active"
      : "";

  };


  return (

    <nav className="dashboard-navbar">

      {/* BRAND */}

      <Link
        to="/"
        className="dashboard-brand"
      >
        E-Taxi IQ Albania
      </Link>


      {/* NAVIGATION */}

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

  );

}


// ======================================================
// FOOTER
// ======================================================

function Footer() {

  return (

    <footer className="dashboard-footer">

      <div className="container">

        <div className="footer-content">

          <div>

            <h6>
              E-Taxi IQ Albania
            </h6>

            <p>
              Electric taxi review intelligence
              and customer experience analytics.
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
              Trends
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            E-Taxi IQ Albania
          </span>

          <span>
            ML-powered review analytics
          </span>

        </div>

      </div>

    </footer>

  );

}


// ======================================================
// SHARED PAGE LAYOUT
// ======================================================

function Layout() {

  return (

    <div className="app-shell">

      <Navbar />


      <main className="app-content">

        <Outlet />

      </main>


      <Footer />

    </div>

  );

}


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard() {

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  // ====================================================
  // LOAD ANALYTICS
  // ====================================================

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        const data = await getAnalytics();

        setAnalytics(data);

      } catch (error) {

        console.error(error);

        setError(
          "Could not connect to the backend."
        );

      } finally {

        setLoading(false);

      }

    };


    loadAnalytics();

  }, []);


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="container py-5">

        <h3>
          Loading dashboard...
        </h3>

      </div>

    );

  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (

      <div className="container py-5">

        <div className="alert alert-danger">

          {error}

        </div>

      </div>

    );

  }


  // ====================================================
  // DASHBOARD
  // ====================================================

  return (

    <main className="container dashboard-container py-5">


      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <h1 className="page-title mb-2 mt-3">

        Dashboard

      </h1>


      <p className="page-subtitle mb-4">

        Electric taxi review intelligence

      </p>


      {/* ==================================================
          STAT CARDS
      ================================================== */}

      <div className="row g-4">


        {/* TOTAL REVIEWS */}

        <div className="col-md-3">

          <div className="card stat-card h-100">

            <div className="card-body">

              <div className="stat-title">

                Total Reviews

              </div>


              <div className="stat-value">

                {analytics.total_reviews.toLocaleString()}

              </div>

            </div>

          </div>

        </div>


        {/* AVERAGE RATING */}

        <div className="col-md-3">

          <div className="card stat-card h-100">

            <div className="card-body">

              <div className="stat-title">

                Average Rating

              </div>


              <div className="stat-value">

                {analytics.average_rating}

              </div>

            </div>

          </div>

        </div>


        {/* ANOMALIES */}

        <div className="col-md-3">

          <div className="card stat-card h-100">

            <div className="card-body">

              <div className="stat-title">

                Anomalies

              </div>


              <div className="stat-value">

                {analytics.anomalies.total}

              </div>

            </div>

          </div>

        </div>


        {/* COMPANIES */}

        <div className="col-md-3">

          <div className="card stat-card h-100">

            <div className="card-body">

              <div className="stat-title">

                Companies

              </div>


              <div className="stat-value">

                {analytics.company_distribution.length}

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          SENTIMENT + COMPANY
      ================================================== */}

      <div className="row g-4 mt-2">

        <div className="col-lg-6">

          <SentimentChart
            sentiment={
              analytics.sentiment_distribution
            }
          />

        </div>


        <div className="col-lg-6">

          <CompanyChart
            companies={
              analytics.company_distribution
            }
          />

        </div>

      </div>


      {/* ==================================================
          RATING + ANOMALY
      ================================================== */}

      <div className="row g-4 mt-2">

        <div className="col-lg-6">

          <RatingChart
            ratings={
              analytics.rating_distribution
            }
          />

        </div>


        <div className="col-lg-6">

          <AnomalyChart
            anomalies={
              analytics.anomalies
            }
          />

        </div>

      </div>


      {/* ==================================================
          ASPECT
      ================================================== */}

      <div className="row g-4 mt-2">

        <div className="col-12">

          <AspectChart
            aspects={
              analytics.aspect_distribution
            }
          />

        </div>

      </div>

    </main>

  );

}


// ======================================================
// APP
// ======================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* SHARED LAYOUT */}

        <Route
          element={<Layout />}
        >

          {/* DASHBOARD */}

          <Route
            path="/"
            element={<Dashboard />}
          />


          {/* REVIEWS */}

          <Route
            path="/reviews"
            element={<Reviews />}
          />


          {/* SUBMIT REVIEW */}

          <Route
            path="/submit-review"
            element={<SubmitReview />}
          />


          {/* COMPANY INTELLIGENCE */}

          <Route
            path="/company-intelligence"
            element={<CompanyIntelligence />}
          />


          {/* COMPANY COMPARISON */}

          <Route
            path="/company-comparison"
            element={<CompanyComparison />}
          />


          {/* REVIEW TRENDS */}

          <Route
            path="/review-trends"
            element={<ReviewTrends />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );

}


export default App;