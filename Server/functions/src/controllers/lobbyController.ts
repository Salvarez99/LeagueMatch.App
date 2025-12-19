import { lobbyService } from "../services/lobbyService";
import { Body, Controller, Delete, Patch, Post, Query, Route } from "tsoa";
import { IGhostData } from "../interfaces/IGhostData";
import { createLobbyRequestDTO, updateGhostDTO } from "./dtos/lobby.dto";

@Route("lobby")
export class LobbyController extends Controller {
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

  @Patch("ready")
  async ready(@Query("lobbyId") lobbyId: string, @Query("uid") uid: string) {
    await lobbyService.updateReadyStatus(lobbyId, uid);

    return {
      success: true,
      message: "Ready status updated successfully",
    };
  }

  @Post("addGhost")
  async addGhost(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Body() body: IGhostData
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
  @Patch("updateGhost")
  async updateGhost(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Body() body: updateGhostDTO
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

  // async initSearch(req: Request, res: Response) {
  //   try {
  //     const lobbyId = req.query.lobbyId as string;
  //     const uid = req.query.uid as string;
  //     await lobbyService.initSearch(lobbyId, uid);

  //     return res.status(200).json({
  //       success: true,
  //       message: "Lobby is in SEARCHING state",
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error updating lobby state to SEARCHING",
  //       error: err.message,
  //     });
  //   }
  // }

  // async kick(req: Request, res: Response) {
  //   try {
  //     const lobbyId = req.query.lobbyId as string;
  //     const hostId = req.query.hostId as string;
  //     const { uid } = req.body;

  //     await lobbyService.kickPlayer(lobbyId, hostId, uid);

  //     return res.status(200).json({
  //       success: true,
  //       message: "Player kicked successfully",
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error kicking player",
  //       error: err.message,
  //     });
  //   }
  // }

  // async updateDiscord(req: Request, res: Response) {
  //   try {
  //     const { lobbyId, hostId, discordLink } = req.body;

  //     await lobbyService.updateDiscord(lobbyId, hostId, discordLink);

  //     return res.json({ success: true });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(400).json({ success: false, error: err.message });
  //   }
  // }

  // async updateChampion(req: Request, res: Response) {
  //   try {
  //     const lobbyId = req.query.lobbyId as string;
  //     const uid = req.query.uid as string;
  //     const { championId } = req.body;

  //     await lobbyService.updateChampion(lobbyId, uid, championId);

  //     return res.status(200).json({
  //       success: true,
  //       message: "Champion updated successfully",
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error updating champion",
  //       error: err.message,
  //     });
  //   }
  // }

  // async getAvailableLobbies(req: Request, res: Response) {
  //   try {
  //     const lobbies = await lobbyService.getAvailableLobbies();

  //     return res.status(200).json({
  //       success: true,
  //       message: "Available lobbies fetched",
  //       lobbies,
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error getting available lobbies",
  //       error: err.message,
  //     });
  //   }
  // }

  // async get(req: Request, res: Response) {
  //   try {
  //     const lobbyId = req.query.lobbyId as string;

  //     if (!lobbyId) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Missing required fields",
  //         error: "lobbyId query parameter is required",
  //       });
  //     }

  //     const lobby = await lobbyService.getLobbyById(lobbyId);

  //     if (!lobby) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Error getting lobby",
  //         error: "Lobby id not found",
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       message: "Lobby found",
  //       lobby,
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error retrieving lobby",
  //       error: err.message,
  //     });
  //   }
  // }

  // async find(req: Request, res: Response) {
  //   try {
  //     const uid = req.query.uid as string;
  //     const {
  //       gameMap,
  //       gameMode,
  //       desiredPosition = null,
  //       ranks = [],
  //     } = req.body;

  //     if (!gameMap || !gameMode) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "gameMap and gameMode are required",
  //       });
  //     }

  //     const lobby = await lobbyService.findLobby({
  //       gameMap,
  //       gameMode,
  //       desiredPosition,
  //       ranks,
  //       uid,
  //     });

  //     if (!lobby) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "No lobbies found",
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       message: "Lobby found",
  //       id: lobby.id,
  //     });
  //   } catch (err: any) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error finding lobby",
  //       error: err.message,
  //     });
  //   }
  // }

  // async join(req: Request, res: Response) {
  //   try {
  //     if (req.method !== "POST") {
  //       return res.status(405).json({
  //         success: false,
  //         message: "Method not allowed",
  //         error: "Use POST",
  //       });
  //     }

  //     const lobbyId = req.query.lobbyId as string;
  //     const { uid, position = null, championId = null } = req.body;

  //     if (!lobbyId || !uid) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Missing required fields",
  //         error: "Missing lobbyId and/or uid",
  //       });
  //     }

  //     const updatedLobby = await lobbyService.joinLobby(lobbyId, {
  //       uid,
  //       position,
  //       championId,
  //     });

  //     return res.status(200).json({
  //       success: true,
  //       message: "Player successfully joined lobby",
  //       updatedLobby,
  //     });
  //   } catch (err: any) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error joining lobby",
  //       error: err.message,
  //     });
  //   }
  // }

  // async leave(req: Request, res: Response) {
  //   try {
  //     if (req.method !== "DELETE") {
  //       return res.status(405).json({
  //         success: false,
  //         message: "Method not allowed",
  //         error: "Use DELETE",
  //       });
  //     }

  //     const lobbyId = req.query.lobbyId as string;
  //     const uid = req.query.uid as string;

  //     if (!lobbyId || !uid) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Missing required fields",
  //         error: "lobbyId and/or uid",
  //       });
  //     }

  //     await lobbyService.leaveById(lobbyId, uid);

  //     return res.status(200).json({
  //       success: true,
  //       message: `Left lobby successfully`,
  //     });
  //   } catch (err: any) {
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error leaving lobby.",
  //       error: err.message,
  //     });
  //   }
  // }
}

export const lobbyController = new LobbyController();
