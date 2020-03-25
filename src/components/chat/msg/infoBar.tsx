import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import moment from 'moment'
import { constants } from '../../../constants'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {calcExpiry} from './utils'

const received = constants.statuses.received

const encryptedTypes = [
  constants.message_types.message,
  constants.message_types.invoice,
]

export default function InfoBar(props){
  const isMe = props.sender===1
  const isReceived = props.status===received
  const showLock = encryptedTypes.includes(props.type)

  const {expiry, isExpired} = calcExpiry(props)

  const isPaid = props.status===constants.statuses.confirmed
  const hasExpiry = (!isPaid&&expiry)?true:false

  return <View style={styles.wrap}>
    <View style={{...styles.content,
      alignSelf:isMe?'flex-end':'flex-start',
      flexDirection:isMe?'row-reverse':'row',
      }}>
      <View style={{...styles.innerContent,flexDirection:isMe?'row-reverse':'row'}}>
        <Text style={styles.time}>
          {moment(props.date).format('hh:mm A')}
        </Text>
        {showLock && <MaterialCommunityIcons 
          name="lock" size={14} color="#AFB6BC" 
          style={{marginRight:4,marginLeft:4}}
        />}
        {isMe && isReceived && <MaterialCommunityIcons 
          name="check" size={14} color="#64C684" 
          style={{marginRight:showLock?0:4}}
        />}
      </View>
      {hasExpiry && !isExpired && <Text style={styles.exp}>
        {`Expires in ${expiry} minutes`}
      </Text>}
    </View>
  </View>
}

const styles = StyleSheet.create({
  wrap:{
    height:15,
    width:'100%',
    display:'flex',
  },
  content:{
    marginRight:15,
    marginLeft:15,
    maxWidth:234,
    minWidth:234,
    display:'flex',
    justifyContent:'space-between',
  }, 
  innerContent:{
    display:'flex',
  },
  time:{
    fontSize:10,
    color:'#aaa',
  },
  exp:{
    fontSize:10,
    color:'#aaa',
  }
})