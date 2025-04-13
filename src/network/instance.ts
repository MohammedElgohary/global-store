import axios, { isAxiosError } from "axios";
import qs from "qs";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  withCredentials: true,
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { arrayFormat: "comma" });
    },
  },
});

instance.interceptors.response.use(undefined, function (error) {
  if (!isAxiosError(error) || !error.response) {
    return Promise.reject(error);
  }

  return Promise.reject(error.response?.data);
});
