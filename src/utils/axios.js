import axios from "axios";
import { LOCALSTORAGE_TOKEN_KEY } from "./constants";
import { getItemFromLocalStorage } from "./index";

export const makeRequest = () => {
  const token = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

  return axios.create({
    baseURL: "http://127.0.0.1:5000/api/v1",
    headers: {
      authorization: "Bearer " + token,
    },
  });
};
