import RNCryptor from 'rn-rncryptor'

export async function encrypt(txt, pwd): Promise<string> {
  try {
    const encryptedbase64 = await RNCryptor.encrypt(txt,pwd)
    return encryptedbase64
  } catch(e){
    console.log(e)
    return ''
  }
}

export async function encryptFile(pathname, pwd): Promise<string> {
  try {
    const encryptedbase64 = await RNCryptor.encryptFile(pathname,pwd)
    return encryptedbase64
  } catch(e){
    console.log(e)
    return ''
  }
}

export async function encryptFromBase64(b64, pwd): Promise<string> {
  try {
    const encryptedbase64 = await RNCryptor.encryptFromBase64(b64,pwd)
    return encryptedbase64
  } catch(e){
    console.log(e)
    return ''
  }
}

export async function decrypt(txt, pwd): Promise<string> {
  try {
    const dec = await RNCryptor.decrypt(txt,pwd)
    return dec
  } catch(e){
    console.log(e)
    return ''
  }
}

export async function decryptToBase64(txt, pwd): Promise<string> {
  try {
    const decryptedbase64 = await RNCryptor.decryptToBase64(txt,pwd)
    return decryptedbase64
  } catch(e){
    console.log(e)
    return ''
  }
}

export async function readEncryptedFile(filepath, pwd): Promise<string> {
  try {
    const decryptedbase64 = await RNCryptor.readEncryptedFile(filepath,pwd)
    return decryptedbase64
  } catch(e){
    console.log(e)
    return ''
  }
}

async function testAES(){
  const msg='hi'
  const enc = await encrypt(msg,'pass')
  const dec = await decrypt(enc,'pass')
  console.log(dec,dec===msg)
}

