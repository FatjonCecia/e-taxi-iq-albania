import axios from "axios";


const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


export const getAnalytics = async () => {
  const response = await API.get("/analytics");

  return response.data;
};


export const getReviews = async (filters = {}) => {
  const response = await API.get("/reviews", {
    params: filters,
  });

  return response.data;
};


export const createReview = async (review) => {
  const response = await API.post("/reviews", review);

  return response.data;
};

export const getCompanyIntelligence = async (companyId) => {

  const response = await API.get(
    `/companies/${companyId}/intelligence`
  );

  return response.data;
};


export const getCompanyComparison = async () => {

  const response = await API.get(
    "/companies/comparison"
  );

  return response.data;
};


export const getReviewTrends = async () => {

  const response = await API.get(
    "/analytics/trends"
  );

  return response.data;
};