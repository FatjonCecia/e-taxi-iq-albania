import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

import "../App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);


function RatingChart({ ratings }) {

  const data = {
    labels: Object.keys(ratings).map(
      rating => `${rating} ⭐`
    ),

    datasets: [
      {
        label: "Reviews",

        data: Object.values(ratings),

        backgroundColor: "#f59e0b",

        borderRadius: 7,

        borderSkipped: false,

        maxBarThickness: 35
      }
    ]
  };


  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      },

      tooltip: {
        displayColors: false,

        padding: 10
      }

    },

    scales: {

      y: {

        beginAtZero: true,

        ticks: {
          precision: 0
        },

        grid: {
          color: "#eef0f3"
        }

      },

      x: {

        grid: {
          display: false
        }

      }

    }

  };


  return (

    <div className="card chart-card h-100">

      <div className="card-body p-3 p-md-4">

        <h5 className="chart-title mb-1">
          Rating Distribution
        </h5>

        <p className="text-muted small mb-3">
          How customers rated their trips
        </p>

        <div className="rating-chart-container">

          <Bar
            data={data}
            options={options}
          />

        </div>

      </div>

    </div>

  );
}


export default RatingChart;