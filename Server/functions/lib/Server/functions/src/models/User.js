export class User {
    constructor(data) {
        var _a, _b, _c, _d;
        this.uid = data.uid;
        this.username = data.username;
        this.email = data.email;
        // Use nullish coalescing to avoid undefined overwriting defaults
        this.puuid = (_a = data.puuid) !== null && _a !== void 0 ? _a : null;
        this.riotId = (_b = data.riotId) !== null && _b !== void 0 ? _b : null;
        this.rank = (_c = data.rank) !== null && _c !== void 0 ? _c : null;
        this.preferredRoles = (_d = data.preferredRoles) !== null && _d !== void 0 ? _d : [];
    }
    toJSON() {
        return {
            uid: this.uid,
            username: this.username,
            email: this.email,
            puuid: this.puuid,
            riotId: this.riotId,
            rank: this.rank,
            preferredRoles: this.preferredRoles,
        };
    }
}
