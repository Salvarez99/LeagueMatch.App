// controllers/lobbyController.js
const { error } = require("firebase-functions/logger");
const lobbyService = require("../services/lobbyService");

class LobbyController {
  async create(req, res) {
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

      res.status(201).json({
        success: true,
        message: "Lobby created successfully",
        data: { id: newLobby.id },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error creating lobby",
        error: err.message,
      });
    }
  }

  async getAvailableLobbies(req, res) {
    const { desiredRole } = req.body;
    try {
      const lobbies = await lobbyService.getAvailableLobbies(desiredRole);
      res.status(200).json({
        success: true,
        message: "Available lobbies fetched",
        data: { lobbies },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error getting available lobbies",
        error: err.message,
      });
    }
  }

  async get(req, res) {
    try {
      const lobbyId = req.query.lobbyId; // get from query param
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

      res
        .status(200)
        .json({ success: true, message: "lobby found", data: { lobby } });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error retrieving lobby",
        error: err.message,
      });
    }
  }

  async find(req, res) {
    try {
      const { gameMap, gameMode, desiredPostion = null, ranks = [] } = req.body;

      if (!gameMap || !gameMode){
        throw new Error("gameMap and gameMode are required");
      }

      const lobby = await findLobby({
        gameMap,
        gameMode,
        desiredPostion,
        ranks,
      });

      res.status(201).json({
        success: true,
        message: "Lobby created successfully",
        data: { id: lobby.id },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error finding lobby",
        error: err.message,
      });
    }
  }

  async join(req, res) {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({
          success: false,
          message: "Method not allowed",
          error: "Use POST",
        });
      }

      const { lobbyId } = req.query;
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
        data: updatedLobby,
      });
    } catch (error) {
      console.error("Error joining lobby:", error);
      return res.status(500).json({
        success: false,
        message: "Error joining lobby",
        error: error.message,
      });
    }
  }

  async leave(req, res) {
    try {
      if (req.method !== "DELETE") {
        return res.status(405).json({
          success: false,
          message: "Method not allowed",
          error: "Use DELETE",
        });
      }

      const { lobbyId, uid } = req.query;

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
        message: `Left lobby successsfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error leaving lobby.",
        error: error.message,
      });
    }
  }
}

module.exports = new LobbyController();
