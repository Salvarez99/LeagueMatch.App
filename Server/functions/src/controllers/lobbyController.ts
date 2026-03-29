import { lobbyService } from "../services/lobbyService";
import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Query,
  Route,
  Security,
  Get,
  Path,
} from "tsoa";
import { IGhostData } from "../interfaces/IGhostData";
import {
  createLobbyRequestDTO,
  findLobbyDTO,
  joinLobbyDTO,
  updateDiscordDTO,
  updateGhostDTO,
} from "./dtos/lobby.dto";

@Route("lobby")
export class LobbyController extends Controller {
  @Security("firebaseAuth")
  @Post("create")
  async create(@Body() body: createLobbyRequestDTO) {
    const {
      hostId,
      gameMap,
      gameMode = null,
      hostPosition = null,
      championId = null,
      rankFilter = [],
    } = body;

    const newLobby = await lobbyService.create({
      hostId,
      gameMap,
      gameMode,
      hostPosition,
      championId,
      rankFilter,
    });

    return {
      success: true,
      message: "Lobby created successfully",
      id: newLobby.id,
    };
  }

  @Security("firebaseAuth")
  @Patch("ready")
  async ready(@Query("lobbyId") lobbyId: string, @Query("uid") uid: string) {
    await lobbyService.updateReadyStatus(lobbyId, uid);

    return {
      success: true,
      message: "Ready status updated successfully",
    };
  }

  @Security("firebaseAuth")
  @Post("addGhost")
  async addGhost(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Body() body: IGhostData,
  ) {
    const { ghostId, index, gameMap, position, championId } = body;

    await lobbyService.addGhost(lobbyId, hostId, {
      ghostId,
      index,
      gameMap,
      position,
      championId,
    });

    return {
      success: true,
      message: "Ghost added successfully",
    };
  }

  //Only updates ghost position
  @Security("firebaseAuth")
  @Patch("updateGhost")
  async updateGhost(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Body() body: updateGhostDTO,
  ) {
    const { ghostId, position, championId } = body;

    await lobbyService.updateGhost(lobbyId, hostId, {
      ghostId,
      position,
      championId,
    });

    return {
      success: true,
      message: "Ghost updated successfully",
    };
  }

  @Security("firebaseAuth")
  @Patch("initSearch")
  async initSearch(
    @Query("uid") uid: string,
    @Query("lobbyId") lobbyId: string,
  ) {
    await lobbyService.initSearch(lobbyId, uid);

    return {
      success: true,
      message: "Lobby is in SEARCHING state",
    };
  }

  @Security("firebaseAuth")
  @Delete("kick")
  async kick(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Query("targetUid") targetUid: string,
  ) {
    await lobbyService.kickPlayer(lobbyId, hostId, targetUid);

    return {
      success: true,
      message: "Player kicked successfully",
    };
  }

  @Security("firebaseAuth")
  @Patch("updateDiscord")
  async updateDiscord(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Body() body: updateDiscordDTO,
  ) {
    const { discordLink } = body;

    await lobbyService.updateDiscord(lobbyId, hostId, discordLink);

    return { success: true };
  }

  @Security("firebaseAuth")
  @Patch("updateChampion")
  async updateChampion(
    @Query("uid") uid: string,
    @Query("lobbyId") lobbyId: string,
    @Query("championId") championId: string,
  ) {
    await lobbyService.updateChampion(lobbyId, uid, championId);

    return {
      success: true,
      message: "Champion updated successfully",
    };
  }

  @Security("firebaseAuth")
  @Get("getAvailableLobbies")
  async getAvailableLobbies() {
    const lobbies = await lobbyService.getAvailableLobbies();

    return {
      success: true,
      message: "Available lobbies fetched",
      lobbies,
    };
  }

  @Security("firebaseAuth")
  @Get("get")
  async get(@Query("lobbyId") lobbyId: string) {
    const lobby = await lobbyService.getLobbyById(lobbyId);

    return {
      success: true,
      message: "Lobby found",
      lobby,
    };
  }

  @Security("firebaseAuth")
  @Post("find")
  async find(@Query("uid") uid: string, @Body() body: findLobbyDTO) {
    const { gameMap, gameMode, desiredPosition = null, ranks = [] } = body;

    const lobby = await lobbyService.findLobby({
      gameMap,
      gameMode,
      desiredPosition,
      ranks,
      uid,
    });

    return {
      success: true,
      message: "Lobby found",
      id: lobby.id,
    };
  }

  @Security("firebaseAuth")
  @Patch("join")
  async join(@Query("lobbyId") lobbyId: string, @Body() body: joinLobbyDTO) {
    const { uid, position = null, championId = null } = body;

    const updatedLobby = await lobbyService.joinLobby(lobbyId, {
      uid,
      position,
      championId,
    });

    return {
      success: true,
      message: "Player successfully joined lobby",
      updatedLobby,
    };
  }

  @Security("firebaseAuth")
  @Delete("leave")
  async leave(@Query("uid") uid: string, @Query("lobbyId") lobbyId: string) {
    await lobbyService.leaveById(lobbyId, uid);

    return {
      success: true,
      message: `Left lobby successfully`,
    };
  }
}

export const lobbyController = new LobbyController();
