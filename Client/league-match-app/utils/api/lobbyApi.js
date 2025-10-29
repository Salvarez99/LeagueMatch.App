import axiosClient from "./axiosClient";

export const lobbyApi = {
  createLobby: (data) => axiosClient.post("/lobby/create", data),
  findLobby: (data) => axiosClient.post("/lobby/find", data),
  getById: (lobbyId) => axiosClient.get(`/lobby/getById?lobbyId=${lobbyId}`),
  joinLobby: (data) => axiosClient.post('/lobby/join', data),
  leaveLobby: (lobbyId, uid) => axiosClient.delete(`/lobby/leave?lobbyId=${lobbyId}&uid=${uid}`)
};
