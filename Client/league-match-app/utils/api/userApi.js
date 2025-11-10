import axiosClient from "./axiosClient";

export const userApi = {
  createUser: (data) => axiosClient.post("/user_addUser", data),
  updateUser: (data) => axiosClient.post("/user_updateUser", data),
};
