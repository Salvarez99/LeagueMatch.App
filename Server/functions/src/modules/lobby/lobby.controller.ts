import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../../common/guards/firebase-auth.guard";
import { LobbyService } from "./lobby.service";
import {
  CreateLobbyRequestDto,
  UpdateGhostDto,
  UpdateDiscordDto,
  FindLobbyDto,
  JoinLobbyDto,
} from "../../common/dtos/lobby.dto";

@ApiTags("lobby")
@Controller("lobby")
@ApiBearerAuth("firebaseAuth")
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post("create")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Create a new lobby" })
  @ApiResponse({
    status: 201,
    description: "Lobby created successfully",
  })
  async create(@Body() body: CreateLobbyRequestDto) {
    const {
      hostId,
      gameMap,
      gameMode = null,
      hostPosition = null,
      championId = null,
      rankFilter = [],
    } = body;

    const newLobby = await this.lobbyService.create({
      hostId,
      gameMap,
      gameMode,
      hostPosition,
      championId,
      rankFilter,
    });

    return {
      success: true,
      message: "Lobby created successfully",
      id: newLobby.id,
    };
  }

  @Patch("ready")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Update ready status" })
  async ready(@Query("lobbyId") lobbyId: string, @Query("uid") uid: string) {
    await this.lobbyService.updateReadyStatus(lobbyId, uid);

    return {
      success: true,
      message: "Ready status updated successfully",
    };
  }

  @Post("addGhost")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Add ghost player to lobby" })
  async addGhost(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Body() body: any,
  ) {
    const { ghostId, index, gameMap, position, championId } = body;

    await this.lobbyService.addGhost(lobbyId, hostId, {
      ghostId,
      index,
      gameMap,
      position,
      championId,
    });

    return {
      success: true,
      message: "Ghost added successfully",
    };
  }

  @Patch("updateGhost")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Update ghost player" })
  async updateGhost(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Body() body: UpdateGhostDto,
  ) {
    const { ghostId, position, championId } = body;

    await this.lobbyService.updateGhost(lobbyId, hostId, {
      ghostId,
      position,
      championId,
    });

    return {
      success: true,
      message: "Ghost updated successfully",
    };
  }

  @Patch("initSearch")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Initialize lobby search" })
  async initSearch(
    @Query("uid") uid: string,
    @Query("lobbyId") lobbyId: string,
  ) {
    await this.lobbyService.initSearch(lobbyId, uid);

    return {
      success: true,
      message: "Lobby is in SEARCHING state",
    };
  }

  @Delete("kick")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Kick player from lobby" })
  async kick(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Query("targetUid") targetUid: string,
  ) {
    await this.lobbyService.kickPlayer(lobbyId, hostId, targetUid);

    return {
      success: true,
      message: "Player kicked successfully",
    };
  }

  @Patch("updateDiscord")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Update Discord link" })
  async updateDiscord(
    @Query("hostId") hostId: string,
    @Query("lobbyId") lobbyId: string,
    @Body() body: UpdateDiscordDto,
  ) {
    const { discordLink } = body;

    await this.lobbyService.updateDiscord(lobbyId, hostId, discordLink);

    return { success: true };
  }

  @Patch("updateChampion")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Update champion" })
  async updateChampion(
    @Query("uid") uid: string,
    @Query("lobbyId") lobbyId: string,
    @Query("championId") championId: string,
  ) {
    await this.lobbyService.updateChampion(lobbyId, uid, championId);

    return {
      success: true,
      message: "Champion updated successfully",
    };
  }

  @Get("getAvailableLobbies")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Get available lobbies" })
  async getAvailableLobbies() {
    const lobbies = await this.lobbyService.getAvailableLobbies();

    return {
      success: true,
      message: "Available lobbies fetched",
      lobbies,
    };
  }

  @Get("get")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Get lobby by ID" })
  async get(@Query("lobbyId") lobbyId: string) {
    const lobby = await this.lobbyService.getLobbyById(lobbyId);

    return {
      success: true,
      message: "Lobby found",
      lobby,
    };
  }

  @Post("find")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Find matching lobby" })
  async find(@Query("uid") uid: string, @Body() body: FindLobbyDto) {
    const { gameMap, gameMode, desiredPosition = null, ranks = [] } = body;

    const lobby = await this.lobbyService.findLobby({
      gameMap,
      gameMode,
      desiredPosition,
      ranks,
      uid,
    });

    return {
      success: true,
      message: "Lobby found",
      id: lobby.id,
    };
  }

  @Patch("join")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Join lobby" })
  async join(@Query("lobbyId") lobbyId: string, @Body() body: JoinLobbyDto) {
    const { uid, position = null, championId = null } = body;

    const updatedLobby = await this.lobbyService.joinLobby(lobbyId, {
      uid,
      position,
      championId,
    });

    return {
      success: true,
      message: "Player successfully joined lobby",
      updatedLobby,
    };
  }

  @Delete("leave")
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: "Leave lobby" })
  async leave(@Query("uid") uid: string, @Query("lobbyId") lobbyId: string) {
    await this.lobbyService.leaveById(lobbyId, uid);

    return {
      success: true,
      message: "Left lobby successfully",
    };
  }
}
