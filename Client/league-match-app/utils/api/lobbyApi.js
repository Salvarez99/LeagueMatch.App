import axiosClient from "./axiosClient";

export const lobbyApi = {
  createLobby: (data) => axiosClient.post("/createLobby", data),
  // findLobby: (data) => axiosClient.post("/lobby/find", data),
  getById: (lobbyId) => axiosClient.get(`/getLobbyById?lobbyId=${lobbyId}`),
  joinLobby: (data) => axiosClient.post('/joinLobbyById', data),
  leaveLobby: (lobbyId, uid) => axiosClient.delete(`/leaveLobbyById?lobbyId=${lobbyId}&uid=${uid}`)
};