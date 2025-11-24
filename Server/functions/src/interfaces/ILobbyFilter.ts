export interface ILobbyFilter {
  ranksFilter: string[];
  [key: string]: string[]; // allows additional array-of-string keys
}
