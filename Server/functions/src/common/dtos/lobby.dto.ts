import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLobbyRequestDto {
  @ApiProperty({ example: "user123", description: "Host user ID" })
  @IsString()
  @IsNotEmpty()
  hostId!: string;

  @ApiProperty({ example: "Summoner's Rift", description: "Game map" })
  @IsString()
  @IsNotEmpty()
  gameMap!: string;

  @ApiPropertyOptional({ example: "Ranked Solo/Duo", description: "Game mode" })
  @IsString()
  @IsOptional()
  gameMode?: string;

  @ApiPropertyOptional({ example: "Top", description: "Host position" })
  @IsString()
  @IsOptional()
  hostPosition?: string | null;

  @ApiPropertyOptional({ example: "Garen", description: "Champion ID" })
  @IsString()
  @IsOptional()
  championId?: string | null;

  @ApiPropertyOptional({
    example: ["Gold", "Platinum"],
    description: "Rank filter",
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  rankFilter?: string[];
}

export class UpdateGhostDto {
  @ApiProperty({ example: "ghost123" })
  @IsString()
  @IsNotEmpty()
  ghostId!: string;

  @ApiProperty({ example: "Top" })
  @IsString()
  @IsNotEmpty()
  position!: string;

  @ApiPropertyOptional({ example: "Garen" })
  @IsString()
  @IsOptional()
  championId?: string;
}

export class UpdateDiscordDto {
  @ApiProperty({ example: "https://discord.gg/xyz" })
  @IsString()
  @IsNotEmpty()
  discordLink!: string;
}

export class FindLobbyDto {
  @ApiProperty({ example: "Summoner's Rift" })
  @IsString()
  @IsNotEmpty()
  gameMap!: string;

  @ApiProperty({ example: "Ranked Solo/Duo" })
  @IsString()
  @IsNotEmpty()
  gameMode!: string;

  @ApiProperty({ example: "Top" })
  @IsString()
  @IsNotEmpty()
  desiredPosition!: string;

  @ApiProperty({
    example: ["Gold", "Platinum"],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  ranks!: string[];
}

export class JoinLobbyDto {
  @ApiProperty({ example: "user123" })
  @IsString()
  @IsNotEmpty()
  uid!: string;

  @ApiPropertyOptional({ example: "Middle" })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ example: "Ahri" })
  @IsString()
  @IsOptional()
  championId?: string;
}
