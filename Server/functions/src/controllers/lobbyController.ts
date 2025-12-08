import { Request, Response } from "express";
import { lobbyService } from "../services/lobbyService";
import { IGhostData } from "../interfaces/IGhostData";

export class LobbyController {
  async create(req: Request, res: Response) {
    try {
      const {
        hostId,
        gameMap,
        gameMode = null,
        hostPosition = null,
        championId = null,
        rankFilter = [],
      } = req.body;

      const newLobby = await lobbyService.create({
        hostId,
        gameMap,
        gameMode,
        hostPosition,
        championId,
        rankFilter,
      });

      return res.status(201).json({
        success: true,
        message: "Lobby created successfully",
        id: newLobby.id,
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error creating lobby",
        error: err.message,
      });
    }
  }

  async ready(req: Request, res: Response) {
    try {
      const lobbyId = req.query.lobbyId as string;
      const uid = req.query.uid as string;

      await lobbyService.updateReadyStatus(lobbyId, uid);

      return res.status(200).json({
        success: true,
        message: "Ready status updated successfully",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error updating ready status",
        error: err.message,
      });
    }
  }

  async addGhost(req: Request, res: Response) {
    try {
      const hostId = req.query.hostId as string;
      const lobbyId = req.query.lobbyId as string;

      const { ghostId, gameMap, position, championId } = req.body as IGhostData;

      await lobbyService.addGhost(lobbyId, hostId, {
        ghostId,
        gameMap,
        position,
        championId,
      });

      return res.status(200).json({
        success: true,
        message: "Ghost added successfully",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error updating lobby state to SEARCHING",
        error: err.message,
      });
    }
  }

  async updateGhost(req: Request, res: Response) {
    try {
      const lobbyId = req.query.lobbyId as string;
      const hostId = req.query.hostId as string;
      const { ghostId, position, championId } = req.body;

      await lobbyService.updateGhost(lobbyId, hostId, {
        ghostId,
        position,
        championId,
      });

      return res.status(200).json({
        success: true,
        message: "Ghost updated successfully",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error updating ghost",
        error: err.message,
      });
    }
  }

  async initSearch(req: Request, res: Response) {
    try {
      const lobbyId = req.query.lobbyId as string;
      const uid = req.query.uid as string;
      await lobbyService.initSearch(lobbyId, uid);

      return res.status(200).json({
        success: true,
        message: "Lobby is in SEARCHING state",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error updating lobby state to SEARCHING",
        error: err.message,
      });
    }
  }

  async kick(req: Request, res: Response) {
    try {
      const lobbyId = req.query.lobbyId as string;
      const hostId = req.query.hostId as string;
      const { uid } = req.body;

      await lobbyService.kickPlayer(lobbyId, hostId, uid);

      return res.status(200).json({
        success: true,
        message: "Player kicked successfully",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error kicking player",
        error: err.message,
      });
    }
  }

  async updateDiscord(req: Request, res: Response) {
    try {
      const { lobbyId, hostId, discordLink } = req.body;

      await lobbyService.updateDiscord(lobbyId, hostId, discordLink);

      return res.json({ success: true });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  async updateChampion(req: Request, res: Response) {
    try {
      const lobbyId = req.query.lobbyId as string;
      const uid = req.query.uid as string;
      const { championId } = req.body;

      await lobbyService.updateChampion(lobbyId, uid, championId);

      return res.status(200).json({
        success: true,
        message: "Champion updated successfully",
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error updating champion",
        error: err.message,
      });
    }
  }

  async getAvailableLobbies(req: Request, res: Response) {
    try {

      const lobbies = await lobbyService.getAvailableLobbies();

      return res.status(200).json({
        success: true,
        message: "Available lobbies fetched",
        lobbies,
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error getting available lobbies",
        error: err.message,
      });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const lobbyId = req.query.lobbyId as string;

      if (!lobbyId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
          error: "lobbyId query parameter is required",
        });
      }

      const lobby = await lobbyService.getLobbyById(lobbyId);

      if (!lobby) {
        return res.status(404).json({
          success: false,
          message: "Error getting lobby",
          error: "Lobby id not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lobby found",
        lobby,
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error retrieving lobby",
        error: err.message,
      });
    }
  }

  async find(req: Request, res: Response) {
    try {
      const uid = req.query.uid as string;
      const {
        gameMap,
        gameMode,
        desiredPosition = null,
        ranks = [],
      } = req.body;

      if (!gameMap || !gameMode) {
        return res.status(400).json({
          success: false,
          message: "gameMap and gameMode are required",
        });
      }

      const lobby = await lobbyService.findLobby({
        gameMap,
        gameMode,
        desiredPosition,
        ranks,
        uid,
      });

      if (!lobby) {
        return res.status(404).json({
          success: false,
          message: "No lobbies found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lobby found",
        id: lobby.id,
      });
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Error finding lobby",
        error: err.message,
      });
    }
  }

  async join(req: Request, res: Response) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({
          success: false,
          message: "Method not allowed",
          error: "Use POST",
        });
      }

      const lobbyId = req.query.lobbyId as string;
      const { uid, position = null, championId = null } = req.body;

      if (!lobbyId || !uid) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
          error: "Missing lobbyId and/or uid",
        });
      }

      const updatedLobby = await lobbyService.joinLobby(lobbyId, {
        uid,
        position,
        championId,
      });

      return res.status(200).json({
        success: true,
        message: "Player successfully joined lobby",
        updatedLobby,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "Error joining lobby",
        error: err.message,
      });
    }
  }

  async leave(req: Request, res: Response) {
    try {
      if (req.method !== "DELETE") {
        return res.status(405).json({
          success: false,
          message: "Method not allowed",
          error: "Use DELETE",
        });
      }

      const lobbyId = req.query.lobbyId as string;
      const uid = req.query.uid as string;

      if (!lobbyId || !uid) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
          error: "lobbyId and/or uid",
        });
      }

      await lobbyService.leaveById(lobbyId, uid);

      return res.status(200).json({
        success: true,
        message: `Left lobby successfully`,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "Error leaving lobby.",
        error: err.message,
      });
    }
  }
}

export const lobbyController = new LobbyController();
