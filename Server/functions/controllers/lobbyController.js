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
        id: newLobby.id,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error creating lobby",
        error: err.message,
      });
    }
  }

  async ready(req, res) {
    try {
      const { lobbyId, uid } = req.query;
      await lobbyService.updateReadyStatus(lobbyId, uid);
      res.status(200).json({
        success: true,
        message: "Ready status updated successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error updating ready status",
        error: err.message,
      });
    }
  }

  async kick(req, res) {
    const { lobbyId, hostId } = req.query;
    const { uid } = req.body;

    try {
      await lobbyService.kickPlayer(lobbyId, hostId, uid);
      res.status(200).json({
        success: true,
        message: "Player kicked successfully",
      });
    } catch (err) {
      res.status(500).json({
        succes: false,
        message: "Error kicking player",
        error: err.message,
      });
    }
  }
  // POST /lobby_updateDiscord
  // body: { lobbyId, hostId, discordLink }
  async updateDiscord(req, res) {
    const { lobbyId, hostId, discordLink } = req.body;
    try {
      await lobbyService.updateDiscord(lobbyId, hostId, discordLink);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateChampion(req, res) {
    const { lobbyId, uid } = req.query;
    const { championId } = req.body;

    try {
      await lobbyService.updateChampion(lobbyId, uid, championId);
      res.status(200).json({
        success: true,
        message: "Champion updated successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error updating champion",
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
        lobbies,
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

      res.status(200).json({ success: true, message: "lobby found", lobby });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error retrieving lobby",
        error: err.message,
      });
    }
  }

  async find(req, res) {
    const uid = req.query.uid;
    try {
      const {
        gameMap,
        gameMode,
        desiredPosition = null,
        ranks = [],
      } = req.body;

      if (!gameMap || !gameMode) {
        throw new Error("gameMap and gameMode are required");
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

      res.status(201).json({
        success: true,
        message: "Lobby found",
        id: lobby.id,
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
        updatedLobby,
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
