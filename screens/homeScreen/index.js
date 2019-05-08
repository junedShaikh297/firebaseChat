import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import User from "../authLoading/user";
import firebase from "firebase";
import rnfirebase from "../lib/firebase";
import type,{ Notification } from "react-native-firebase";

export default class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Chats",
      headerRight: (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <Image
            style={{ height: 32, width: 32, marginRight: 15 }}
            source={require("../assest/user.png")}
          />
        </TouchableOpacity>
      )
    };
  };

  state = {
    users: [],
    loading: true
  };
  componentDidMount() {
    // this.checkPermission();
    this.createNotificationListener();
    let dbref = firebase.database().ref("users");
    dbref.on("child_added", val => {
      let person = val.val();
      person.phone = val.key;
      if (person.phone === User.phone) {
        User.name = person.name;
      } else {
        this.setState(prevState => {
          return {
            users: [...prevState.users, person],
            loading: false
          };
        });
      }
    });
  }

  createNotificationListener = () => {
    console.log("called");
    this.getToken();
    this.notificationDisplayedListener = rnfirebase
      .notifications()
      .onNotificationDisplayed((notification) => {
        console.log("notification",notification);
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    this.notificationListener = rnfirebase
      .notifications()
      .onNotification((notification) => {
        console.log("notification",notification);
        
        // Process your notification as required
      });

    // this.notificationListener = rnfirebase
    //   .notifications()
    //   .onNotification(notfication => {
    //     const { title, body } = notfication;
    //     console.log("notification");
    //   });

    // this.notificationOpenedListener = rnfirebase
    //   .notifications()
    //   .onNotificationOpened(notficationOpen => {
    //     const { title, body } = notficationOpen;
    //     console.log("notification", notficationOpen);
    //   });
  };

  checkPermission = async () => {
    const enabled = await rnfirebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  };

  getToken = async () => {
    rnfirebase
      .messaging()
      .getToken()
      .then(async token => {
        console.log("token", token);
        await AsyncStorage.setItem("userToken", token);
      });
  };

  requestPermission = () => {
    rnfirebase
      .messaging()
      .requestPermission()
      .then(() => {
        // User has authorised
        this.getToken();
      })
      .catch(error => {});
  };

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    // this.notificationListener;
    // this.notificationOpenedListener;
  }

  _renderRow = ({ item, i }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        key={i}
        style={{
          padding: 10,
          borderBottomColor: "#ccc",
          flexDirection: "row",
          borderBottomWidth: 1
        }}
        onPress={() => {
          this.props.navigation.navigate("Chat", item);
        }}
      >
        <Image
          style={{ height: 32, width: 32, marginRight: 15 }}
          source={require("../assest/user.png")}
        />
        <Text style={{ fontSize: 18 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  _emptyList = () => {
    return(
      <View style={{flex:1,alignItems:"center"}}>
        <Text>No user avalible</Text>
      </View>
    )
  }
  render() {
    let { loading, users } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={this._renderRow}
            ListEmptyComponent={this._emptyList}
            keyExtractor={item => {
              item.phone;
            }}
          />
        )}
      </SafeAreaView>
    );
  }
}
