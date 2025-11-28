import { IUser } from "@leaguematch/shared";
import { BaseResponse, ErrorResponse } from "./Base";

// CREATE /lobby_create
export interface AddSuccess extends BaseResponse, IUser {
  success: true;
}
export type Create = AddSuccess | ErrorResponse;

// FIND /lobby_find
export interface UpdateSuccess extends BaseResponse, IUser {
  success: true;
  id: string;
}
export type Find = UpdateSuccess | ErrorResponse;

// GENERIC success-only endpoints
export interface GenericSuccess extends BaseResponse {
  success: true;
}

export type Generic = GenericSuccess | ErrorResponse;
