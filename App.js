import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppView from './src'

console.disableYellowBox = true;

export default class App extends Component {
  render() {
    return (
      <AppView />
    )
  }
}
