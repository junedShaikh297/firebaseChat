import React from "react";
import { ActivityIndicator, AsyncStorage, StatusBar, View } from "react-native";
import firebase from "firebase";
import User from "./user";
import styles from "../styles"

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "", 
      storageBucket: "",
      messagingSenderId: ""
    };
    firebase.initializeApp(config);
    setTimeout(() => {
      this._bootstrapAsync();
    }, 1000);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem("userPhone");

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.phone ? "App" : "Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }
}

export default AuthLoadingScreen;
