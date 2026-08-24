import { useEffect, useState } from "react";

import { getCompanyComparison } from "../services/api";

import "../App.css";


function CompanyComparison() {

  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  // ==========================================
  // LOAD COMPARISON DATA
  // ==========================================

  useEffect(() => {

    const loadComparison = async () => {

      try {

        setLoading(true);
        setError(null);

        const data = await getCompanyComparison();

        setCompanies(
          data.companies || []
        );

      } catch (error) {

        console.error(error);

        setError(
          "Could not load company comparison."
        );

      } finally {

        setLoading(false);

      }

    };


    loadComparison();

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
            Loading company comparison...
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


  return (

    <div className="container dashboard-container py-5">


      {/* ======================================
          TITLE
      ====================================== */}

      <h1 className="page-title">

        Company Comparison

      </h1>


      <p className="page-subtitle mb-4">

        Compare customer experience and review
        intelligence across taxi companies.

      </p>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="card mb-4">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="mb-1">

                Company Performance

              </h5>

              <small className="text-muted">

                {companies.length} companies analyzed

              </small>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          COMPANY TABLE
      ====================================== */}

      <div className="card">

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    Company
                  </th>

                  <th>
                    Reviews
                  </th>

                  <th>
                    Average Rating
                  </th>

                  <th>
                    Positive
                  </th>

                  <th>
                    Negative
                  </th>

                  <th>
                    Anomalies
                  </th>

                  <th>
                    Top Aspect
                  </th>

                </tr>

              </thead>


              <tbody>

                {companies.map(
                  (company, index) => (

                    <tr
                      key={`${company.company_id}-${index}`}
                    >

                      {/* RANK */}

                      <td>

                        <strong>
                          {index + 1}
                        </strong>

                      </td>


                      {/* COMPANY */}

                      <td>

                        <strong>
                          {company.company_name}
                        </strong>

                        <small className="text-muted d-block">

                          {company.company_id}

                        </small>

                      </td>


                      {/* REVIEWS */}

                      <td>

                        {company.total_reviews}

                      </td>


                      {/* RATING */}

                      <td>

                        <strong>

                          {company.average_rating.toFixed(2)}

                        </strong>

                      </td>


                      {/* POSITIVE */}

                      <td>

                        <span className="badge bg-success">

                          {company.positive_percentage}%

                        </span>

                      </td>


                      {/* NEGATIVE */}

                      <td>

                        <span className="badge bg-danger">

                          {company.negative_percentage}%

                        </span>

                      </td>


                      {/* ANOMALIES */}

                      <td>

                        <span className="badge bg-warning text-dark">

                          {company.anomaly_percentage}%

                        </span>

                      </td>


                      {/* TOP ASPECT */}

                      <td>

                        {company.top_aspect
                          ? company.top_aspect
                              .replace(/_/g, " ")
                          : "N/A"
                        }

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* ======================================
          PERFORMANCE CARDS
      ====================================== */}

      <div className="row g-4 mt-1">


        {/* BEST RATING */}

        <div className="col-md-4">

          <div className="card h-100">

            <div className="card-body">

              <small className="text-muted">

                Highest Average Rating

              </small>

              <h4 className="mt-2">

                {companies[0]?.company_name || "N/A"}

              </h4>

              <p className="mb-0 text-muted">

                Rating:{" "}

                <strong>

                  {companies[0]?.average_rating
                    ?.toFixed(2) || "N/A"
                  }

                </strong>

              </p>

            </div>

          </div>

        </div>


        {/* MOST POSITIVE */}

        <div className="col-md-4">

          <div className="card h-100">

            <div className="card-body">

              <small className="text-muted">

                Most Positive Reviews

              </small>

              <h4 className="mt-2">

                {companies.length > 0
                  ? companies.reduce(
                      (best, company) =>
                        company.positive_percentage >
                        best.positive_percentage
                          ? company
                          : best
                    ).company_name
                  : "N/A"
                }

              </h4>

            </div>

          </div>

        </div>


        {/* FEWEST ANOMALIES */}

        <div className="col-md-4">

          <div className="card h-100">

            <div className="card-body">

              <small className="text-muted">

                Lowest Anomaly Rate

              </small>

              <h4 className="mt-2">

                {companies.length > 0
                  ? companies.reduce(
                      (best, company) =>
                        company.anomaly_percentage <
                        best.anomaly_percentage
                          ? company
                          : best
                    ).company_name
                  : "N/A"
                }

              </h4>

            </div>

          </div>

        </div>

      </div>


    </div>

  );

}


export default CompanyComparison;