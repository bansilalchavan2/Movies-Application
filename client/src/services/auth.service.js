import axios from "axios";

const API_URL = "http://localhost:3000/";
const headers = {
  'Content-Type': 'application/json'
};
const register = (username, email, password) => {
  return axios.post(API_URL + "register", {
    name:username,
    email,
    password,
  }, {
    headers: headers
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", {
      email:username,
      password,
    }, {
      headers: headers
    })
    .then((response) => {
      console.log(response);
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout,
};
