
import API from './api'
import {connectWebSocket, registerWsHandlers} from './ws'
import * as wsHandlers from '../store/websocketHandlers'

const invite = new API('http://hub.sphinx.chat/api/v1/','','')

let relay = null

function instantiateRelay(ip:string, authToken?:string){
  if(!ip) return console.log("cant instantiate Relay, no IP")
  
  if(authToken){
    relay = new API(`http://${ip}/`, 'x-user-token', authToken)
  } else {
    relay = new API(`http://${ip}/`)
  }
  console.log('=> instantiated relay!', `http://${ip}/`)
  
  connectWebSocket(ip)
  registerWsHandlers(wsHandlers)

  // registerHandler each msg type here?
  // or just one?
}

export {
  invite,
  relay,
  instantiateRelay
}
