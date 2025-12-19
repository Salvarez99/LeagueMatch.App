export type createLobbyRequestDTO = {
        hostId:string;
        gameMap:string;
        gameMode? :string;
        hostPosition? :string | null;
        championId? :string | null;
        rankFilter? :string[];
}