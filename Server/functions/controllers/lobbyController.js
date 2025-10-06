// controllers/lobbyController.js
const lobbyService = require("../services/lobbyService");

class LobbyController {
  async createLobby(req, res) {
    try {
      const { hostId, hostRole, gameMode, maxPlayers, filters } = req.body;
      const newLobby = await lobbyService.createLobby({
        hostId,
        hostRole,
        gameMode,
        maxPlayers,
        filters,
      });

      res.status(201).json({
        message: "Lobby created successfully",
        lobby: newLobby,
      });
    } catch (err) {
      console.error("Error creating lobby:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getAvailableLobbies(req, res) {
    try {
      const lobbies = await lobbyService.getAvailableLobbies();
      res.status(200).json({
        message: "Available lobbies fetched",
        lobbies,
      });
    } catch (err) {
      console.error("Error getting available lobbies:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getLobbyById(req, res) {
    try {
      const lobbyId = req.query.lobbyId; // get from query param
      if (!lobbyId) {
        return res
          .status(400)
          .json({ error: "lobbyId query parameter is required" });
      }

      const lobby = await lobbyService.getLobbyById(lobbyId);

      if (!lobby) {
        return res.status(404).json({ error: "Lobby not found" });
      }

      res.status(200).json(lobby);
    } catch (err) {
      console.error("getLobbyById error:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async joinLobbyById(req, res) {
    try {
      if (req.method !== "POST") {
        return res
          .status(405)
          .json({ success: false, message: "Method not allowed" });
      }

      const { lobbyId, uid, role } = req.body;

      if (!lobbyId || !uid || !role) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const updatedLobby = await lobbyService.joinLobby(lobbyId, { uid, role });

      return res.status(200).json({
        success: true,
        data: updatedLobby,
      });
    } catch (error) {
      console.error("Error joining lobby:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new LobbyController();