import axios from "axios";

const API_URL = "http://localhost:5000/api/planner";

const getToken = () => localStorage.getItem("token");

export const fetchTasksByDate = async (date) => {
  const res = await axios.get(`${API_URL}/${date}`, {
    headers: {
      Authorization: getToken(),
    },
  });
  return res.data;
};

export const createTask = async (task) => {
  const res = await axios.post(API_URL, task, {
    headers: {
      Authorization: getToken(),
    },
  });
  return res.data;
};

export const updateTask = async (id, updates) => {
  const res = await axios.put(`${API_URL}/${id}`, updates, {
    headers: {
      Authorization: getToken(),
    },
  });
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: getToken(),
    },
  });
  return res.data;
};
