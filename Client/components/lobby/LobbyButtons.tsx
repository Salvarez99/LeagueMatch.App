import { ILobby, LobbyState } from "@leaguematch/shared";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles/LobbyButtonsStyle";

interface LobbyButtonsProps {
  onLeave: () => void;
  onReady: () => void;
  onSearch: () => void;
  isHost: boolean;
  lobby: ILobby;
  status: boolean;
}

export default function LobbyButtons({
  onLeave,
  onReady,
  onSearch,
  status,
  isHost,
  lobby,
}: LobbyButtonsProps) {
  const [disabled, setDisabled] = useState(false);

  const isLobbyFull = lobby.currentPlayers === lobby.maxPlayers;
  const playersReady = lobby.players.every((p) => p.ready);

  const isIdle = lobby.state === LobbyState.IDLE;
  const isSearching = lobby.state === LobbyState.SEARCHING;

  const outlineColor = status ? "#00C851" : "#ff4444";
  const label = status ? "Unready" : "Ready";

  const handleReady = async () => {
    if (disabled) return;
    setDisabled(true);
    try {
      await onReady();
    } finally {
      setTimeout(() => setDisabled(false), 300);
    }
  };

  const handleSearch = async () => {
    if (disabled) return;
    setDisabled(true);
    try {
      await onSearch();
    } finally {
      setTimeout(() => setDisabled(false), 300);
    }
  };

  return (
    <View style={styles.bottomButtonRow}>
      <>
        {/* 🔵 1. SEARCHING STATE — show Searching... for everyone */}
        {isSearching ? (
          <TouchableOpacity
            style={[
              styles.bottomButton,
              { borderWidth: 2, borderColor: "#888", opacity: 0.6 },
            ]}
            disabled={true}
          >
            <Text style={styles.defaultTextStyle}>Searching...</Text>
          </TouchableOpacity>
        ) : isHost && isIdle && !isLobbyFull && playersReady ? (
          /* 🟢 2. HOST sees Search button when everyone is ready */
          <TouchableOpacity
            style={[
              styles.bottomButton,
              {
                borderWidth: 2,
                borderColor: "#00C851",
                opacity: disabled ? 0.5 : 1,
              },
            ]}
            onPress={handleSearch}
            disabled={disabled}
          >
            <Text style={styles.defaultTextStyle}>Search</Text>
          </TouchableOpacity>
        ) : (
          /* 🔴 3. READY / UNREADY button */
          <TouchableOpacity
            style={[
              styles.bottomButton,
              {
                borderWidth: 2,
                borderColor: outlineColor,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
            onPress={handleReady}
            disabled={disabled}
          >
            <Text style={styles.defaultTextStyle}>{label}</Text>
          </TouchableOpacity>
        )}
      </>

      {/* Leave Button */}
      <TouchableOpacity style={styles.bottomButton} onPress={onLeave}>
        <Text style={styles.defaultTextStyle}>Leave</Text>
      </TouchableOpacity>
    </View>
  );
}
