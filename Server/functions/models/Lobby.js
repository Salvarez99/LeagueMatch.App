class Lobby {
  static roles = {
    "Summoner's Rift": ["Top", "Jungle", "Mid", "Adc", "Support"],
    ARAM: [], // ARAM doesn’t have specific roles
    "Ranked Solo/Duo": [], // just 2 players, no roles
  };

  constructor(hostId, hostRole, gameMode, maxPlayers, filters = {}) {
    const defaults = {
      "Summoner's Rift": 5,
      ARAM: 5,
      "Ranked Solo/Duo": 2,
    };

    this.hostId = hostId;
    this.gameMode = gameMode;
    this.maxPlayers = maxPlayers || defaults[gameMode] || 5;
    this.players = [{ uid: hostId, role: hostRole }];
    this.currentPlayers = 1;
    this.createdAt = new Date().toISOString();
    this.isActive = true;
    this.filters = filters;

    // If rolesNeeded is not provided, calculate based on gameMode
    if (!this.filters.rolesNeeded) {
      const allRoles = Lobby.roles[gameMode] || [];
      this.filters.rolesNeeded = allRoles.filter((role) => role !== hostRole);
    }

    // Optionally, ensure rank filter exists
    if (this.filters.rank === undefined) {
      this.filters.rank = null;
    }
  }

  addPlayer(uid, role) {
    // prevent duplicates
    if (this.players.some((p) => p.uid === uid)) {
      throw new Error("Player already in lobby");
    }

    if (this.currentPlayers >= this.maxPlayers) {
      throw new Error("Lobby is full");
    }

    this.players.push({ uid, role });
    this.currentPlayers++;

    // update status if now full
    if (this.currentPlayers === this.maxPlayers) {
      this.isActive = false;
    }
  }

  removePlayer(uid) {
    const index = this.players.indexOf(uid);
    this.players.splice(index, 1);
    this.currentPlayers--;
  }

  toFirestore() {
    return { ...this };
  }
}

module.exports = Lobby;
