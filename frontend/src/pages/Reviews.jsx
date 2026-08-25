import { useEffect, useState, useRef } from "react";

import { getReviews, getAnalytics } from "../services/api";
import "../App.css";


function Reviews() {

  // ==========================================
  // DATA STATE
  // ==========================================

  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [reviews, setReviews] = useState([]);


  // ==========================================
  // FILTER STATE
  // ==========================================

  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [anomalyOnly, setAnomalyOnly] = useState(false);
  const [search, setSearch] = useState("");


  // ==========================================
  // PAGINATION STATE
  // ==========================================

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // ==========================================
  // LOADING / ERROR
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // ==========================================
  // SEARCH DEBOUNCE
  // ==========================================

  const searchTimeout = useRef(null);


  // ==========================================
  // CONFIDENCE HELPER
  // ==========================================

  const getConfidenceLevel = (confidence) => {

    if (confidence == null) {
      return {
        label: "N/A",
        className: "bg-secondary"
      };
    }

    if (confidence >= 0.80) {
      return {
        label: "High",
        className: "bg-success"
      };
    }

    if (confidence >= 0.60) {
      return {
        label: "Medium",
        className: "bg-warning text-dark"
      };
    }

    return {
      label: "Low",
      className: "bg-danger"
    };

  };


  // ==========================================
  // LOAD FILTER OPTIONS
  // ==========================================

  useEffect(() => {

    const loadFilterOptions = async () => {

      try {

        const data = await getAnalytics();

        setCompanies(
          data.company_distribution || []
        );

        setCities(
          Object.keys(data.city_distribution || {})
        );

      } catch (error) {

        console.error(
          "Could not load filter options:",
          error
        );

      }

    };

    loadFilterOptions();

  }, []);


  // ==========================================
  // RESET PAGE WHEN FILTERS CHANGE
  // ==========================================

  useEffect(() => {

    setPage(1);

  }, [
    company,
    city,
    rating,
    sentiment,
    anomalyOnly,
    search
  ]);


  // ==========================================
  // LOAD REVIEWS
  // ==========================================

  useEffect(() => {

    const loadReviews = async () => {

      try {

        setLoading(true);
        setError(null);

        const filters = {};


        if (company) {
          filters.company_id = company;
        }


        if (city) {
          filters.city = city;
        }


        if (rating) {
          filters.rating = Number(rating);
        }


        if (sentiment) {
          filters.sentiment = sentiment;
        }


        if (anomalyOnly) {
          filters.is_anomaly = true;
        }


        if (search.trim()) {
          filters.search = search.trim();
        }


        filters.page = page;
        filters.limit = 10;


        const data = await getReviews(filters);


        setReviews(
          data.reviews || []
        );


        setTotalPages(
          data.total_pages || 1
        );

      } catch (error) {

        console.error(
          "Could not load reviews:",
          error
        );

        setError(
          "Could not load reviews."
        );

      } finally {

        setLoading(false);

      }

    };


    clearTimeout(
      searchTimeout.current
    );


    const delay = search.trim()
      ? 500
      : 0;


    searchTimeout.current = setTimeout(
      () => {
        loadReviews();
      },
      delay
    );


    return () => {

      clearTimeout(
        searchTimeout.current
      );

    };

  }, [
    company,
    city,
    rating,
    sentiment,
    anomalyOnly,
    search,
    page
  ]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="container py-5">

        <h3>
          Loading reviews...
        </h3>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="container py-5">

        <div className="alert alert-danger">

          {error}

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="container dashboard-container py-5">


      {/* ======================================
          TITLE
      ====================================== */}

      <h1 className="page-title">
        Review Intelligence
      </h1>


      <p className="page-subtitle mb-4">
        Explore customer reviews and ML insights
      </p>


      {/* ======================================
          FILTER BAR
      ====================================== */}

      <div className="card mb-4">

        <div className="card-body">

          <h5 className="mb-3">
            Filter Reviews
          </h5>


          {/* SEARCH */}

          <div className="mb-3">

            <label className="form-label">
              Search reviews
            </label>


            <div className="input-group">

              <span className="input-group-text">
                🔍
              </span>


              <input
                type="text"
                className="form-control"
                placeholder="Search review text..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          <div className="row g-3">


            {/* COMPANY */}

            <div className="col-md-3">

              <label className="form-label">
                Company
              </label>


              <select
                className="form-select"
                value={company}
                onChange={(e) => {

                  setCompany(e.target.value);
                  setPage(1);

                }}
              >

                <option value="">
                  All companies
                </option>


                {companies.map((item) => (

                  <option
                    key={item.company_id}
                    value={item.company_id}
                  >

                    {item.company_name}

                  </option>

                ))}

              </select>

            </div>


            {/* CITY */}

            <div className="col-md-3">

              <label className="form-label">
                City
              </label>


              <select
                className="form-select"
                value={city}
                onChange={(e) => {

                  setCity(e.target.value);
                  setPage(1);

                }}
              >

                <option value="">
                  All cities
                </option>


                {cities.map((item) => (

                  <option
                    key={item}
                    value={item}
                  >

                    {item}

                  </option>

                ))}

              </select>

            </div>


            {/* RATING */}

            <div className="col-md-2">

              <label className="form-label">
                Rating
              </label>


              <select
                className="form-select"
                value={rating}
                onChange={(e) => {

                  setRating(e.target.value);
                  setPage(1);

                }}
              >

                <option value="">
                  All ratings
                </option>

                <option value="5">
                  ⭐ 5
                </option>

                <option value="4">
                  ⭐ 4
                </option>

                <option value="3">
                  ⭐ 3
                </option>

                <option value="2">
                  ⭐ 2
                </option>

                <option value="1">
                  ⭐ 1
                </option>

              </select>

            </div>


            {/* SENTIMENT */}

            <div className="col-md-2">

              <label className="form-label">
                Sentiment
              </label>


              <select
                className="form-select"
                value={sentiment}
                onChange={(e) => {

                  setSentiment(e.target.value);
                  setPage(1);

                }}
              >

                <option value="">
                  All
                </option>

                <option value="positive">
                  Positive
                </option>

                <option value="neutral">
                  Neutral
                </option>

                <option value="negative">
                  Negative
                </option>

              </select>

            </div>


            {/* RESET */}

            <div className="col-md-2 d-flex align-items-end">

              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {

                  setCompany("");
                  setCity("");
                  setRating("");
                  setSentiment("");
                  setSearch("");
                  setAnomalyOnly(false);
                  setPage(1);

                }}
              >

                Reset Filters

              </button>

            </div>

          </div>


          {/* ANOMALY FILTER */}

          <div className="form-check mt-3">

            <input
              className="form-check-input"
              type="checkbox"
              id="anomalyOnly"
              checked={anomalyOnly}
              onChange={(e) => {

                setAnomalyOnly(
                  e.target.checked
                );

                setPage(1);

              }}
            />


            <label
              className="form-check-label"
              htmlFor="anomalyOnly"
            >

              🚨 Show anomalies only

            </label>

          </div>

        </div>

      </div>


      {/* ======================================
          REVIEW COUNT
      ====================================== */}

      <div className="mb-4">

        <strong>
          {reviews.length}
        </strong>{" "}

        reviews on this page

      </div>


      {/* ======================================
          REVIEWS
      ====================================== */}

      <div className="row g-4">

        {reviews.map((review) => {

          const sentimentConfidence =
            getConfidenceLevel(
              review.sentiment_confidence
            );


          const aspectConfidence =
            getConfidenceLevel(
              review.aspect_confidence
            );


          const anomalyConfidence =
            getConfidenceLevel(
              review.anomaly_confidence
            );


          return (

            <div
              className="col-12"
              key={review.review_id}
            >

              <div className="card review-card">

                <div className="card-body">


                  {/* HEADER */}

                  <div className="d-flex justify-content-between align-items-start">

                    <div>

                      <h5 className="mb-1">
                        {review.company_name}
                      </h5>


                      <small className="text-muted">
                        {review.city}
                      </small>

                    </div>


                    {/* RATING */}

                    <div className="review-rating">

                      {"⭐".repeat(review.rating)}

                    </div>

                  </div>


                  <hr />


                  {/* REVIEW TEXT */}

                  <p className="review-text">
                    {review.review_text}
                  </p>


                  {/* ==================================
                      ML PREDICTIONS
                  ================================== */}

                  <div className="row g-3 mt-2">


                    {/* SENTIMENT */}

                    <div className="col-md-4">

                      <div className="border rounded p-3 h-100">

                        <small className="text-muted d-block">
                          Sentiment
                        </small>


                        <strong className="text-capitalize">
                          {review.overall_sentiment || "N/A"}
                        </strong>


                        <div className="d-flex justify-content-between mt-2">

                          <small>
                            Confidence
                          </small>

                          <strong>

                            {review.sentiment_confidence != null
                              ? `${(
                                  review.sentiment_confidence * 100
                                ).toFixed(1)}%`
                              : "N/A"
                            }

                          </strong>

                        </div>


                        {review.sentiment_confidence != null && (

                          <div className="progress mt-1">

                            <div
                              className="progress-bar"
                              style={{
                                width: `${
                                  review.sentiment_confidence * 100
                                }%`
                              }}
                            />

                          </div>

                        )}


                        <span
                          className={`badge ${sentimentConfidence.className} mt-2`}
                        >

                          {sentimentConfidence.label}

                        </span>

                      </div>

                    </div>


                    {/* ASPECT */}

                    <div className="col-md-4">

                      <div className="border rounded p-3 h-100">

                        <small className="text-muted d-block">
                          Primary Aspect
                        </small>


                        <strong className="text-capitalize">

                          {review.primary_aspect
                            ? review.primary_aspect.replace(/_/g, " ")
                            : "N/A"
                          }

                        </strong>


                        <div className="d-flex justify-content-between mt-2">

                          <small>
                            Confidence
                          </small>

                          <strong>

                            {review.aspect_confidence != null
                              ? `${(
                                  review.aspect_confidence * 100
                                ).toFixed(1)}%`
                              : "N/A"
                            }

                          </strong>

                        </div>


                        {review.aspect_confidence != null && (

                          <div className="progress mt-1">

                            <div
                              className="progress-bar"
                              style={{
                                width: `${
                                  review.aspect_confidence * 100
                                }%`
                              }}
                            />

                          </div>

                        )}


                        <span
                          className={`badge ${aspectConfidence.className} mt-2`}
                        >

                          {aspectConfidence.label}

                        </span>

                      </div>

                    </div>


                    {/* ANOMALY */}

                    <div className="col-md-4">

                      <div className="border rounded p-3 h-100">

                        <small className="text-muted d-block">
                          Anomaly Detection
                        </small>


                        <strong>

                          {review.is_anomaly
                            ? " Detected"
                            : " Normal"
                          }

                        </strong>


                        <div className="d-flex justify-content-between mt-2">

                          <small>
                            Confidence
                          </small>

                          <strong>

                            {review.anomaly_confidence != null
                              ? `${(
                                  review.anomaly_confidence * 100
                                ).toFixed(1)}%`
                              : "N/A"
                            }

                          </strong>

                        </div>


                        {review.anomaly_confidence != null && (

                          <div className="progress mt-1">

                            <div
                              className="progress-bar"
                              style={{
                                width: `${
                                  review.anomaly_confidence * 100
                                }%`
                              }}
                            />

                          </div>

                        )}


                        <span
                          className={`badge ${anomalyConfidence.className} mt-2`}
                        >

                          {anomalyConfidence.label}

                        </span>

                      </div>

                    </div>

                  </div>


                  {/* ANOMALY REASON */}

                  {review.anomaly_reason && (

                    <div className="alert alert-warning mt-3 mb-0">

                      <strong>
                        Anomaly:
                      </strong>{" "}

                      {review.anomaly_reason}

                    </div>

                  )}


                  {/* DATE */}

                  <small className="text-muted d-block mt-3">

                    {review.review_date}

                  </small>


                </div>

              </div>

            </div>

          );

        })}


        {/* NO RESULTS */}

        {reviews.length === 0 && (

          <div className="alert alert-info">

            No reviews match the selected filters.

          </div>

        )}

      </div>


      {/* ======================================
          PAGINATION
      ====================================== */}

      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">


        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={() =>
            setPage((currentPage) => currentPage - 1)
          }
        >

          ← Previous

        </button>


        <span>

          Page{" "}

          <strong>
            {page}
          </strong>{" "}

          of{" "}

          <strong>
            {totalPages}
          </strong>

        </span>


        <button
          className="btn btn-outline-primary"
          disabled={page >= totalPages}
          onClick={() =>
            setPage((currentPage) => currentPage + 1)
          }
        >

          Next →

        </button>

      </div>

    </div>

  );

}


export default Reviews;
