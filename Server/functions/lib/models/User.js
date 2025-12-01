"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        // Use nullish coalescing to avoid undefined overwriting defaults
        this.puuid = data.puuid ?? null;
        this.riotId = data.riotId ?? null;
        this.rank = data.rank ?? null;
        this.preferredRoles = data.preferredRoles ?? [];
    }
    toJSON() {
        return {
            username: this.username,
            email: this.email,
            puuid: this.puuid,
            riotId: this.riotId,
            rank: this.rank,
            preferredRoles: this.preferredRoles,
        };
    }
}
exports.User = User;
