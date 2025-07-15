
import axios from 'axios';

const API_URL = 'https://notes-app-7ytd.onrender.com';

export const getNotes = async () => {
  const res = await axios.get(API_URL, { withCredentials: true });
  return res.data;
};

export const getNote = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
  return res.data;
};

export const createNote = async (note) => {
  const res = await axios.post(API_URL, note, { withCredentials: true });
  return res.data;
};

export const updateNote = async (id, note) => {
  const res = await axios.put(`${API_URL}/${id}`, note, { withCredentials: true });
  return res.data;
};

export const deleteNote = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
  return res.data;
};





