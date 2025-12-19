// src/controllers/dtos/user.dto.ts
export type AddUserRequestDTO = {
  id: string;
  username: string;
  email: string;
};

export type updateUserRequestDTO = {
  id: string;
  riotId: string;
};
