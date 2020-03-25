import React, {useState, useRef} from 'react'
import {useObserver} from 'mobx-react-lite'
import { TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native'
import {IconButton} from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import {useStores} from '../../store'
import {Chat} from '../../store/chats'
import PaymentModal from '../modals/payment'

export default function BottomBar({chat}:{chat: Chat}) {
  const {ui,msg} = useStores()
  const [text,setText] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  const inputRef = useRef(null)

  function sendMessage(){
    if(!text) return
    let contact_id=null
    if(!chat.id){ // if no chat (new contact)
      contact_id=chat.contact_ids.find(cid=>cid!==1)
    }
    msg.sendMessage({
      contact_id,
      text,
      chat_id: chat.id||null,
    })
    setText('')
    inputRef.current.blur()
    setInputFocused(false)
  }

  return useObserver(()=>
    <View style={styles.bar}>
      {!inputFocused && <IconButton icon="arrow-bottom-left" size={32} color="#666"
        style={{marginLeft:0,marginRight:0}} 
        onPress={()=> ui.setPayMode('invoice', chat)}     
      />}
      <TextInput 
        placeholder="Message..." ref={inputRef}
        style={{...styles.input,marginLeft:inputFocused?15:0}}
        onFocus={()=> setInputFocused(true)}
        onBlur={()=> setInputFocused(false)}
        onChangeText={e=> setText(e)}>
          <Text>{text}</Text>
        </TextInput>
      {/* <IconButton icon="microphone-outline" size={32} color="#666"
        style={{marginLeft:0,marginRight:-4}}
      /> */}
      {!inputFocused && <IconButton icon="arrow-top-right" size={32} color="#666"
        style={{marginLeft:0,marginRight:0}}
        onPress={()=> ui.setPayMode('payment',chat)}
      />}
      {inputFocused && <View style={styles.sendButtonWrap}>
        <TouchableOpacity activeOpacity={0.5} style={styles.sendButton}
          onPress={()=> sendMessage()}>
          <MaterialCommunityIcons name="send" size={17} color="white" />
        </TouchableOpacity>
      </View>}

    </View>
  )
}

const styles=StyleSheet.create({
  bar:{
    flex:1,
    width:'100%',
    maxWidth:'100%',
    flexDirection:'row',
    alignItems:'center',
    height:60,
    maxHeight:60,
    backgroundColor:'white',
    elevation:5,
    borderWidth: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  input:{
    flex:1,
    borderRadius:20,
    borderColor:'#ccc',
    backgroundColor:'whitesmoke',
    paddingLeft:18,
    paddingRight:18,
    borderWidth:1,
    height:40,
    fontSize:17,
    lineHeight:20,
  },
  sendButtonWrap:{
    width:55,
    height:40,
  },
  sendButton:{
    backgroundColor:'#6289FD',
    marginLeft:7,
    width:38,maxWidth:38,
    height:38,maxHeight:38,
    borderRadius:19,
    marginTop:1,
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  }
})