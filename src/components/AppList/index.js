import React, { Component } from 'react'

import { View, Alert, Image, StyleSheet, Platform} from 'react-native'

import NetInfo from "@react-native-community/netinfo";

import { AsyncStorage } from 'react-native'

import { connect } from 'react-redux'
import Button from './Button'

import {
  getAuthVisible,
  getCurrentUser,
  setCurrentUser,
} from '../../ducks/users'
import ListWrapper from './ListWrapper'
import MenuButton from './MenuButton'
import AppBar from './AppBar'
import Modal from '../Viewer/Modal'
import ActionSheet from 'react-native-action-sheet'
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';

class AppList extends Component {
  render() {
    let { navigation, authVisible, currentUser, deviceId } = this.props

    if (authVisible && !global.authIsMounted) {
      navigation.navigate('Login')
    }

    return <ListWrapper userLoading={!currentUser} navigation={navigation} />
  }
}

const mapStateToProps = (state) => ({
  authVisible: getAuthVisible(state),
  currentUser: getCurrentUser(state),
})

const ConnectedAppList = connect(mapStateToProps)(AppList)

let unsubscribe = null

let wifi = "The Internet is connected by WIFI!"
let cellular = "The Internet is connected by Cellular!"
let none = "Internet is no connected!"

let noMessage = "The message content is not selected yet."

let messages = ['There is no Internet', 'The internet is not working', 'The internet connection is failed']

export default class AppListWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      netType: "",
      isConnected: "",
      selectedIndex: '', 
      dropDown:{},
      noInternetMessage:""
    };
    this._dropdown_select = this._dropdown_select.bind(this)
  }
  
  componentDidMount() {
    // Subscribe
    NetInfo.configure({
      reachabilityLongTimeout: 60 * 10, // 60s
      reachabilityShortTimeout: 5 * 10, // 5s
      reachabilityRequestTimeout: 15 * 10, // 15s
    });

    unsubscribe = NetInfo.addEventListener(state => {
      let content = ""
      let type = state.type;
      
      if(type == "wifi"){
        content = wifi
      }else if(type == "cellular"){
        content = cellular
      }else{
        if(this.state.noInternetMessage==""){
          content = noMessage
        }else{
          content = this.state.noInternetMessage
        }
      }

      this.setState({
        netType: state.type,
        isConnected: state.isConnected?'Yes':'No'
      })

      Alert.alert(
        'Internet Status',
        `${content}`,
        [{ text: 'OK', onPress: () => {} }]
      )
    });

    NetInfo.fetch().then(state => {
      this.setState({
        netType: state.type,
        isConnected: state.isConnected?'Yes':'No'
      })
    });
  }

  componentWillUnmount() {
    // Unsubscribe
    if (unsubscribe != null) unsubscribe()
  }

  menuButtonCB = () => {
    let { navigation } = this.props
    ActionSheet.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Logout'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      async (index) => {
        if (index === 1) {
          // Logout
          await AsyncStorage.removeItem('protonSession')
          setCurrentUser(null)
          navigation.navigate('Login')
        }
      }
    )
  }

  // cellular
  handleTestInternet = () => {

    let content = ""
    let type = this.state.netType;
    
    if(type == "wifi"){
      content = wifi
    }else if(type == "cellular"){
      content = cellular
    }else{
      if(this.state.noInternetMessage==""){
        content = noMessage
      }else{
        content = this.state.noInternetMessage
      }
    }


    Alert.alert(
      'Internet Status',
      `${content}`,
      [{ text: 'OK', onPress: () => {} }]
    )
  }

  _dropdown_select(value){
    this.setState({
      noInternetMessage: messages[value]
    })
  }

  handleChooseMessage = () => {
    console.log("hello")
  }
  render() {
    const { open, value, items } = this.state;
    return (
      <View style={styles.wrapper}>
        <AppBar {...this.props} menuButtonCB={this.menuButtonCB} />
        <ConnectedAppList {...this.props} />
        <View style={styles.dropdownStyles}>
          <ModalDropdown onSelect={(value)=>{this._dropdown_select(value)}} defaultIndex={this.state.selectedIndex} dropdownStyle={{width: '100%'}} options={messages}/>
        </View>
        <View style={styles.positionButton}>
          <Button
            title="Internet Test"
            onPress={this.handleTestInternet}
          >
            Internet Status View
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    shadowColor: 'transparent',
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    borderBottomWidth: 0,
    height: Platform.OS === 'ios' ? 56 : undefined,
  },
  dropdownStyles:{
    marginBottom:150,
    borderWidth: 1,
    paddingVertical: 15,
    color:'red',
    // paddingLeft:10,
    // paddingRight:10,
    borderColor: '#00A797',
    fontSize:20,
    borderRadius: 5,
  },
  positionButton:{
    marginBottom:100,
  },
  headerIOS: {
    height: 50,
  },
  headerStripe: {
    height: 4,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  headerWrapper: {
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowRadius: 6,
    shadowOffset: { height: 3 },
    shadowOpacity: 1,
  },
  logo: {
    width: 90,
    height: 24,
  },
})
