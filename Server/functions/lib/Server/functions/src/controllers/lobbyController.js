import { lobbyService } from "../services/lobbyService";
export class LobbyController {
    async create(req, res) {
        try {
            const { hostId, gameMap, gameMode = null, hostPosition = null, championId = null, rankFilter = [], } = req.body;
            const newLobby = await lobbyService.create({
                hostId,
                gameMap,
                gameMode,
                hostPosition,
                championId,
                rankFilter,
            });
            return res.status(201).json({
                success: true,
                message: "Lobby created successfully",
                id: newLobby.id,
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Error creating lobby",
                error: err.message,
            });
        }
    }
    async ready(req, res) {
        try {
            const lobbyId = req.query.lobbyId;
            const uid = req.query.uid;
            await lobbyService.updateReadyStatus(lobbyId, uid);
            return res.status(200).json({
                success: true,
                message: "Ready status updated successfully",
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Error updating ready status",
                error: err.message,
            });
        }
    }
    async kick(req, res) {
        try {
            const lobbyId = req.query.lobbyId;
            const hostId = req.query.hostId;
            const { uid } = req.body;
            await lobbyService.kickPlayer(lobbyId, hostId, uid);
            return res.status(200).json({
                success: true,
                message: "Player kicked successfully",
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Error kicking player",
                error: err.message,
            });
        }
    }
    async updateDiscord(req, res) {
        try {
            const { lobbyId, hostId, discordLink } = req.body;
            await lobbyService.updateDiscord(lobbyId, hostId, discordLink);
            return res.json({ success: true });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(400).json({ success: false, error: err.message });
        }
    }
    async updateChampion(req, res) {
        try {
            const lobbyId = req.query.lobbyId;
            const uid = req.query.uid;
            const { championId } = req.body;
            await lobbyService.updateChampion(lobbyId, uid, championId);
            return res.status(200).json({
                success: true,
                message: "Champion updated successfully",
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Error updating champion",
                error: err.message,
            });
        }
    }
    async getAvailableLobbies(req, res) {
        try {
            const { desiredRole } = req.body;
            const lobbies = await lobbyService.getAvailableLobbies(desiredRole);
            return res.status(200).json({
                success: true,
                message: "Available lobbies fetched",
                lobbies,
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Error getting available lobbies",
                error: err.message,
            });
        }
    }
    async get(req, res) {
        try {
            const lobbyId = req.query.lobbyId;
            if (!lobbyId) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                    error: "lobbyId query parameter is required",
                });
            }
            const lobby = await lobbyService.getLobbyById(lobbyId);
            if (!lobby) {
                return res.status(404).json({
                    success: false,
                    message: "Error getting lobby",
                    error: "Lobby id not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Lobby found",
                lobby,
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Error retrieving lobby",
                error: err.message,
            });
        }
    }
    async find(req, res) {
        try {
            const uid = req.query.uid;
            const { gameMap, gameMode, desiredPosition = null, ranks = [], } = req.body;
            if (!gameMap || !gameMode) {
                return res.status(400).json({
                    success: false,
                    message: "gameMap and gameMode are required",
                });
            }
            const lobby = await lobbyService.findLobby({
                gameMap,
                gameMode,
                desiredPosition,
                ranks,
                uid,
            });
            if (!lobby) {
                return res.status(404).json({
                    success: false,
                    message: "No lobbies found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Lobby found",
                id: lobby.id,
            });
        }
        catch (err) {
            if (err.statusCode) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message,
                    code: err.code || null,
                });
            }
            return res.status(500).json({
                success: false,
                message: "Error finding lobby",
                error: err.message,
            });
        }
    }
    async join(req, res) {
        try {
            if (req.method !== "POST") {
                return res.status(405).json({
                    success: false,
                    message: "Method not allowed",
                    error: "Use POST",
                });
            }
            const lobbyId = req.query.lobbyId;
            const { uid, position = null, championId = null } = req.body;
            if (!lobbyId || !uid) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                    error: "Missing lobbyId and/or uid",
                });
            }
            const updatedLobby = await lobbyService.joinLobby(lobbyId, {
                uid,
                position,
                championId,
            });
            return res.status(200).json({
                success: true,
                message: "Player successfully joined lobby",
                updatedLobby,
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error joining lobby",
                error: err.message,
            });
        }
    }
    async leave(req, res) {
        try {
            if (req.method !== "DELETE") {
                return res.status(405).json({
                    success: false,
                    message: "Method not allowed",
                    error: "Use DELETE",
                });
            }
            const lobbyId = req.query.lobbyId;
            const uid = req.query.uid;
            if (!lobbyId || !uid) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                    error: "lobbyId and/or uid",
                });
            }
            await lobbyService.leaveById(lobbyId, uid);
            return res.status(200).json({
                success: true,
                message: `Left lobby successfully`,
            });
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error leaving lobby.",
                error: err.message,
            });
        }
    }
}
export const lobbyController = new LobbyController();
