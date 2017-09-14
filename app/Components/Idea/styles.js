import { Dimensions, Platform, StyleSheet } from "react-native";
let width = Dimensions.get("window").width;

export default StyleSheet.create({
  ideaBox: {
    backgroundColor: "white",
    height: 150,
    margin: 10,
    padding: 5,
    flex: 1,
    minWidth: 150,
    maxWidth: width * 0.5 - 20
  },
  ideaTextField: {
    borderColor: "white",
    borderWidth: 1,
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 14,
    height: 22,
    padding: 1,
    width: width * 0.5 - 30
  },
  ideaTextArea: {
    borderColor: "white",
    borderWidth: 1,
    fontSize: 12,
    height: 88,
    padding: 2,
    width: width * 0.5 - 30
  },
  ideaFieldFocused: {
    borderColor: "#c0cfe7"
  },
  ideaFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: width * 0.5 - 30
  },
  deleteButton: {
    backgroundColor: "#005aba",
    borderRadius: 3,
    flex: 1,
    marginTop: 5,
    width: width * 0.25 - 30
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 11,
    padding: 5,
    textAlign: "center"
  },
  characterCountBox: {
    justifyContent: "center",
    flex: 1,
    marginTop: 5
  },
  characterCount: {
    color: "#005aba",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right"
  }
});
