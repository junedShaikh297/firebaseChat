import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import User from "../authLoading/user";
import styles from "../styles";
import firebase from "firebase";

export default class Login extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    phone: "",
    name: ""
  };

  handleChange = key => val => {
    this.setState({ [key]: val });
  };

  async componentDidMount() {
    let number = await AsyncStorage.getItem("userPhone");
    if (number) {
      this.setState({
        phone: number
      });
    }
  }

  onPress = async () => {
    let { phone, name } = this.state;
    if (phone.length < 10) {
      alert("Enter valid phone number");
    } else if (name.length < 3) {
      alert("Enter name charactor more then 3 letter");
    } else {
      // alert(this.state.phone + "\n" + this.state.name);
      await AsyncStorage.setItem("userPhone", phone);
      User.phone = phone;
      firebase
        .database()
        .ref("users/" + User.phone)
        .set({ name: name });
      this.props.navigation.navigate("App");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.phone}
          onChangeText={this.handleChange("phone")}
          placeholder="Enter phone number"
          style={styles.input}
        />
        <TextInput
          value={this.state.name}
          onChangeText={this.handleChange("name")}
          placeholder="Enter Name"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={this.onPress}
          style={[styles.input, { alignItems: "center", borderColor: "green" }]}
        >
          <Text>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
