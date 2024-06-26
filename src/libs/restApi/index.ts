"use client";
import axios, { AxiosRequestConfig } from "axios";
import { ACCESS_TOKEN, USER } from "../../constants";

export const restApiBase = async (
  data: any,
  endPoint: string,
  method?: string
) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const headers = {
    "Content-Type": "application/json",
    authorization: token ? `Bearer ${token}` : "",
  };

  const config: AxiosRequestConfig = {
    url: `/${endPoint}`,
    method: method ? method : "POST",
    data: data,
    withCredentials: true,
    headers: headers,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error: any) {
    if (error.response) {
      if (
        error.response.data.message === "Unauthorized" &&
        error.response.data.statusCode === 401
      ) {
        axios({
          baseURL: `api/auth/refresh-access`,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          withCredentials: true,
        })
          .then(async (rs) => {
            const { accessToken } = rs.data;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            if (config.headers) {
              config.headers.authorization = `Bearer ${data}`;
            }
            const retryResponse = await axios(config);
            return retryResponse;
          })
          .catch((err) => {
            console.log("error at axios", err);
            throw err;
          });
      } else {
        throw error;
      }
    } else {
      console.log("Network or other error", error);
      throw error;
    }
  }
};
