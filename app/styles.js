import { Dimensions, Platform, StyleSheet } from "react-native";
let width = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    backgroundColor: "#c0cfe7",
    flex: 1
  },
  topBar: {
    alignItems: "center",
    backgroundColor: "#005aba",
    flexDirection: "row",
    height: Platform.OS === "ios" ? 74 : 54,
    justifyContent: "center",
    padding: 10,
    paddingTop: Platform.OS === "ios" ? 20 : 10
  },
  topBarHeading: {
    color: "#FFFFFF",
    flex: 1,
    fontWeight: "bold",
    textAlign: "center"
  },
  topBarButton: {
    borderColor: "#fff",
    borderWidth: 2,
    padding: 8,
    width: 85
  },
  topBarButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center"
  },
  H1: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold"
  },
  ideasContainerScroll: {
    flex: 1
  },
  ideasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width
  },
  notificationBox: {
    backgroundColor: "green",
    flex: 1,
    left: 0,
    padding: 5,
    position: "absolute",
    right: 0,
    top: Platform.OS === "ios" ? 74 : 54
  },
  notificationError: {
    backgroundColor: "red"
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center"
  }
});
