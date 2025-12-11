import * as ILobbyRequest from "@/types/ILobbyApiRequest";
import * as ILobbyResponse from "@/types/ILobbyApiResponse";
import axiosClient from "./axiosClient";

export const lobbyApi = {
  createLobby: (data: ILobbyRequest.Create) =>
    axiosClient.post<ILobbyResponse.Create>("/lobby_create", data),

  findLobby: (uid: string, data: ILobbyRequest.Find) =>
    axiosClient.post<ILobbyResponse.Find>(`/lobby_find?uid=${uid}`, data),

  getById: (lobbyId: string) =>
    axiosClient.get<ILobbyResponse.Generic>(`/lobby_get?lobbyId=${lobbyId}`),

  joinLobby: (lobbyId: string, data: ILobbyRequest.Join) =>
    axiosClient.post<ILobbyResponse.Join>(
      `/lobby_join?lobbyId=${lobbyId}`,
      data
    ),

  leaveLobby: (lobbyId: string, uid: string) =>
    axiosClient.delete<ILobbyResponse.Generic>(
      `/lobby_leave?lobbyId=${lobbyId}&uid=${uid}`
    ),

  updatePlayerReady: (lobbyId: string, uid: string) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby_ready?lobbyId=${lobbyId}&uid=${uid}`
    ),

  initSearch: (lobbyId: string, uid: string) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby_initSearch?lobbyId=${lobbyId}&uid=${uid}`
    ),

  updateChampion: (
    lobbyId: string,
    uid: string,
    data: ILobbyRequest.UpdateChampion
  ) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby_updateChampion?lobbyId=${lobbyId}&uid=${uid}`,
      data
    ),

  kickPlayer: (lobbyId: string, hostId: string, data: ILobbyRequest.Kick) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby_kick?lobbyId=${lobbyId}&hostId=${hostId}`,
      data
    ),
  addGhost: (lobbyId: string, hostId: string, data: ILobbyRequest.addGhost) =>
    axiosClient.post<ILobbyResponse.Generic>(
      `/lobby_addGhost?lobbyId=${lobbyId}&hostId=${hostId}`,
      data
    ),

  updateGhost: (
    lobbyId: string,
    hostId: string,
    data: ILobbyRequest.updateGhost
  ) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby_updateGhost?lobbyId=${lobbyId}&hostId=${hostId}`,
      data
    ),
};
