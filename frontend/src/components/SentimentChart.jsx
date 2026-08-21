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


function SentimentChart({ sentiment }) {

  const data = {
    labels: Object.keys(sentiment),

    datasets: [
      {
        label: "Reviews",

        data: Object.values(sentiment),

        backgroundColor: [
          "#22c55e",
          "#f59e0b",
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

    cutout: "65%",

    plugins: {

      legend: {
        position: "bottom",

        labels: {
          padding: 20,

          usePointStyle: true,

          pointStyle: "circle",

          font: {
            size: 13
          }
        }
      },

      tooltip: {

        padding: 12,

        callbacks: {

          label: function (context) {

            const value = context.raw;

            const total =
              context.dataset.data.reduce(
                (sum, value) => sum + value,
                0
              );

            const percentage =
              ((value / total) * 100).toFixed(1);

            return ` ${value} reviews (${percentage}%)`;
          }

        }

      }

    }

  };


  return (

    <div className="card chart-card h-100">

      <div className="card-body">

        <h5 className="chart-title mb-4">
          Sentiment Distribution
        </h5>

        <div style={{ height: "320px" }}>

          <Doughnut
            data={data}
            options={options}
          />

        </div>

      </div>

    </div>

  );

}


export default SentimentChart;