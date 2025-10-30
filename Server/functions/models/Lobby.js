class Lobby {
  static mapPositions = {
    "Summoner's Rift": ["Top", "Jungle", "Middle", "Adc", "Support"],
  };

  constructor(
    hostId,
    gameMap,
    gameMode = null,
    hostPosition = null,
    championId = null,
    ranksFilter = []
  ) {
    if (!hostId || !gameMap) throw new Error("hostId and gameMap are required");

    this.hostId = hostId;
    this.gameMap = gameMap;
    this.gameMode = gameMode;
    this.kickedPlayers = [];
    this.currentPlayers = 1;
    this.createdAt = new Date().toISOString();
    this.isActive = true;

    // Determine map-specific configurations
    switch (gameMap) {
      case "Summoner's Rift": {
        if (!gameMode)
          throw new Error("gameMode is required for Summoner's Rift");
        if (!hostPosition)
          throw new Error("hostPosition is required for Summoner's Rift");
        if (!championId)
          throw new Error("championId is required for Summoner's Rift");

        this.maxPlayers = gameMode === "Ranked Solo/Duo" ? 2 : 5;
        const positions = Lobby.mapPositions["Summoner's Rift"];
        const positionsNeeded = positions.filter((pos) => pos !== hostPosition);
        this.filter = {
          ranksFilter: ranksFilter,
          positionsNeeded: positionsNeeded,
        };
        break;
      }

      case "Aram": {
        if (!gameMode) throw new Error("gameMode is required for Aram");
        this.maxPlayers = 5;
        this.filter = { ranksFilter: ranksFilter, positionsNeeded: [] };
        break;
      }

      case "Featured Mode": {
        if (!gameMode)
          throw new Error("gameMode is required for Featured Mode");
        if (!championId)
          throw new Error("championId is required for Featured Mode");
        this.maxPlayers = gameMode === "Arena" ? 2 : 5;
        this.filter = { ranksFilter: ranksFilter, positionsNeeded: [] };
        break;
      }

      default:
        throw new Error("Game Map is not supported");
    }

    // Player list starts with host
    this.players = [
      {
        uid: hostId,
        position: hostPosition || null,
        championId: championId || null,
      },
    ];
  }

  addPlayer(uid, position = null, championId = null) {
    // prevent duplicates
    if (this.players.some((p) => p.uid === uid)) {
      throw new Error("Player already in lobby");
    }

    if (this.currentPlayers >= this.maxPlayers) {
      throw new Error("Lobby is full");
    }

    this.players.push({ uid, position, championId });
    this.currentPlayers++;

    // update status if now full
    if (this.currentPlayers === this.maxPlayers) {
      this.isActive = false;
    }
  }

  removePlayer(uid) {
    const playerIndex = this.players.findIndex((p) => p.uid === uid);
    if (playerIndex === -1) {
      throw new Error("Player not found in lobby");
    }

    const [removedPlayer] = this.players.splice(playerIndex, 1);
    this.currentPlayers--;

    // Reopen the role/position slot if applicable
    if (
      removedPlayer.position &&
      this.gameMap === "Summoner's Rift" &&
      !this.positionsNeeded.includes(removedPlayer.position)
    ) {
      this.positionsNeeded.push(removedPlayer.position);
      // Also update filter for consistency
      this.filter.positionsNeeded = [...this.positionsNeeded];
    }

    //Appended to kickedPlayers
    this.kickedPlayers.push(removedPlayer.uid);
    
    // Mark lobby active again if not full
    if (!this.isActive && this.currentPlayers < this.maxPlayers) {
      this.isActive = true;
    }
  }

  toFirestore() {
    return { ...this };
  }
}

module.exports = Lobby;
