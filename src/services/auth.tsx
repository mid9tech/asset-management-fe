import { restApiBase } from "@libs/restApi";
import { ACCESS_TOKEN, USER } from "../constants";

export const login = async (username: string, password: string) => {
  try {
    const result = await restApiBase({ username, password }, "api/auth/login");
    const { accessToken, user } = result?.data;
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(USER, JSON.stringify(user));
    return result;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const changePasswordFirstTimeLogin = async (password: string) => {
  try {
    const response = await restApiBase(
      { newPassword: password },
      "api/auth/change-password"
    );
    return response;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassowrd: string
) => {
  try {
    const result = await restApiBase(
      { oldPassword: oldPassword, newPassword: newPassowrd },
      "api/auth/change-password",
      "PUT"
    );
    return result;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const result = await restApiBase({}, "api/auth/logout");
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USER);
    return result;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const refreshToken = async () => {
  try {
    const result = await restApiBase({}, "api/auth/refresh-access");
    const { accessToken } = result?.data;
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    return result;
  } catch (error: any) {
    await logout()
    throw error.response.data;
  }
};
