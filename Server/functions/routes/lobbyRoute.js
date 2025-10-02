const functions = require("firebase-functions");
const { createLobby } = require("../services/lobbyService");

exports.createLobbyEndpoint = functions.https.onRequest(async (req, res) => {
  try {
    const { hostId, game, maxPlayers, filters } = req.body;

    const newLobby = await createLobby({ hostId, game, maxPlayers, filters });

    res.status(201).json({
      message: "Lobby created successfully",
      ...newLobby,
    });
  } catch (err) {
    console.error("Error creating lobby:", err);
    res.status(500).json({ error: err.message });
  }
});
