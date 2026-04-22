import axios from "axios";

const API = "http://localhost:5000/api/events";

const getEvents = async (category) => {

  const res = await axios.get(API, {
    params: { category }
  });

  return res.data;

};

export default {
  getEvents
};