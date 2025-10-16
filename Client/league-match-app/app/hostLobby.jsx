import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import FilterButton from "../components/FilterButton";
import Screen from "../utils/dimensions";
import LobbySearchButton from "../components/LobbySearchButton";

export default function HostLobby() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          flex: 1.2,
          display: "flex",
          flexDirection: "row",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          // backgroundColor: "red",
        }}
      >
        <View
          style={{
            // backgroundColor: "#D9D9D9",
            height: Screen.height * 0.05,
            width: Screen.width * 0.8,
            justifyContent: "center",
            alignItems: "flex-start",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Summoner's Rift 5v5
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#000",
            }}
          >
            Normal
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#D9D9D9",
            height: Screen.height * 0.05,
            width: Screen.height * 0.05,
            borderRadius: 15,
            elevation: 5,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        ></View>
      </View>
      <View
        style={{
          flex: 3,
          display: "flex",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "blue",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#D9D9D9",
            height: Screen.height * 0.14,
            width: Screen.width * 0.93,
            borderRadius: 15,
            elevation: 5,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#000",
            }}
          >
            Host Card
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 10,
          display: "flex",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "green",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#D9D9D9",
            height: Screen.height * 0.48,
            width: Screen.width * 0.8,
            borderRadius: 15,
            elevation: 5,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#000",
            }}
          >
            Gamemode Select
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "row",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 8,
          // backgroundColor: "pink",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#D9D9D9",
            height: Screen.height * 0.07,
            width: Screen.width * 0.46,
            borderRadius: 15,
            elevation: 5,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#000",
            }}
          >
            Pick Champion
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#D9D9D9",
            height: Screen.height * 0.07,
            width: Screen.width * 0.48,
            borderRadius: 15,
            elevation: 5,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#000",
            }}
          >
            Position
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 2,
          display: "flex",
          flexDirection: "row",
          width: Screen.width,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 8,
          // backgroundColor: "purple",
        }}
      >
        <LobbySearchButton />
        <FilterButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    height: Screen.height * 0.07,
    width: Screen.width * 0.6,
    borderRadius: 15,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});
