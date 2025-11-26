import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    height: 260,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },

  description: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 10,
  },

  combinedInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#1a1a1a",
    height: 70,
    marginBottom: 20,
  },

  inputGroupID: {
    flex: 2,
  },
  inputGroupTag: {
    flex: 1,
  },

  label: {
    color: "#ccc",
    fontSize: 10,
    marginBottom: 4,
  },

  input: {
    color: "white",
    paddingVertical: 6,
    fontSize: 16,
  },
  buttonContainer: { flexDirection: "row", gap: 10, marginTop: 5 },
  laterButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    width: 172,
    height: 48,
  },
  riotButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e80000ff",
    borderRadius: 12,
    width: 172,
    height: 48,
  },
});
