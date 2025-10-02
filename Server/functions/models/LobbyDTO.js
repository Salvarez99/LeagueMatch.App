class LobbyDTO {
  constructor({
    id = null,          // Firestore doc ID (nullable until created)
    hostId,             // Required: uid of host user
    game,               // Required: game type/mode (e.g. "Ranked 5v5")
    maxPlayers,         // Required: maximum players allowed
    players = [],       // Array of user IDs, host included
    filters = {},       // Matchmaking criteria (rank, region, roles, etc.)
    createdAt = new Date().toISOString(),
    isActive = true
  }) {
    if (!hostId || !game || !maxPlayers) {
      throw new Error("hostId, game, and maxPlayers are required");
    }

    this.id = id;
    this.hostId = hostId;
    this.game = game;
    this.maxPlayers = maxPlayers;
    this.players = players.length ? players : [hostId];
    this.filters = filters;
    this.createdAt = createdAt;
    this.isActive = isActive;
  }
}
