import axiosClient from "./axiosClient";
import * as IUserRequest from "@/types/IUserApiRequest";
import * as IUserResponse from "@/types/IUserApiResponse";

export const userApi = {
  createUser: (data: IUserRequest.Add) =>
    axiosClient.post<IUserResponse.Add>("/user/add", data),
  
  updateUser: (data: IUserRequest.Update) =>
    axiosClient.post<IUserResponse.Update>("/user/update", data),
};
