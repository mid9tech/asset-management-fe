import axios, { AxiosRequestConfig } from "axios";
import { ACCESS_TOKEN } from "../../constants";

export const restApiBase = async (data: any, endPoint: string) => {
  const baseUrl: string = "http://localhost:8080/";
  const token = localStorage.getItem(ACCESS_TOKEN);
  const headers = {
    "Content-Type": "application/json",
    authorization: token ? `Bearer ${token}` : "",
  };

  const config: AxiosRequestConfig = {
    url: `${baseUrl}${endPoint}`,
    method: "post",
    data: data,
    headers: headers,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
