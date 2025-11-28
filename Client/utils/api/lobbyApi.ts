import axiosClient from "./axiosClient";
import * as ILobbyRequest from "@/types/ILobbyApiRequest";

export const lobbyApi = {
  createLobby: (data: ILobbyRequest.Create) =>
    axiosClient.post("/lobby_create", data),

  findLobby: (uid: string, data: ILobbyRequest.Find) =>
    axiosClient.post(`/lobby_find?uid=${uid}`, data),

  getById: (lobbyId: string) =>
    axiosClient.get(`/lobby_get?lobbyId=${lobbyId}`),

  joinLobby: (lobbyId: string, data: ILobbyRequest.Join) =>
    axiosClient.post(`/lobby_join?lobbyId=${lobbyId}`, data),

  leaveLobby: (lobbyId: string, uid: string) =>
    axiosClient.delete(`/lobby_leave?lobbyId=${lobbyId}&uid=${uid}`),

  updatePlayerReady: (lobbyId: string, uid: string) =>
    axiosClient.patch(`/lobby_ready?lobbyId=${lobbyId}&uid=${uid}`),

  updateChampion: (
    lobbyId: string,
    uid: string,
    data: ILobbyRequest.UpdateChampion
  ) =>
    axiosClient.patch(
      `/lobby_updateChampion?lobbyId=${lobbyId}&uid=${uid}`,
      data
    ),

  kickPlayer: (lobbyId: string, hostId: string, data: ILobbyRequest.Kick) =>
    axiosClient.patch(`/lobby_kick?lobbyId=${lobbyId}&hostId=${hostId}`, data),
};
