"use client";
import axios, { AxiosRequestConfig } from "axios";
import { ACCESS_TOKEN, USER } from "../../constants";

export const restApiBase = async (
  data: any,
  endPoint: string,
  method?: string
) => {
  const baseUrl: string = process.env.NEXT_PUBLIC_URL_SERVER as string;
  const token = localStorage.getItem(ACCESS_TOKEN);
  const headers = {
    "Content-Type": "application/json",
    authorization: token ? `Bearer ${token}` : "",
  };

  const config: AxiosRequestConfig = {
    url: `${baseUrl}${endPoint}`,
    method: method ? method : "POST",
    data: data,
    withCredentials: true,
    headers: headers,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error: any) {
    console.log("error", error);
    if (
      error.response.data.message === "Unauthorized" &&
      error.response.data.statusCode === 401
    ) {
      axios({
        baseURL: `${baseUrl}api/auth/refresh-access`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        withCredentials: true,
      })
        .then(async (rs) => {
          const { accessToken, user } = rs.data;
          localStorage.setItem(ACCESS_TOKEN, accessToken);
          localStorage.setItem(USER, user);
          if (config.headers) {
            config.headers.authorization = `Bearer ${data}`;
          }
          const retryResponse = await axios(config);
          return retryResponse;
        })
        .catch((err) => {
          console.log("error", err);
          throw err;
        });
    }
  }
};
