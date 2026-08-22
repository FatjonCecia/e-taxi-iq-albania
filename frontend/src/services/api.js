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