class UserDTO {
  constructor({
    username,
    email,
    puuid = null,
    riotId = null,
    preferredRoles = [],
    rank = null,
  }) {
    this.puuid = puuid; // Riot Games PUUID
    this.riotId = riotId; // Summoner’s Riot ID (ex: "gameName#Tagline")
    this.preferredRoles = preferredRoles; // Array of roles, e.g. ["Top", "Jungle"]
    this.rank = rank; // Current rank (ex: "Gold IV")
    this.username = username; // Display name for app
    this.email = email; // User’s email
  }

  toJSON() {
    return {
        username: this.username,
        email: this.email,
        riotId: this.riotId,
        puuid: this.puuid,
        rank: this.rank,
        preferredRoles: this.preferredRoles,
    };
  }
}

module.exports = UserDTO;
