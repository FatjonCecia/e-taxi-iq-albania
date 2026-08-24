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


function CompanyAspectChart({ aspects = {} }) {

  const entries = Object.entries(aspects)
    .sort((a, b) => b[1] - a[1]);


  const labels = entries.map(
    ([aspect]) =>
      aspect
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        )
  );


  const values = entries.map(
    ([, count]) => count
  );


  const data = {

    labels,

    datasets: [
      {
        label: "Reviews",

        data: values,

        backgroundColor: "#0d6efd",

        borderRadius: 6,

        borderSkipped: false
      }
    ]

  };


  const options = {

    responsive: true,

    maintainAspectRatio: false,

    indexAxis: "y",

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

        beginAtZero: true,

        ticks: {
          precision: 0
        },

        grid: {
          color: "rgba(0, 0, 0, 0.08)"
        }

      },

      y: {

        grid: {
          display: false
        },

        ticks: {
          font: {
            size: 12
          }
        }

      }

    }

  };


  return (

    <div
      style={{
        position: "relative",
        height: "420px",
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


export default CompanyAspectChart;