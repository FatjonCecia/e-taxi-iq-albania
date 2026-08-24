import { useEffect, useState } from "react";
import { createReview, getAnalytics } from "../services/api";
import "../App.css";


function SubmitReview() {

  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    review_id: "",
    company_id: "",
    company_name: "",
    city: "",
    rating: 5,
    review_date: new Date().toISOString().split("T")[0],
    review_text: "",
    source_type: "user_submitted"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState(null);


  // ==========================================
  // CONFIDENCE LEVEL
  // ==========================================

  const getConfidenceLevel = (confidence) => {

    if (confidence >= 0.80) {

      return {
        label: "High confidence",
        className: "bg-success"
      };

    }

    if (confidence >= 0.60) {

      return {
        label: "Medium confidence",
        className: "bg-warning text-dark"
      };

    }

    return {
      label: "Low confidence",
      className: "bg-danger"
    };

  };


  // ==========================================
  // LOAD COMPANIES + CITIES
  // ==========================================

  useEffect(() => {

    const loadOptions = async () => {

      try {

        const data = await getAnalytics();

        const companyData =
          data.company_distribution || [];

        const cityData = Object.keys(
          data.city_distribution || {}
        );


        setCompanies(companyData);

        setCities(cityData);


        // Select first company automatically

        if (companyData.length > 0) {

          setForm((previous) => ({
            ...previous,
            company_id:
              companyData[0].company_id,
            company_name:
              companyData[0].company_name
          }));

        }


        // Select first city automatically

        if (cityData.length > 0) {

          setForm((previous) => ({
            ...previous,
            city: cityData[0]
          }));

        }

      } catch (error) {

        console.error(
          "Could not load companies and cities:",
          error
        );

        setError(
          "Could not load companies and cities."
        );

      } finally {

        setLoadingOptions(false);

      }

    };


    loadOptions();

  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;


    // COMPANY

    if (name === "company_id") {

      const selectedCompany = companies.find(
        (company) =>
          company.company_id === value
      );


      setForm((previous) => ({
        ...previous,
        company_id: value,
        company_name:
          selectedCompany?.company_name || ""
      }));


      return;

    }


    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // ==========================================
  // SUBMIT REVIEW
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);


    try {

      const data = await createReview({
        ...form,
        rating: Number(form.rating)
      });


      setResult(data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not analyze the review."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOADING OPTIONS
  // ==========================================

  if (loadingOptions) {

    return (

      <div className="container dashboard-container py-5">

        <h3>
          Loading review form...
        </h3>

      </div>

    );

  }


  return (

    <div className="container dashboard-container py-5">

      <h1 className="page-title">
        Submit Review
      </h1>

      <p className="page-subtitle mb-4">
        Submit a customer review and let the ML models analyze it.
      </p>


      {/* ======================================
          FORM
      ====================================== */}

      <div className="card mb-4">

        <div className="card-body">

          <form onSubmit={handleSubmit}>


            {/* REVIEW ID */}

            <div className="mb-3">

              <label className="form-label">
                Review ID
              </label>

              <input
                type="text"
                name="review_id"
                className="form-control"
                placeholder="REV-0001"
                value={form.review_id}
                onChange={handleChange}
                required
              />

            </div>


            {/* COMPANY + CITY */}

            <div className="row g-3 mb-3">


              {/* COMPANY */}

              <div className="col-md-6">

                <label className="form-label">
                  Company
                </label>

                <select
                  name="company_id"
                  className="form-select"
                  value={form.company_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select company
                  </option>

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


              {/* CITY */}

              <div className="col-md-6">

                <label className="form-label">
                  City
                </label>

                <select
                  name="city"
                  className="form-select"
                  value={form.city}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select city
                  </option>

                  {cities.map((city) => (

                    <option
                      key={city}
                      value={city}
                    >
                      {city}
                    </option>

                  ))}

                </select>

              </div>

            </div>


            {/* RATING */}

            <div className="mb-3">

              <label className="form-label">
                Rating
              </label>

              <select
                name="rating"
                className="form-select"
                value={form.rating}
                onChange={handleChange}
              >

                <option value="5">
                  ⭐⭐⭐⭐⭐ 5
                </option>

                <option value="4">
                  ⭐⭐⭐⭐ 4
                </option>

                <option value="3">
                  ⭐⭐⭐ 3
                </option>

                <option value="2">
                  ⭐⭐ 2
                </option>

                <option value="1">
                  ⭐ 1
                </option>

              </select>

            </div>


            {/* REVIEW DATE */}

            <div className="mb-3">

              <label className="form-label">
                Review Date
              </label>

              <input
                type="date"
                name="review_date"
                className="form-control"
                value={form.review_date}
                onChange={handleChange}
                required
              />

            </div>


            {/* REVIEW TEXT */}

            <div className="mb-4">

              <label className="form-label">
                Review
              </label>

              <textarea
                name="review_text"
                className="form-control"
                rows="5"
                placeholder="Write the customer review here..."
                value={form.review_text}
                onChange={handleChange}
                required
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >

              {loading
                ? "Analyzing..."
                : "Analyze Review"
              }

            </button>

          </form>

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
          ML RESULT
      ====================================== */}

      {result && (

        <div className="card">

          <div className="card-body">

            <h4 className="mb-4">
              ML Analysis
            </h4>


            <div className="row g-4">


              {/* ==================================
                  SENTIMENT
              ================================== */}

              <div className="col-md-4">

                <div className="p-4 border rounded h-100">

                  <small className="text-muted d-block mb-2">
                    Sentiment
                  </small>

                  <h5 className="mb-3 text-capitalize">
                    {result.overall_sentiment}
                  </h5>


                  {result.sentiment_confidence != null && (

                    <>

                      <div className="d-flex justify-content-between mb-1">

                        <small>
                          Confidence
                        </small>

                        <strong>
                          {(
                            result.sentiment_confidence * 100
                          ).toFixed(1)}%
                        </strong>

                      </div>


                      <div
                        className="progress mb-2"
                        role="progressbar"
                        aria-valuenow={
                          result.sentiment_confidence * 100
                        }
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >

                        <div
                          className="progress-bar"
                          style={{
                            width: `${
                              result.sentiment_confidence * 100
                            }%`
                          }}
                        />

                      </div>


                      <span
                        className={`badge ${
                          getConfidenceLevel(
                            result.sentiment_confidence
                          ).className
                        }`}
                      >

                        {
                          getConfidenceLevel(
                            result.sentiment_confidence
                          ).label
                        }

                      </span>

                    </>

                  )}

                </div>

              </div>


              {/* ==================================
                  ASPECT
              ================================== */}

              <div className="col-md-4">

                <div className="p-4 border rounded h-100">

                  <small className="text-muted d-block mb-2">
                    Primary Aspect
                  </small>

                  <h5 className="mb-3 text-capitalize">

                    {result.primary_aspect
                      ? result.primary_aspect.replace(
                          /_/g,
                          " "
                        )
                      : "N/A"
                    }

                  </h5>


                  {result.aspect_confidence != null && (

                    <>

                      <div className="d-flex justify-content-between mb-1">

                        <small>
                          Confidence
                        </small>

                        <strong>
                          {(
                            result.aspect_confidence * 100
                          ).toFixed(1)}%
                        </strong>

                      </div>


                      <div
                        className="progress mb-2"
                        role="progressbar"
                        aria-valuenow={
                          result.aspect_confidence * 100
                        }
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >

                        <div
                          className="progress-bar"
                          style={{
                            width: `${
                              result.aspect_confidence * 100
                            }%`
                          }}
                        />

                      </div>


                      <span
                        className={`badge ${
                          getConfidenceLevel(
                            result.aspect_confidence
                          ).className
                        }`}
                      >

                        {
                          getConfidenceLevel(
                            result.aspect_confidence
                          ).label
                        }

                      </span>

                    </>

                  )}

                </div>

              </div>


              {/* ==================================
                  ANOMALY
              ================================== */}

              <div className="col-md-4">

                <div className="p-4 border rounded h-100">

                  <small className="text-muted d-block mb-2">
                    Anomaly Detection
                  </small>

                  <h5 className="mb-3">

                    {result.is_anomaly
                      ? "🚨 Detected"
                      : " Normal"
                    }

                  </h5>


                  {result.anomaly_confidence != null && (

                    <>

                      <div className="d-flex justify-content-between mb-1">

                        <small>
                          Confidence
                        </small>

                        <strong>
                          {(
                            result.anomaly_confidence * 100
                          ).toFixed(1)}%
                        </strong>

                      </div>


                      <div
                        className="progress mb-2"
                        role="progressbar"
                        aria-valuenow={
                          result.anomaly_confidence * 100
                        }
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >

                        <div
                          className="progress-bar"
                          style={{
                            width: `${
                              result.anomaly_confidence * 100
                            }%`
                          }}
                        />

                      </div>


                      <span
                        className={`badge ${
                          getConfidenceLevel(
                            result.anomaly_confidence
                          ).className
                        }`}
                      >

                        {
                          getConfidenceLevel(
                            result.anomaly_confidence
                          ).label
                        }

                      </span>

                    </>

                  )}

                </div>

              </div>

            </div>


            {/* ==================================
                ANOMALY REASON
            ================================== */}

            {result.anomaly_reason && (

              <div className="alert alert-warning mt-4">

                <strong>
                  Anomaly reason:
                </strong>{" "}

                {result.anomaly_reason}

              </div>
                
            )}

            {/* ==================================
    MODEL INSIGHTS
================================== */}

{result.insights && result.insights.length > 0 && (

  <div className="mt-4">

    <h5 className="mb-3">
       Model Insights
    </h5>

    <div className="list-group">

      {result.insights.map((insight, index) => (

        <div
          key={index}
          className="list-group-item"
        >

          {insight}

        </div>

      ))}

    </div>

  </div>

)}

          </div>

        </div>

      )}

    </div>

  );

}


export default SubmitReview;