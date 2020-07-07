import { observable, action } from 'mobx'
import {Chat} from './chats'
import {Msg} from './msg'
import {Contact} from './contacts'

export class UiStore {
  @observable ready: boolean = false
  @action
  setReady(ready){
    this.ready = ready
  }

  @observable searchTerm: string = ''
  @action
  setSearchTerm(term) {
    this.searchTerm = term
  }

  @observable contactsSearchTerm: string = ''
  @action
  setContactsSearchTerm(term) {
    this.contactsSearchTerm = term
  }

  @observable qrModal: boolean = false
  @action
  setQrModal(b) {
    this.qrModal = b
  }

  @observable addFriendModal: boolean = false
  @action
  setAddFriendModal(b) {
    this.addFriendModal = b
  }

  @observable subModalParams: {[k:string]:any} = null
  @action
  setSubModalParams(o) {
    console.log('setSubModalParams',o)
    this.subModalParams = o
  }

  @observable editContactModal: boolean = false
  @observable editContactParams: Contact
  @action
  setEditContactModal(p: Contact) {
    this.editContactModal = true
    this.editContactParams = p
  }
  @action
  closeEditContactModal() {
    this.editContactModal = false
    setTimeout(()=>{
      this.editContactParams = null
    },500)
  }

  @observable newGroupModal: boolean = false
  @action setNewGroupModal(b) {
    this.newGroupModal = b
  }

  @observable editTribeParams: {[k:string]:any} = null
  @action setEditTribeParams(o) {
    this.editTribeParams = o ? {
      ...o,
      escrow_time: o.escrow_millis?Math.floor(o.escrow_millis/(60*60*1000)):0
    } : null
  }

  @observable groupModal: boolean = false
  @observable groupModalParams: Chat
  @action setGroupModal(g: Chat) {
    this.groupModal = true
    this.groupModalParams = g
  }
  @action closeGroupModal() {
    this.groupModal = false
    setTimeout(()=>{
      this.groupModalParams = null
    },500)
  }

  @observable pubkeyModal: boolean = false
  @action setPubkeyModal(b) {
    this.pubkeyModal = b
  }

  @observable shareInviteModal: boolean = false
  @observable shareInviteString: string = ''
  @action setShareInviteModal(s: string) {
    this.shareInviteModal = true
    this.shareInviteString = s
  }

  @action clearShareInviteModal() {
    this.shareInviteModal = false
    setTimeout(()=>{
      this.shareInviteString = ''
    },500)
  }

  @observable showPayModal: boolean = false
  @observable payMode: string = ''
  @observable chatForPayModal: Chat | null
  @action setPayMode(m,c) {
    this.payMode = m
    this.chatForPayModal = c
    this.showPayModal = true
  }

  @action clearPayModal() {
    this.showPayModal = false
    setTimeout(()=>{
      this.payMode=''
      this.chatForPayModal = null
    }, 500) // delay 
  }

  @observable confirmInvoiceMsg: Msg
  @action setConfirmInvoiceMsg(s) {
    this.confirmInvoiceMsg = s
  }

  @observable paymentHistory: boolean
  @action setPaymentHistory(b: boolean){
    this.paymentHistory = b
  }

  @observable rawInvoiceModal: boolean = false
  @observable rawInvoiceModalParams: {[k:string]:string} = null
  @action setRawInvoiceModal(params) {
    this.rawInvoiceModal = true
    this.rawInvoiceModalParams = params
    this.lastPaidInvoice = ''
  }

  @action clearRawInvoiceModal() {
    this.rawInvoiceModal = false
    setTimeout(()=>{
      this.rawInvoiceModalParams=null
      this.lastPaidInvoice = ''
    }, 500) // delay 
  }

  @observable lastPaidInvoice:string = ''
  @action setLastPaidInvoice(s:string){
    this.lastPaidInvoice = s
  }

  @observable joinTribeParams: {[k:string]:any} = null
  @action setJoinTribeParams(obj:{[k:string]:any}) {
    this.joinTribeParams = obj
  }

  @observable imgViewerParams: {[k:string]:any} = null
  @action setImgViewerParams(obj:{[k:string]:any}) {
    this.imgViewerParams = obj
  }

  @observable rtcParams: {[k:string]:any} = null
  @action setRtcParams(obj:{[k:string]:any}) {
    this.rtcParams = obj
  }

  @observable jitsiMeet: boolean = false
  @action setJitsiMeet(b:boolean) {
    this.jitsiMeet = b
  }

  @observable is24HourFormat: boolean
  @action setIs24HourFormat(b: boolean) {
    this.is24HourFormat = b
  }b

  @observable replyUUID: string
  @action async setReplyUUID(s) {
    this.replyUUID = s
  }

  @observable oauthParams: {[k:string]:any} = null
  @action setOauthParams(obj:{[k:string]:any}) {
    this.oauthParams = obj
  }

  @observable supportModal: boolean = false
  @action setSupportModal(b:boolean) {
    this.supportModal = b
  }

}

export const uiStore = new UiStore()