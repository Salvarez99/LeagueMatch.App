import * as shared from "@leaguematch/shared";
import { BaseResponse } from "./Base";

// CREATE /lobby_create
export interface CreateSuccess extends BaseResponse {
  success: true;
  id: string;
}
export type Create = CreateSuccess;

// FIND /lobby_find
export interface FindSuccess extends BaseResponse {
  success: true;
  id: string;
}
export type Find = FindSuccess;

// JOIN /lobby_join
export interface JoinSuccess extends BaseResponse {
  success: true;
  updatedLobby: shared.ILobby;
}
export type Join = JoinSuccess;

// GENERIC success-only endpoints
export interface GenericSuccess extends BaseResponse {
  success: true;
}

export type Generic = GenericSuccess;
