import { useEffect, useState } from "react";

import {
  getAnalytics,
  getCompanyIntelligence
} from "../services/api";

import "../App.css";

import CompanySentimentChart from "../components/CompanySentimentChart";
import CompanyRatingChart from "../components/CompanyRatingChart";
import CompanyAspectChart from "../components/CompanyAspectChart";


function CompanyIntelligence() {

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [data, setData] = useState(null);

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState(null);


  // ==========================================
  // LOAD COMPANIES
  // ==========================================

  useEffect(() => {

    const loadCompanies = async () => {

      try {

        const analytics = await getAnalytics();

        const companyData =
          analytics.company_distribution || [];


        // Remove duplicate company IDs

        const uniqueCompanies = Array.from(
          new Map(
            companyData.map((company) => [
              company.company_id,
              company
            ])
          ).values()
        );


        setCompanies(uniqueCompanies);


        if (uniqueCompanies.length > 0) {

          setSelectedCompany(
            uniqueCompanies[0].company_id
          );

        }

      } catch (error) {

        console.error(error);

        setError(
          "Could not load companies."
        );

      } finally {

        setLoadingCompanies(false);

      }

    };


    loadCompanies();

  }, []);


  // ==========================================
  // LOAD COMPANY INTELLIGENCE
  // ==========================================

  useEffect(() => {

    if (!selectedCompany) {
      return;
    }


    const loadIntelligence = async () => {

      try {

        setLoadingData(true);
        setError(null);


        const result =
          await getCompanyIntelligence(
            selectedCompany
          );


        setData(result);

      } catch (error) {

        console.error(error);

        setError(
          "Could not load company intelligence."
        );

      } finally {

        setLoadingData(false);

      }

    };


    loadIntelligence();

  }, [selectedCompany]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loadingCompanies) {

    return (

      <div className="container dashboard-container py-5">

        <h3>
          Loading companies...
        </h3>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="container dashboard-container py-5">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-4">

        <h1 className="page-title">
          Company Intelligence
        </h1>

        <p className="page-subtitle">
          Analyze customer experience and ML insights
          for each taxi company.
        </p>

      </div>


      {/* ======================================
          COMPANY SELECTOR
      ====================================== */}

      <div className="card mb-4">

        <div className="card-body">

          <label className="form-label">
            Select Company
          </label>

          <select
            className="form-select"
            value={selectedCompany}
            onChange={(e) =>
              setSelectedCompany(e.target.value)
            }
          >

            {companies.map((company) => (

              <option
                key={company.company_id}
                value={company.company_id}
              >

                {company.company_name}

              </option>

            ))}

          </select>

        </div>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {/* ======================================
          LOADING DATA
      ====================================== */}

      {loadingData && (

        <div className="text-center py-5">

          <div
            className="spinner-border"
            role="status"
          />

          <p className="mt-3">
            Analyzing company data...
          </p>

        </div>

      )}


      {/* ======================================
          COMPANY DATA
      ====================================== */}

      {!loadingData && data && (

        <>


          {/* ==================================
              COMPANY HEADER
          ================================== */}

          <div className="mb-4">

            <h2>
              {data.company_name}
            </h2>

            <p className="text-muted">
              Company ID: {data.company_id}
            </p>

          </div>


          {/* ==================================
              KPI CARDS
          ================================== */}

          <div className="row g-4 mb-4">


            <div className="col-md-3">

              <div className="card h-100">

                <div className="card-body">

                  <small className="text-muted">
                    Average Rating
                  </small>

                  <h2 className="mt-2">
                    {data.average_rating}
                  </h2>

                </div>

              </div>

            </div>


            <div className="col-md-3">

              <div className="card h-100">

                <div className="card-body">

                  <small className="text-muted">
                    Total Reviews
                  </small>

                  <h2 className="mt-2">
                    {data.total_reviews}
                  </h2>

                </div>

              </div>

            </div>


            <div className="col-md-3">

              <div className="card h-100">

                <div className="card-body">

                  <small className="text-muted">
                    Negative Reviews
                  </small>

                  <h2 className="mt-2">
                    {data.negative_reviews.total}
                  </h2>

                  <small className="text-muted">
                    {data.negative_reviews.percentage}%
                  </small>

                </div>

              </div>

            </div>


            <div className="col-md-3">

              <div className="card h-100">

                <div className="card-body">

                  <small className="text-muted">
                    Anomalies
                  </small>

                  <h2 className="mt-2">
                    {data.anomalies.total}
                  </h2>

                  <small className="text-muted">
                    {data.anomalies.percentage}%
                  </small>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================
              CHARTS
          ================================== */}

          <div className="row g-4 mb-4">


            {/* SENTIMENT */}

            <div className="col-lg-6">

              <div className="card h-100">

                <div className="card-body">

                  <h5 className="mb-4">
                    Sentiment Distribution
                  </h5>

                  <div
                    className="company-chart-container"
                  >

                    <CompanySentimentChart
                      sentiment={
                        data.sentiment_distribution
                      }
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* RATINGS */}

            <div className="col-lg-6">

              <div className="card h-100">

                <div className="card-body">

                  <h5 className="mb-4">
                    Rating Distribution
                  </h5>

                  <div
                    className="company-chart-container"
                  >

                    <CompanyRatingChart
                      ratings={
                        data.rating_distribution
                      }
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================
              ASPECT CHART
          ================================== */}

          <div className="card mb-4">

            <div className="card-body">

              <h5 className="mb-4">
                Customer Experience by Aspect
              </h5>

              <div
                className="company-aspect-chart-container"
              >

                <CompanyAspectChart
                  aspects={
                    data.aspect_distribution
                  }
                />

              </div>

            </div>

          </div>


          {/* ==================================
              REVIEW INTEGRITY
          ================================== */}

          <div className="card mb-4">

            <div className="card-body">

              <h5 className="mb-4">
                Review Integrity
              </h5>


              <div className="mb-4">

                <div className="d-flex justify-content-between mb-1">

                  <span>
                    Normal Reviews
                  </span>

                  <strong>
                    {data.anomalies.normal}
                  </strong>

                </div>

                <div className="progress">

                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        100 -
                        data.anomalies.percentage
                      }%`
                    }}
                  />

                </div>

              </div>


              <div>

                <div className="d-flex justify-content-between mb-1">

                  <span>
                    Anomalies
                  </span>

                  <strong>
                    {data.anomalies.total}
                  </strong>

                </div>

                <div className="progress">

                  <div
                    className="progress-bar bg-danger"
                    style={{
                      width: `${
                        data.anomalies.percentage
                      }%`
                    }}
                  />

                </div>

              </div>

            </div>

          </div>


        </>

      )}

    </div>

  );

}


export default CompanyIntelligence;