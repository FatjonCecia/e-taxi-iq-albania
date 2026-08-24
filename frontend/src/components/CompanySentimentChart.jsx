import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);


function CompanySentimentChart({ sentiment = {} }) {

  const data = {
    labels: [
      "Positive",
      "Neutral",
      "Negative"
    ],

    datasets: [
      {
        data: [
          sentiment.positive || 0,
          sentiment.neutral || 0,
          sentiment.negative || 0
        ],

        backgroundColor: [
          "#198754",
          "#ffc107",
          "#dc3545"
        ],

        borderWidth: 0,

        hoverOffset: 6
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

          font: {
            size: 13
          }
        }
      },

      tooltip: {
        callbacks: {
          label: function (context) {

            const value = context.raw;

            return ` ${context.label}: ${value} reviews`;

          }
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

      <Doughnut
        data={data}
        options={options}
      />

    </div>

  );

}


export default CompanySentimentChart;