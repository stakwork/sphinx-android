import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

export default function TextMsg(props){
  const {message_content} = props
  return <View>
    <Text style={styles.text}>{message_content}</Text>
  </View>
}

const styles = StyleSheet.create({
  text:{
    color:'#333',
    fontSize:16,
  },
})