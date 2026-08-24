import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import {
  Line,
  Bar
} from "react-chartjs-2";

import {
  getReviewTrends
} from "../services/api";

import "../App.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);


function ReviewTrends() {

  const [trends, setTrends] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  // ==========================================
  // LOAD TRENDS
  // ==========================================

  useEffect(() => {

    const loadTrends = async () => {

      try {

        setLoading(true);

        const data = await getReviewTrends();

        setTrends(
          data.trends || []
        );

      } catch (error) {

        console.error(error);

        setError(
          "Could not load review trends."
        );

      } finally {

        setLoading(false);

      }

    };


    loadTrends();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="container dashboard-container py-5">

        <div className="text-center py-5">

          <div
            className="spinner-border"
            role="status"
          />

          <p className="mt-3">
            Loading review trends...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="container dashboard-container py-5">

        <div className="alert alert-danger">

          {error}

        </div>

      </div>

    );

  }


  // ==========================================
  // CHART DATA
  // ==========================================

  const months = trends.map(
    item => item.month
  );


  // ==========================================
  // REVIEW VOLUME
  // ==========================================

  const reviewVolumeData = {

    labels: months,

    datasets: [

      {
        label: "Reviews",

        data: trends.map(
          item => item.reviews
        ),

        borderColor: "#0d6efd",

        backgroundColor: "rgba(13, 110, 253, 0.12)",

        borderWidth: 3,

        pointBackgroundColor: "#0d6efd",

        pointBorderColor: "#ffffff",

        pointBorderWidth: 2,

        pointRadius: 4,

        pointHoverRadius: 6,

        tension: 0.35,

        fill: true
      }

    ]

  };


  // ==========================================
  // RATING TREND
  // ==========================================

  const ratingTrendData = {

    labels: months,

    datasets: [

      {
        label: "Average Rating",

        data: trends.map(
          item => item.average_rating
        ),

        borderColor: "#6f42c1",

        backgroundColor: "rgba(111, 66, 193, 0.10)",

        borderWidth: 3,

        pointBackgroundColor: "#6f42c1",

        pointBorderColor: "#ffffff",

        pointBorderWidth: 2,

        pointRadius: 4,

        pointHoverRadius: 6,

        tension: 0.35,

        fill: true
      }

    ]

  };


  // ==========================================
  // SENTIMENT TREND
  // ==========================================

  const sentimentData = {

    labels: months,

    datasets: [

      {
        label: "Positive",

        data: trends.map(
          item => item.positive
        ),

        backgroundColor: "#198754",

        borderColor: "#198754",

        borderWidth: 1,

        borderRadius: 4
      },

      {
        label: "Neutral",

        data: trends.map(
          item => item.neutral
        ),

        backgroundColor: "#ffc107",

        borderColor: "#ffc107",

        borderWidth: 1,

        borderRadius: 4
      },

      {
        label: "Negative",

        data: trends.map(
          item => item.negative
        ),

        backgroundColor: "#dc3545",

        borderColor: "#dc3545",

        borderWidth: 1,

        borderRadius: 4
      }

    ]

  };


  // ==========================================
  // ANOMALY TREND
  // ==========================================

  const anomalyData = {

    labels: months,

    datasets: [

      {
        label: "Anomaly Rate (%)",

        data: trends.map(
          item => item.anomaly_percentage
        ),

        borderColor: "#dc3545",

        backgroundColor: "rgba(220, 53, 69, 0.10)",

        borderWidth: 3,

        pointBackgroundColor: "#dc3545",

        pointBorderColor: "#ffffff",

        pointBorderWidth: 2,

        pointRadius: 4,

        pointHoverRadius: 6,

        tension: 0.35,

        fill: true
      }

    ]

  };


  // ==========================================
  // COMMON CHART OPTIONS
  // ==========================================

  const commonPlugins = {

    legend: {

      position: "bottom",

      labels: {

        usePointStyle: true,

        pointStyle: "circle",

        padding: 20,

        font: {
          size: 13
        }

      }

    },

    tooltip: {

      backgroundColor: "rgba(33, 37, 41, 0.95)",

      padding: 12,

      cornerRadius: 8,

      titleFont: {
        size: 13,
        weight: "600"
      },

      bodyFont: {
        size: 13
      },

      displayColors: true

    }

  };


  // ==========================================
  // LINE OPTIONS
  // ==========================================

  const lineOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {

      mode: "index",

      intersect: false

    },

    plugins: commonPlugins,

    scales: {

      x: {

        grid: {
          display: false
        },

        ticks: {

          maxRotation: 45,

          minRotation: 0,

          font: {
            size: 11
          }

        }

      },

      y: {

        beginAtZero: true,

        grid: {

          color: "rgba(0, 0, 0, 0.06)"

        },

        ticks: {

          font: {
            size: 11
          }

        }

      }

    }

  };


  // ==========================================
  // RATING OPTIONS
  // ==========================================

  const ratingOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {

      mode: "index",

      intersect: false

    },

    plugins: commonPlugins,

    scales: {

      x: {

        grid: {
          display: false
        },

        ticks: {

          maxRotation: 45,

          minRotation: 0,

          font: {
            size: 11
          }

        }

      },

      y: {

        min: 1,

        max: 5,

        ticks: {

          stepSize: 1,

          font: {
            size: 11
          }

        },

        grid: {

          color: "rgba(0, 0, 0, 0.06)"

        }

      }

    }

  };


  // ==========================================
  // BAR OPTIONS
  // ==========================================

  const barOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {

      mode: "index",

      intersect: false

    },

    plugins: commonPlugins,

    scales: {

      x: {

        grid: {
          display: false
        },

        ticks: {

          maxRotation: 45,

          minRotation: 0,

          font: {
            size: 11
          }

        }

      },

      y: {

        beginAtZero: true,

        grid: {

          color: "rgba(0, 0, 0, 0.06)"

        },

        ticks: {

          font: {
            size: 11
          }

        }

      }

    }

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="container dashboard-container py-5">


      {/* ======================================
          TITLE
      ====================================== */}

      <h1 className="page-title">

        Review Trends

      </h1>


      <p className="page-subtitle mb-4">

        Analyze how customer feedback changes
        over time.

      </p>


      {/* ======================================
          KPI CARDS
      ====================================== */}

      <div className="row g-4 mb-4">


        <div className="col-md-4">

          <div className="card h-100">

            <div className="card-body">

              <small className="text-muted">

                Total Reviews

              </small>

              <h2 className="mt-2">

                {trends.reduce(
                  (sum, item) =>
                    sum + item.reviews,
                  0
                )}

              </h2>

            </div>

          </div>

        </div>


        <div className="col-md-4">

          <div className="card h-100">

            <div className="card-body">

              <small className="text-muted">

                Months Analyzed

              </small>

              <h2 className="mt-2">

                {trends.length}

              </h2>

            </div>

          </div>

        </div>


        <div className="col-md-4">

          <div className="card h-100">

            <div className="card-body">

              <small className="text-muted">

                Latest Average Rating

              </small>

              <h2 className="mt-2">

                {trends.length > 0
                  ? trends[
                      trends.length - 1
                    ].average_rating
                  : "N/A"
                }

              </h2>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          REVIEW VOLUME
      ====================================== */}

      <div className="card mb-4">

        <div className="card-body">

          <h5 className="mb-4">

            Review Volume Over Time

          </h5>

          <div
            style={{
              height: "350px"
            }}
          >

            <Line
              data={reviewVolumeData}
              options={lineOptions}
            />

          </div>

        </div>

      </div>


      {/* ======================================
          RATING TREND
      ====================================== */}

      <div className="card mb-4">

        <div className="card-body">

          <h5 className="mb-4">

            Average Rating Over Time

          </h5>

          <div
            style={{
              height: "350px"
            }}
          >

            <Line
              data={ratingTrendData}
              options={ratingOptions}
            />

          </div>

        </div>

      </div>


      {/* ======================================
          SENTIMENT
      ====================================== */}

      <div className="card mb-4">

        <div className="card-body">

          <h5 className="mb-4">

            Sentiment Over Time

          </h5>

          <div
            style={{
              height: "350px"
            }}
          >

            <Bar
              data={sentimentData}
              options={barOptions}
            />

          </div>

        </div>

      </div>


      {/* ======================================
          ANOMALIES
      ====================================== */}

      <div className="card">

        <div className="card-body">

          <h5 className="mb-4">

            Anomaly Rate Over Time

          </h5>

          <div
            style={{
              height: "350px"
            }}
          >

            <Line
              data={anomalyData}
              options={lineOptions}
            />

          </div>

        </div>

      </div>


    </div>

  );

}


export default ReviewTrends;