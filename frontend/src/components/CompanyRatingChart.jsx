import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);


function CompanyRatingChart({ ratings = {} }) {

  const data = {

    labels: [
      "1 Star",
      "2 Stars",
      "3 Stars",
      "4 Stars",
      "5 Stars"
    ],

    datasets: [
      {
        label: "Reviews",

        data: [
          ratings["1"] || 0,
          ratings["2"] || 0,
          ratings["3"] || 0,
          ratings["4"] || 0,
          ratings["5"] || 0
        ],

        backgroundColor: [
          "#dc3545",
          "#fd7e14",
          "#ffc107",
          "#20c997",
          "#198754"
        ],

        borderRadius: 6,

        borderSkipped: false
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
        callbacks: {
          label: function (context) {

            return ` ${context.raw} reviews`;

          }
        }
      }

    },

    scales: {

      x: {

        grid: {
          display: false
        },

        ticks: {
          font: {
            size: 12
          }
        }

      },

      y: {

        beginAtZero: true,

        ticks: {
          precision: 0
        },

        grid: {
          color: "rgba(0, 0, 0, 0.08)"
        }

      }

    }

  };


  return (

    <div
      style={{
        position: "relative",
        height: "320px",
        width: "100%"
      }}
    >

      <Bar
        data={data}
        options={options}
      />

    </div>

  );

}


export default CompanyRatingChart;