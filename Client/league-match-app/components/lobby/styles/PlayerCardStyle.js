import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  playerCardWrapper: {
    width: "45%",
    height: "47%",
    margin: "1.5%",
  },

  playerCard: {
    backgroundColor: "#D9D9D9",
    width: "100%",
    height: "100%", // default height
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  },

  playerCardSelected: {
    height: "78%", // shrinks when selected
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  defaultTextStyle: {
    fontSize: 14,
    color: "#000",
  },

  kickButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#ff4444",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    // attach to card visually
    marginTop: -2, // closes gap between card & button
  },

  kickButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});
