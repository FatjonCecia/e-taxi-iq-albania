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


function AspectChart({ aspects }) {

  const data = {
    labels: Object.keys(aspects),

    datasets: [
      {
        label: "Reviews",
        data: Object.values(aspects),

        backgroundColor: "#8b5cf6",

        borderRadius: 6,

        borderSkipped: false,

        barThickness: 16,

        maxBarThickness: 20
      }
    ]
  };


  const options = {

    indexAxis: "y",

    responsive: true,

    maintainAspectRatio: false,

    resizeDelay: 100,

    plugins: {

      legend: {
        display: false
      },

      tooltip: {
        displayColors: false,

        padding: 10
      }

    },

    layout: {
      padding: {
        top: 5,
        right: 10,
        bottom: 5,
        left: 0
      }
    },

    scales: {

      x: {

        beginAtZero: true,

        ticks: {
          precision: 0,

          font: {
            size: 11
          }
        },

        grid: {
          color: "#eef0f3"
        }

      },

      y: {

        grid: {
          display: false
        },

        ticks: {
          autoSkip: false,

          padding: 6,

          font: {
            size: 11
          },

          callback: function(value) {

            const label = this.getLabelForValue(value);

            // Keep long labels from becoming too wide
            return label.length > 18
              ? label.substring(0, 18) + "..."
              : label;

          }

        }

      }

    }

  };


  return (

    <div className="card chart-card">

      <div className="card-body p-3 p-md-4">

        <h5 className="chart-title mb-1">
          Reviews by Aspect
        </h5>

        <p className="text-muted small mb-3">
          What customers are talking about
        </p>


        {/* Responsive chart wrapper */}

        <div className="aspect-chart-container">

          <Bar
            data={data}
            options={options}
          />

        </div>

      </div>

    </div>

  );
}


export default AspectChart;