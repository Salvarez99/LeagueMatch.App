// controllers/lobbyController.js
const functions = require("firebase-functions");
const lobbyService = require("../services/lobbyService");

class LobbyController {
  async createLobby(req, res) {
    try {
      const { hostId, game, maxPlayers, filters } = req.body;
      const newLobby = await lobbyService.createLobby({ hostId, game, maxPlayers, filters });

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
        return res.status(400).json({ error: "lobbyId query parameter is required" });
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
}

module.exports = new LobbyController();