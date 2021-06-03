import React, { Component } from 'react'

import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import { AsyncStorage } from 'react-native'

import { SubmissionError } from 'redux-form'
import { NavigationActions } from 'react-navigation'

import { authenticate } from '../../utils/io'
import Form from './LoginForm'

export default class Login extends Component {
  handleLogin = data => {
      let { navigation } = this.props

      let isLogined = false
      console.log("Helllo:", data.email)

      // console.log(success, sessionToken)

      if(data.email == "adalo@mail.com" && data.password == "adalo"){
        isLogined = true;
      }else{
        isLogined = false;
      }

      if (!isLogined) {
        // Show errors
        Alert.alert(
          'Invalid email or password',
          'Please check the email and password you entered, and try again.',
          [{ text: 'OK', onPress: () => {} }]
        )

        return
      }

      try {
        AsyncStorage.setItem('protonSession', data.email)
        navigation.dispatch(NavigationActions.back())
      } catch (err) {
        Alert.alert(
          'An error occurred',
          'Please try again',
          { text: 'OK', onPress: () => {} }
        )
      }

    // authenticate(data, async ({ success, sessionToken }) => {
    //   let { navigation } = this.props

    //   let isLogined = false
    //   console.log("Helllo:", data.email)

    //   console.log(success, sessionToken)

    //   if(data.email == "admin@gmail.com" && data.password == "admin"){
    //     isLogined = true;
    //   }else{
    //     isLogined = false;
    //   }

    //   if (!isLogined) {
    //     // Show errors
    //     Alert.alert(
    //       'Invalid email or password',
    //       'Please check the email and password you entered, and try again.',
    //       [{ text: 'OK', onPress: () => {} }]
    //     )

    //     return
    //   }

    //   try {
    //     await AsyncStorage.setItem('protonSession', sessionToken)
    //     navigation.dispatch(NavigationActions.back())
    //   } catch (err) {
    //     Alert.alert(
    //       'An error occurred',
    //       'Please try again',
    //       { text: 'OK', onPress: () => {} }
    //     )
    //   }
    // })
  }

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        <WrappedKeyboardAvoidingView
          enabled
          style={styles.innerWrapper}
          behavior="padding"
        >
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formWrapper}>
              <Form onSubmit={this.handleLogin} />
            </View>
          </ScrollView>
        </WrappedKeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

class WrappedKeyboardAvoidingView extends Component {
  render() {
    let { children, style, ...props } = this.props

    if (Platform.OS === 'ios') {
      return <KeyboardAvoidingView {...this.props} />
    }

    return (
      <View style={style}>
        {children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  innerWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formWrapper: {
  },
})
