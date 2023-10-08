import axios from "axios";
const user = JSON.parse(localStorage.getItem("user"));
let accessHeader = { 
  "Content-Type":"application/json",
};
if (user && user.token) {
  accessHeader = { 
    "Authorization": user.token,
    "Content-Type":"application/json",
  };
}

const API_URL = "http://localhost:3000/";

const addMovies = (data) => {
  data.cast = data.cast.split(" ");
  data.rating = parseInt(data.rating);
  console.log(data);
  return axios.post(API_URL + "createMovie", data, { headers: accessHeader });
};

const getMoviesList = () => {
  return axios.get(API_URL + "getAllMovie", { headers: accessHeader });
};

const getMovie = (id) => {
  return axios.get(API_URL + `getMovie/${id}`, { headers: accessHeader });
};

const updateMovie = (id, data) => {
  console.log(typeof data.cast);
  data.cast = (typeof data.cast !== "object") ? data.cast.split(" ") : data.cast;
  data.rating = parseInt(data.rating);
  return axios.patch(API_URL + `updateMovie/${id}`, data, { headers: accessHeader });
};

const removeMovie = (id) => {
  return axios.delete(API_URL + `deleteMovie/${id}`, { headers: accessHeader });
};

export default {
  addMovies,
  getMoviesList,
  getMovie,
  updateMovie,
  removeMovie
};