import axiosClient from "./axiosClient";

export const lobbyApi = {
  createLobby: (data) => axiosClient.post("/lobby_create", data),

  findLobby: (data) => axiosClient.post("/lobby_find", data),

  getById: (lobbyId) => axiosClient.get(`/lobby_get?lobbyId=${lobbyId}`),

  joinLobby: (lobbyId, data) => axiosClient.post(`/lobby_join?lobbyId=${lobbyId}`, data),

  leaveLobby: (lobbyId, uid) => axiosClient.delete(`/lobby_leave?lobbyId=${lobbyId}&uid=${uid}`),

  updatePlayerReady: (lobbyId, uid) => axiosClient.patch(`/lobby_ready?lobbyId=${lobbyId}&uid=${uid}`),

};
