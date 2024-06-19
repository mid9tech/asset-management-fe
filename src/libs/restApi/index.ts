import axios, { AxiosRequestConfig } from "axios";
import { ACCESS_TOKEN } from "../../constants";

export const restApiBase = async (
  data: any,
  endPoint: string,
  method?: string
) => {
  const baseUrl: string = "http://localhost:8080/";
  const token = localStorage.getItem(ACCESS_TOKEN);
  const headers = {
    "Content-Type": "application/json",
    authorization: token ? `Bearer ${token}` : "",
  };

  const config: AxiosRequestConfig = {
    url: `${baseUrl}${endPoint}`,
    method: method ? method : "post",
    data: data,
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
      })
        .then(async (rs) => {
          const data = rs.data.accessToken;
          localStorage.setItem(ACCESS_TOKEN, data);
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
