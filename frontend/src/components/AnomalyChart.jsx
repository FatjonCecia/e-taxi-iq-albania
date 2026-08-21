import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

import "../App.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);


function AnomalyChart({ anomalies }) {

  const total = anomalies.total;
  const normal = anomalies.normal;

  const totalReviews = total + normal;

  const anomalyPercentage =
    totalReviews > 0
      ? ((total / totalReviews) * 100).toFixed(2)
      : 0;


  const data = {

    labels: [
      "Normal",
      "Anomalous"
    ],

    datasets: [
      {
        data: [
          normal,
          total
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444"
        ],

        borderColor: "#ffffff",

        borderWidth: 3,

        hoverOffset: 8
      }
    ]

  };


  const options = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "68%",

    plugins: {

      legend: {

        position: "bottom",

        labels: {

          usePointStyle: true,

          pointStyle: "circle",

          padding: 18,

          font: {
            size: 12
          }

        }

      },

      tooltip: {

        padding: 10,

        displayColors: false,

        callbacks: {

          label: function(context) {

            const value = context.raw;

            const percentage =
              ((value / totalReviews) * 100).toFixed(2);

            return `${value} reviews (${percentage}%)`;

          }

        }

      }

    }

  };


  return (

    <div className="card chart-card h-100">

      <div className="card-body p-3 p-md-4">

        <h5 className="chart-title mb-1">
          Anomaly Analysis
        </h5>

        <p className="text-muted small mb-3">
          Review anomaly detection
        </p>


        <div className="anomaly-chart-container">

          <Doughnut
            data={data}
            options={options}
          />

        </div>


        <div className="anomaly-summary">

          <div>

            <span className="anomaly-summary-label">
              Anomaly Rate
            </span>

            <strong>
              {anomalyPercentage}%
            </strong>

          </div>


          <div>

            <span className="anomaly-summary-label">
              Flagged Reviews
            </span>

            <strong>
              {total}
            </strong>

          </div>

        </div>

      </div>

    </div>

  );
}


export default AnomalyChart;