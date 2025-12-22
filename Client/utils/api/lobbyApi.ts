import * as ILobbyRequest from "@/types/ILobbyApiRequest";
import * as ILobbyResponse from "@/types/ILobbyApiResponse";
import axiosClient from "./axiosClient";

export const lobbyApi = {
  createLobby: (data: ILobbyRequest.Create) =>
    axiosClient.post<ILobbyResponse.Create>("/lobby/create", data),

  findLobby: (uid: string, data: ILobbyRequest.Find) =>
    axiosClient.post<ILobbyResponse.Find>(`/lobby/find?uid=${uid}`, data),

  getById: (lobbyId: string) =>
    axiosClient.get<ILobbyResponse.Generic>(`/lobby/get?lobbyId=${lobbyId}`),

  joinLobby: (lobbyId: string, data: ILobbyRequest.Join) =>
    axiosClient.patch<ILobbyResponse.Join>(
      `/lobby/join?lobbyId=${lobbyId}`,
      data
    ),

  leaveLobby: (lobbyId: string, uid: string) =>
    axiosClient.delete<ILobbyResponse.Generic>(
      `/lobby/leave?lobbyId=${lobbyId}&uid=${uid}`
    ),

  updatePlayerReady: (lobbyId: string, uid: string) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby/ready?lobbyId=${lobbyId}&uid=${uid}`
    ),

  initSearch: (lobbyId: string, uid: string) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby/initSearch?lobbyId=${lobbyId}&uid=${uid}`
    ),

  updateChampion: (lobbyId: string, uid: string, championId: string) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby/updateChampion?lobbyId=${lobbyId}&uid=${uid}&championId=${championId}`
    ),

  kickPlayer: (lobbyId: string, hostId: string, targetUid: string) =>
    axiosClient.delete<ILobbyResponse.Generic>(
      `/lobby/kick?lobbyId=${lobbyId}&hostId=${hostId}&targetUid=${targetUid}`
    ),
  addGhost: (lobbyId: string, hostId: string, data: ILobbyRequest.addGhost) =>
    axiosClient.post<ILobbyResponse.Generic>(
      `/lobby/addGhost?lobbyId=${lobbyId}&hostId=${hostId}`,
      data
    ),

  updateGhost: (
    lobbyId: string,
    hostId: string,
    data: ILobbyRequest.updateGhost
  ) =>
    axiosClient.patch<ILobbyResponse.Generic>(
      `/lobby/updateGhost?lobbyId=${lobbyId}&hostId=${hostId}`,
      data
    ),
};
