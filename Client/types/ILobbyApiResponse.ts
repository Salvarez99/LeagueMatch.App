import * as shared from "@leaguematch/shared"
export interface Create {
  success:boolean;
  message:string;
  id:string;
}

export interface Find {
  success:boolean;
  message:string;
  id:string;
}

export interface Join {
  success:boolean;
  message:string;
  updatedLobby: shared.ILobby

}