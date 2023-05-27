import axios from "axios";
import { LOCALSTORAGE_TOKEN_KEY } from "./constants";
import { getItemFromLocalStorage } from "./index";

export const makeRequest = () => {
  const token = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

  return axios.create({
    baseURL: "https://chatapp-api-y9p9.onrender.com/api/v1",
    headers: {
      authorization: "Bearer " + token,
    },
  });
};
