import React, { Component } from 'react';
import {StyleSheet, Text, TouchableHighlight, View, ListView, Image, TextInput} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import FullScreenVideo from './FullScreenVideo.js';
import Commons from './lib/commons.js';
import styles from './style/app.js';
import config from './config/app.js';

const FRONT_CAMERA = true;
const webRTCServices = require('./lib/services.js');
const VIDEO_CONFERENCE_ROOM = 'video_conference';

const SELF_STREAM_ID = 'self_stream_id';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stream: {}, //list of (id, url: friend Stream URL). Id = socketId
      joinState: 'ready', //joining, joined
    }
  }

  componentDidMount() {
    webRTCServices.getLocalStream(true, (stream) => {});
  }

  render() {

  const {liveVideoURL} = this.props.navigation.state.params
  console.log('state', this.state.stream.url, 'params', liveVideoURL, 'equal?', this.state.stream.url === liveVideoURL)
    return <View style={styles.container}>
      {
        this.state.joinState == 'joined' ?
        <FullScreenVideo streamURL={liveVideoURL} />
        :
        null
      }
      {this.renderJoinContainer()}
    </View>
  }

  renderJoinContainer = () => {
    if(this.state.joinState != 'joined') {
      return <View style={styles.joinContainer}>
        <TouchableHighlight style={styles.joinButton}
            onPress={this.handleJoinClick}>
          <Text style={styles.joinButtonText}>{this.state.joinState == 'ready' ? 'Join' : 'Joining...'}</Text>
        </TouchableHighlight>
      </View>
    }
    return null;
  }

  handleJoinClick = () => {
    if(this.state.joinState != 'ready') {
      return;
    }
    //ELSE:
    this.setState({
      joinState: 'joining'
    });
    let callbacks = {
      joined: this.handleJoined,
      friendConnected: this.handleFriendConnected,
    }
    webRTCServices.join(VIDEO_CONFERENCE_ROOM, this.state.name, callbacks);
  }

  //----------------------------------------------------------------------------
  //  WebRTC service callbacks
  handleJoined = () => {
    this.setState({
      joinState: 'joined'
    });
  }

  handleFriendConnected = (socketId, stream) => {
    this.setState({
      stream:
        {
          id: socketId,
          url: stream.toURL()
        }
    })
  }
}

// var markerRef = firebase.database().ref('live')
//   markerRef.on('value', (snapshot) => {
//   this.setState({markers: snapshot.val()})
// });
// I am a broadcaster
// I create a room
// I only see myself
// (I can see count of people connected)
// I can close the connection
// Auto generates id
// That gets pushed to the db
// That gets rendred on map

// I am a viewer
// I can click on an id to enter a room
// I can only view
// I can leave
// I get a message when broadcast ends
// (I can commment or like)