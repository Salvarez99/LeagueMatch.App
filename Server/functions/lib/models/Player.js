"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(uid, riotId, position = null, championId = null, ready = false) {
        this.uid = uid;
        this.riotId = riotId;
        this.position = position;
        this.championId = championId;
        this.ready = ready;
    }
}
exports.Player = Player;
