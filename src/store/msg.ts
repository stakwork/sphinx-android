import { observable, action } from 'mobx'
import {relay} from '../api'
import {contactStore} from './contacts'
import {chatStore,Chat} from './chats'
import * as rsa from '../crypto/rsa'
import {constants} from '../constants'

export interface Msg {
  id: number
  chat_id: number
  type: number
  sender: number
  receiver: number
  amount: number
  amount_msat: number
  payment_hash: string
  payment_request: string
  date: string
  expiration_data: string
  message_content: string
  remote_message_content: string
  status: number
  status_map: {[k:number]:number}
  parent_id: number
  subscription_id: number
  media_type: string
  media_token: string
  media_key: string
  seen: boolean
  created_at: string
  updated_at: string,

  text: string,

  chat: Chat
}

class MsgStore {
  @observable // chat id: message array
  messages: {[k:number]:Msg[]} = {}

  @action
  async getMessages() {
    try {
      const r = await relay.get('messages')
      const msgs = await decodeContent(r.new_messages)
      this.messages = orgMsgs(msgs)
    } catch(e) {
      console.log(e)
    }
  }

  @action
  async gotNewMessage(m) {
    let newMsg = m
    if(m.message_content){
      const dec = await rsa.decrypt(m.message_content)
      newMsg = {...m, message_content:dec}
    }
    if(newMsg.chat && newMsg.chat.id){
      putIn(this.messages, newMsg)
      chatStore.gotChat(newMsg.chat)
      console.log(this.messages)
    }
  }

  @action
  async invoicePaid(m) {
    if(m.chat && m.chat.id){
      const msgs = this.messages[m.chat.id]
      if(msgs) {
        const invoice = msgs.find(c=>c.payment_hash===m.payment_hash)
        if(invoice){
          invoice.status = constants.statuses.confirmed
        }
      }
    }
  }

  @action
  async sendMessage({contact_id, text, chat_id}) {
    try {
      const encryptedText = await encryptText({contact_id:1, text})
      const remote_text_map = await makeRemoteTextMap({contact_id, text, chat_id})
      const v = {
        contact_id,
        chat_id: chat_id||null,
        text: encryptedText,
        remote_text_map
      }
      const r = await relay.post('messages', v)
      this.gotNewMessage(r)
    } catch(e) {
      console.log(e)
    }
  }

  @action
  async setMessageAsReceived(m) {
    if(!(m.chat)) return
    const msgsForChat = this.messages[m.chat.id]
    const ogMessage = msgsForChat.find(msg=> msg.id===m.id)
    ogMessage.status = constants.statuses.received
  }

  @action
  async sendPayment({contact_id, amt, chat_id, destination_key}) {
    try {
      const v = {
        contact_id,
        chat_id: chat_id||null,
        amount: amt,
        destination_key
      }
      const r = await relay.post('payment', v)
      this.gotNewMessage(r)
    } catch(e) {
      console.log(e)
    }
  }

  @action
  async sendInvoice({contact_id, amt, chat_id, memo}) {
    try {
      const myenc = await encryptText({contact_id:1, text:memo})
      const encMemo = await encryptText({contact_id, text:memo})
      const v = {
        contact_id,
        chat_id: chat_id||null,
        amount: amt,
        memo: myenc,
        remote_memo: encMemo,
      }
      const r = await relay.post('invoices', v)
      this.gotNewMessage(r)
    } catch(e) {
      console.log(e)
    }
  }

  @action
  async payInvoice({payment_request}) {
    try {
      const v = {payment_request}
      const r = await relay.put('invoices', v)
      this.invoicePaid(r)
    } catch(e) {
      console.log(e)
    }
  }

}

async function encryptText({contact_id, text}) {
  if(!text) return ''
  const contact = contactStore.contacts.find(c=> c.id===contact_id)
  if(!contact) return ''
  const encText = await rsa.encrypt(text, contact.contact_key)
  return encText
}

async function makeRemoteTextMap({contact_id, text, chat_id}){
  const idToKeyMap = {}
  const remoteTextMap = {}
  const chat = chat_id && chatStore.chats.find(c=> c.id===chat_id)
  if(chat){
    const contactsInChat = contactStore.contacts.filter(c=>{
      return chat.contact_ids.includes(c.id) && c.id!==1
    })
    contactsInChat.forEach(c=> idToKeyMap[c.id]=c.contact_key)
  } else {
    const contact = contactStore.contacts.find(c=> c.id===contact_id)
    idToKeyMap[contact_id] = contact.contact_key
  }
  for (let [id, key] of Object.entries(idToKeyMap)) {
    const encText = await rsa.encrypt(text, key)
    remoteTextMap[id] = encText
  }
  return remoteTextMap
}

async function decodeContent(messages: Msg[]){
  const msgs = []
  for (const m of messages) {
    if(m.message_content) {
      const dec = await rsa.decrypt(m.message_content)
      msgs.push({...m, message_content:dec})
    } else {
      msgs.push(m)
    }
  }
  return msgs
}

function orgMsgs(messages: Msg[]) {
  const orged: {[k:number]:Msg[]} = {}
  messages.forEach(msg=>{
    if(msg.chat && msg.chat.id){
      putIn(orged, msg)
    }
  })
  return orged
}

function putIn(orged, msg){
  if(msg.chat){
    if(orged[msg.chat.id]){
      orged[msg.chat.id].push(msg)
    } else {
      orged[msg.chat.id] = [msg]
    }
  }
}

export const msgStore = new MsgStore()