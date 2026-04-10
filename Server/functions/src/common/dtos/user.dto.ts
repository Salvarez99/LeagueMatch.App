import { IsString, IsOptional, IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AddUserRequestDto {
  @ApiProperty({ example: "user123", description: "User ID (uid)" })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ example: "john_doe" })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({ example: "JohnDoe#NA1" })
  @IsString()
  @IsOptional()
  riotId?: string;
}

export class UpdateUserRequestDto {
  @ApiPropertyOptional({ example: "john_doe_updated" })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: "newemail@example.com" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: "JohnDoe#NA1" })
  @IsString()
  @IsOptional()
  riotId?: string;
}

export class SendFriendRequestDto {
  @ApiProperty({ example: "user123" })
  @IsString()
  @IsNotEmpty()
  uid!: string;

  @ApiProperty({ example: "target_user_id" })
  @IsString()
  @IsNotEmpty()
  targetUid!: string;
}

export class RespondFriendRequestDto {
  @ApiProperty({ example: "user123" })
  @IsString()
  @IsNotEmpty()
  uid!: string;

  @ApiProperty({ example: "incoming_user_id" })
  @IsString()
  @IsNotEmpty()
  incomingUid!: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  accepted!: boolean;
}

export class RemoveFriendDto {
  @ApiProperty({ example: "user123" })
  @IsString()
  @IsNotEmpty()
  uid!: string;

  @ApiProperty({ example: "target_user_id" })
  @IsString()
  @IsNotEmpty()
  targetUid!: string;
}

export class ToggleBlockDto {
  @ApiProperty({ example: "user123" })
  @IsString()
  @IsNotEmpty()
  uid!: string;

  @ApiProperty({ example: "target_user_id" })
  @IsString()
  @IsNotEmpty()
  targetUid!: string;
}
