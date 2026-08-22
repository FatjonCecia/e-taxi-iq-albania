import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import { getAnalytics } from "./services/api";

import SentimentChart from "./components/SentimentChart";
import CompanyChart from "./components/CompanyChart";
import AspectChart from "./components/AspectChart";
import RatingChart from "./components/RatingChart";
import AnomalyChart from "./components/AnomalyChart";

import Reviews from "./pages/Reviews";

import "./App.css";


function Dashboard() {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        const data = await getAnalytics();

        setAnalytics(data);

      } catch (error) {

        console.error(error);

        setError("Could not connect to the backend.");

      } finally {

        setLoading(false);

      }

    };

    loadAnalytics();

  }, []);


  if (loading) {

    return (
      <div className="container py-5">
        <h3>Loading dashboard...</h3>
      </div>
    );

  }


  if (error) {

    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error}
        </div>

      </div>
    );

  }


  return (

    <div className="container-fluid p-0">

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <span className="dashboard-brand text-white">
          E-Taxi IQ Albania
        </span>

        <div className="dashboard-nav-links">

          <Link to="/">
            Dashboard
          </Link>

          <Link to="/reviews">
            Reviews
          </Link>

        </div>

      </nav>


      {/* DASHBOARD */}

      <main className="container dashboard-container py-5">

        <h1 className="page-title mb-2 mt-3">
          Dashboard
        </h1>

        <p className="page-subtitle mb-4">
          Electric taxi review intelligence
        </p>


        {/* STAT CARDS */}

        <div className="row g-4">

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


          <div className="col-md-3">

            <div className="card stat-card h-100">

              <div className="card-body">

                <div className="stat-title">
                  Companies
                </div>

                <div className="stat-value">

                  {
                    Object.keys(
                      analytics.company_distribution
                    ).length
                  }

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* SENTIMENT + COMPANY */}

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


        {/* RATING + ANOMALY */}

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


        {/* ASPECT */}

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

    </div>

  );
}


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/reviews"
          element={<Reviews />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;