export default class API {
  constructor(url:string, tokenKey?:string, tokenValue?:string) {
    this.get = addMethod('GET',url)
    this.post = addMethod('POST',url)
    this.put = addMethod('PUT',url)
    this.del = addMethod('DELETE',url)
    this.upload = addMethod('UPLOAD',url)
    if(tokenKey) this.tokenKey = tokenKey
    if(tokenValue) this.tokenValue = tokenValue
  }
  tokenKey: string
  tokenValue: string
  get: Function
  post: Function
  put: Function
  del: Function
  upload: Function
}

function addMethod(m: string, rootUrl: string): Function {
  return async function (url: string, data: any) {
    if(!data) data={}
    try {
      const skip = isPublic(rootUrl + url)
      if (this.tokenKey && !this.tokenValue && !skip) {
        // throw new Error("no token")
        return
      }
      const headers: { [key: string]: string } = {}
      if(this.tokenKey && this.tokenValue) {
        headers[this.tokenKey] = this.tokenValue
      }
      const opts: { [key: string]: any } = { mode: 'cors' }
      if (m === 'POST' || m === 'PUT') {
        headers['Content-Type'] = 'application/json'
        opts.body = JSON.stringify(data)
      }
      if (m === 'UPLOAD') {
        headers['Content-Type'] = 'multipart/form-data'
        opts.body = data
        console.log("UPLOAD DATA:",data)
      }
      opts.headers = new Headers(headers)

      opts.method = m === 'UPLOAD' ? 'POST' : m
      if (m === 'BLOB') opts.method = 'GET'

      console.log('=>',opts.method,rootUrl + url)

      const r = await fetch(rootUrl + url, opts)
      if (!r.ok) {
        console.log(r)
        throw new Error('Not OK!')
      }
      let res
      if (m === 'BLOB') res = await r.blob()
      else {
        res = await r.json()
        if (res.token) {
          // localStorage.setItem(tokenName, res.token)
        }
        if (res.error) {
          throw res.error
        }
        if (res.status && res.status==='ok') { // invite server
          return res.object
        }
        if (res.success && res.response) { // relay
          return res.response 
        }
      }
    } catch (e) {
      throw e
    }
  }
}

function isPublic(url: string) {
  return url.endsWith('login')
}

async function getToken(name: string) {
  if (!name) return ""
  // return localStorage.getItem(name)
}
