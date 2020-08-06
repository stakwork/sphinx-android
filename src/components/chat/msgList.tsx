import React, {useRef, useMemo, useState, useCallback, useEffect} from 'react'
import {useObserver} from 'mobx-react-lite'
import {useStores, hooks} from '../../store'
import { VirtualizedList, View, Text, StyleSheet, Keyboard, Dimensions } from 'react-native'
import {Chat} from '../../store/chats'
import Message from './msg'
import { useNavigation } from '@react-navigation/native'
import { constants } from '../../constants'
const {useMsgs} = hooks

const group = constants.chat_types.group
const tribe = constants.chat_types.tribe

export default function MsgListWrap({chat,setReplyUUID,replyUuid}:{chat:Chat,setReplyUUID,replyUuid}){
  const {msg,ui,user,chats} = useStores()
  async function onDelete(id){
    await msg.deleteMessage(id)
  }
  async function onApproveOrDenyMember(contactId,status,msgId){
    await msg.approveOrRejectMember(contactId,status,msgId)
  }
  const navigation = useNavigation()
  async function onDeleteChat(){
    navigation.navigate('Home', {params:{rnd:Math.random()}})
    await chats.exitGroup(chat.id)
  }
  return useObserver(()=>{
    const msgs = useMsgs(chat) || []
    return <MsgList msgs={msgs} msgsLength={(msgs&&msgs.length)||0} 
      chat={chat} setReplyUUID={setReplyUUID} replyUuid={replyUuid}
      onDelete={onDelete} myPubkey={user.publicKey}
      onApproveOrDenyMember={onApproveOrDenyMember}
      onDeleteChat={onDeleteChat}
    />
  })
}

function MsgList({msgs, msgsLength, chat, setReplyUUID, replyUuid, onDelete, myPubkey, onApproveOrDenyMember, onDeleteChat}) {
  const scrollViewRef = useRef(null)
  const [viewableIds,setViewableIds] = useState([])
  const {contacts} = useStores()

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
  }, [refreshing])

  useEffect(()=>{
    setTimeout(()=>{
      if(scrollViewRef&&scrollViewRef.current&&msgs.length) {
        scrollViewRef.current.scrollToOffset({offset:0})
      }
    },500)
    Keyboard.addListener('keyboardDidShow', e=>{
      if(scrollViewRef&&scrollViewRef.current&&msgs.length) {
        scrollViewRef.current.scrollToOffset({offset:0})
      }
    })
  },[msgsLength])

  if(chat.status===constants.chat_statuses.pending) {
    return <View style={{display:'flex',alignItems:'center'}}>
      <Text style={{marginTop:27}}>Waiting for admin approval</Text>
    </View>
  }

  const windowWidth = Math.round(Dimensions.get('window').width)

  const isGroup = chat.type===group
  const isTribe = chat.type===tribe
  const initialNumToRender = 9
  return (
    <VirtualizedList
      inverted
      ref={scrollViewRef}
      data={msgs}
      extraData={replyUuid}
      initialNumToRender={initialNumToRender}
      initialScrollIndex={0}
      viewabilityConfig={{
        waitForInteraction: false,
        viewAreaCoveragePercentThreshold: 20
      }}
      onViewableItemsChanged={({viewableItems,changed})=>{
        debounce(()=>{
          const ids=(viewableItems&&viewableItems.filter(c=> c.item.id).map(c=> c.item.id))||[]
          setViewableIds(current=>[...current, ...ids])
        },200)
      }}
      renderItem={({item,index}) => {
        let senderAlias = ''
        const sender = contacts.contacts.find(c=>c.id===item.sender)
        const senderPhoto = !isTribe && (sender&&sender.photo_url) || ''
        if(isTribe) {
          senderAlias = item.sender_alias
        } else {    
          senderAlias = sender && sender.alias
        }
        return <ListItem key={item.id}
          windowWidth={windowWidth}
          viewable={viewableIds.includes(item.id)}
          m={item} chat={chat} 
          senderAlias={senderAlias} senderPhoto={senderPhoto}
          isGroup={isGroup} isTribe={isTribe}
          replyUuid={replyUuid} setReplyUUID={setReplyUUID}
          onDelete={onDelete} myPubkey={myPubkey}
          onApproveOrDenyMember={onApproveOrDenyMember}
          onDeleteChat={onDeleteChat}
        />
      }}
      keyExtractor={(item:any)=> item.id+''}
      getItemCount={()=>msgs.length}
      getItem={(data,index)=>(data[index])}
      ListHeaderComponent={<View style={{height:13}} />}
    />
  )
}

function ListItem({m,chat,isGroup,isTribe,setReplyUUID,replyUuid,viewable,onDelete,myPubkey,senderAlias,senderPhoto,windowWidth,onApproveOrDenyMember,onDeleteChat}) {
  if (m.dateLine) {
    return <DateLine dateString={m.dateLine} />
  }
  const msg=m
  if(!m.chat) msg.chat = chat
  return useMemo(()=> <Message {...msg} viewable={viewable} 
    isGroup={isGroup} isTribe={isTribe} 
    senderAlias={senderAlias} senderPhoto={senderPhoto}
    setReplyUUID={setReplyUUID} replyUuid={replyUuid}
    onDelete={onDelete} myPubkey={myPubkey} windowWidth={windowWidth}
    onApproveOrDenyMember={onApproveOrDenyMember} onDeleteChat={onDeleteChat}
  />, [viewable,m.id,m.type,m.media_token,replyUuid,m.status])
}

function DateLine({dateString}){
  return <View style={styles.dateLine}>
    <View style={styles.line}></View>
    <Text style={styles.dateString}>{dateString}</Text>
  </View>
}

const styles = StyleSheet.create({
  scroller:{
    flex:1,
    overflow:'scroll',
    flexDirection:'column',
  },
  msgList:{
    flex:1,
  },
  line:{
    borderBottomWidth:1,
    borderColor:'#ddd',
    width:'90%',
    position:'absolute',
    left:'5%',
    top:10
  },
  dateLine:{
    width:'100%',
    display:'flex',
    height:20,
    marginBottom:10,
    marginTop:10,
    flexDirection:'row',
    justifyContent:'center',
    position:'relative',
  },
  dateString:{
    fontSize:12,
    backgroundColor:'white',
    paddingLeft:16,
    paddingRight:16
  }
})

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

let inDebounce
function debounce(func, delay) {
  const context = this
  const args = arguments
  clearTimeout(inDebounce)
  inDebounce = setTimeout(() => func.apply(context, args), delay)
}
