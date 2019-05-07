import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  profileContainer: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  logoutContainer: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "85%",
    borderRadius: 5,
    marginBottom: 10
  },
  logout: {
    padding: 15,
    backgroundColor: "red",
    width: "75%",
    borderRadius: 5,
    marginBottom: 10
  },
  msgContainer: {
    flex: 0.8,
    flexWrap: "wrap"
  },
  dateContainer: {
    flex: 0.2,
    flexWrap: "wrap",
    justifyContent:"flex-end"
  },
  imagePicker: {
    padding:8,
    position:"absolute",
    bottom:13,
    right:"17%",
  }
});

export default styles;
