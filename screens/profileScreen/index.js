import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import User from "../authLoading/user";
import styles from "../styles";
import firebase from "firebase";

export default class Profile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Profile"
    };
  };

  state = {
    name: User.name
  };

  handleChange = key => val => {
    this.setState({ [key]: val });
  };

  changeName = () => {
    let { name } = this.state;
    if (name.length < 3) {
      Alert.alert("Error", "Enter name munst be more thsn 3 letter.");
    } else if (User.name !== name) {
      firebase
        .database()
        .ref("users")
        .child(User.phone)
        .set({ name: name });
      User.name = name;
      Alert.alert("Success", "Name Changed successfully.");
    }
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.profileContainer}>
          <TextInput
            value={this.state.name}
            onChangeText={this.handleChange("name")}
            style={[styles.input,{width:"75%", paddingVertical:10}]}
          />
          <TouchableOpacity
            onPress={this.changeName}
            style={[styles.logout, { alignItems: "center", backgroundColor:"#5BB216" }]}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Change name</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={this._signOutAsync}
            style={[styles.logout, { alignItems: "center" }]}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
