import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import styles from "../styles";
import User from "../authLoading/user";
import firebase from "firebase";
import ImagePicker from "react-native-image-picker";

export default class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name", null)
    };
  };
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      person: {
        name: props.navigation.getParam("name"),
        phone: props.navigation.getParam("phone")
      },
      textMsg: "",
      image: "",
      messageList: []
    };
  }

  handleChange = key => val => {
    this.setState({ [key]: val });
  };

  componentDidMount() {
    let { person } = this.state;
    firebase
      .database()
      .ref("messages")
      .child(User.phone)
      .child(person.phone)
      .on("child_added", value => {
        this.setState(
          prevState => {
            return {
              messageList: [...prevState.messageList, value.val()]
            };
          },
          () => {
            this.timer = setTimeout(() => {
              this.flatList.scrollToEnd({ animated: true });
            }, 200);
          }
        );
      });
  }

  sendMsg = async () => {
    let { textMsg, person, image } = this.state;
    if (textMsg.length > 0) {
      let msgId = firebase
        .database()
        .ref("messages")
        .child(User.phone)
        .child(person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: textMsg,
        time: firebase.database.ServerValue.TIMESTAMP,
        image: image ? image : "",
        from: User.phone
      };
      updates[
        "messages/" + User.phone + "/" + person.phone + "/" + msgId
      ] = message;
      updates[
        "messages/" + person.phone + "/" + User.phone + "/" + msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({ textMsg: "" });
    }
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _renderRow = ({ item, i }) => {
    return (
      <View
        key={i}
        style={{
          flexDirection: "row",
          width: "60%",
          alignSelf: item.from === User.phone ? "flex-end" : "flex-start",
          backgroundColor: item.from === User.phone ? "#5BB216" : "#c9c9c9",
          borderTopLeftRadius: item.from === User.phone ? 12 : 0,
          borderTopRightRadius: item.from === User.phone ? 0 : 12,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          marginBottom: 15
        }}
      >
        <>
          <View style={styles.msgContainer}>
            <Text style={{ color: "#000", padding: 7, fontSize: 16 }}>
              {item.message}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={{ color: "#000", padding: 3, fontSize: 12 }}>
              {this.convertTime(item.time)}
            </Text>
          </View>
        </>
        {/* {item.image !== "" ? (
          <View>
            <Image
              style={{ height: 200, width: 170 }}
              source={{ uri: item.image }}
            />
          </View>
        ) : null} */}
      </View>
    );
  };

  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? "0" : "") + d.getHours() + ":";
    result += (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + " " + d.getMonth() + " " + result;
    }
    return result;
  };

  sendImage = () => {
    const options = {
      title: "Select Avatar",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        this.setState({
          image: response.uri
        });
      }
    });
  };

  uploadImage = (uri, mime = "application/octet-stream") => {};

  render() {
    let { height, width } = Dimensions.get("window");
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F5FCFF" }}>
        <FlatList
          ref={ref => (this.flatList = ref)}
          style={{ padding: 10, height: height * 0.78 }}
          data={this.state.messageList}
          renderItem={this._renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 10,
            paddingLeft: 10
          }}
        >
          <TextInput
            style={[styles.input, { marginRight: 10 }]}
            onChangeText={this.handleChange("textMsg")}
            placeholder="Type message here ...."
            value={this.state.textMsg}
          />
          <TouchableOpacity style={styles.imagePicker} onPress={this.sendImage}>
            <Image
              style={{ height: 22, width: 22 }}
              source={require("../assest/camera.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.input,
              {
                width: "10%",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 15,
                borderWidth: 0
              }
            ]}
            onPress={this.sendMsg}
          >
            <View style={{ transform: [{ rotate: "320deg" }] }}>
              <Image
                style={{ height: 24, width: 24 }}
                source={require("../assest/send.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
