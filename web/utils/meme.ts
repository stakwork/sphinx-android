import * as ipc from '../crypto/ipc'

export async function uploadFile(file:File,type:string,host:string,token:string,filename:string){
  const fileBase64 = await toBase64(file)
  const args={file:fileBase64, type, host, token, filename}
  const ret = await ipc.send('upload-file', args)
  const obj:{[k:string]:any} = typeof ret==='object' ? ret : {}
  return {
    muid: obj.muid,
    media_key: obj.media_key,
    fileBase64
  }
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = error => reject(error)
})
