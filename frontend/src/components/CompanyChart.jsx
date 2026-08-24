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


function CompanyChart({ companies }) {

  // ==========================================
  // PREPARE COMPANY DATA
  // ==========================================

  const companyData = Array.isArray(companies)
    ? companies
    : [];


  const data = {

    labels: companyData.map(
      (company) => company.company_name
    ),

    datasets: [
      {
        label: "Reviews",

        data: companyData.map(
          (company) => company.count
        ),

        backgroundColor: "#3b82f6",

        borderRadius: 8,

        borderSkipped: false
      }
    ]

  };


  // ==========================================
  // CHART OPTIONS
  // ==========================================

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      },

      tooltip: {
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
          color: "#e5e7eb"
        }

      },

      x: {

        grid: {
          display: false
        },

        ticks: {

          maxRotation: 45,

          minRotation: 0

        }

      }

    }

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="card chart-card h-100">

      <div className="card-body">

        <h5 className="chart-title mb-4">
          Reviews by Company
        </h5>

        <div style={{ height: "320px" }}>

          <Bar
            data={data}
            options={options}
          />

        </div>

      </div>

    </div>

  );

}


export default CompanyChart;