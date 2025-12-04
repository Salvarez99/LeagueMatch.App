import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { router } from "expo-router";
import { db } from "../firebaseConfig";
import { LOG } from "../utils/logger";
import { ILobby } from "@leaguematch/shared";

export function useLobbyListener(lobbyId: string, uid: string) {
  const [lobby, setLobby] = useState<ILobby | null>(null);
  const [joinConfirmed, setJoinConfirmed] = useState<boolean>(false);

  useEffect(() => {
    if (!lobbyId || !uid) return;

    const ref = doc(db, "lobbies", lobbyId);

    LOG.debug("useLobbyListener → Attaching listener", { lobbyId, uid });

    const unsub = onSnapshot(
      ref,
      (snap) => {
        LOG.debug("Lobby snapshot received");

        // Lobby deleted
        if (!snap.exists()) {
          LOG.debug("Lobby deleted → redirect");
          router.back();
          return;
        }

        const data = snap.data() as ILobby;
        const players = data.players || [];
        const kicked = data.kickedPlayers || [];

        setLobby(data);

        const isInLobby = players.some((p) => p.uid === uid);
        const isKicked = kicked.includes(uid);

        // Kicked
        if (isKicked) {
          LOG.debug("User is kicked → redirect");
          router.back();
          return;
        }

        // // Lobby inactive
        // if (!data.isActive) {
        //   LOG.debug("Lobby inactive → redirect");
        //   router.back();
        //   return;
        // }

        // Join confirmed first time
        if (!joinConfirmed && isInLobby) {
          LOG.debug("Join confirmed");
          setJoinConfirmed(true);
          return;
        }

        // User removed after confirmation
        if (joinConfirmed && !isInLobby) {
          LOG.debug("User removed after join → redirect");
          setJoinConfirmed(false);
          router.back();
        }
      },
      (error) => {
        LOG.error("Firestore listener error", error);
      }
    );

    return () => {
      LOG.debug("useLobbyListener → cleanup");
      unsub();
    };
  }, [lobbyId, uid]);

  return { lobby, joinConfirmed, setJoinConfirmed };
}
