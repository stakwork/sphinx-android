import React, {useState} from 'react'
import {View,StyleSheet,Text,Image} from 'react-native'
import { useStores } from '../../store'
import {useObserver} from 'mobx-react-lite'
import {Button, IconButton} from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import Slider from '../utils/slider'

export default function ProfilePic({z,show,onDone,onBack}) {
  const {contacts, user} = useStores()
  const [uploading, setUploading] = useState(false)
  const [img, setImg] = useState(null)

  async function pickImage() {
    let result:{[k:string]:any} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.cancelled) {
      setImg(result)
    }
  }

  async function finish(){
    if(img) {
      setUploading(true)
      await contacts.uploadProfilePic(img, {
        contact_id:1,
      })
      setUploading(false)
    }
    onDone()
  }

  return useObserver(()=> {
    return <Slider z={z} show={show} style={{backgroundColor:'#F5F6F8'}}>
      <IconButton icon="arrow-left"
        style={styles.backArrow}
        color="#AAA" onPress={onBack}
      />
      <View style={styles.nicknameWrap}>
        <Text style={styles.nickname}>
          {user.alias}
        </Text>
      </View>
      <View style={styles.mid}>
        {img && <Image source={{uri: img.uri}} 
          style={{width:180,height:180,borderRadius:90}} resizeMode={'cover'}
        />}
        {!img && <Image source={require('../../../assets/avatar3x.png')} 
          style={{width:180,height:180}} resizeMode={'cover'}
        />}
        <Button mode="contained" icon="refresh"
          onPress={pickImage}
          style={styles.selectButton}>
          Select Image
        </Button>
      </View>
      <View style={styles.buttonWrap}>
        <Button mode="contained" dark={true}
          loading={uploading}
          onPress={finish}
          style={styles.button}>
          {img ? 'Next' : 'Skip'}
        </Button>
      </View>
    </Slider>
  })
}

const styles=StyleSheet.create({
  backArrow:{
    position:'absolute',
    left:15,
    top:15,
  },
  nicknameWrap:{
    position:'absolute',
    top:12,
  },
  nickname:{
    fontSize:32,
    marginTop:60,
    textAlign:'center',
    marginLeft:50,
    marginRight:50
  },
  mid:{
    width:'100%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  selectButton:{
    height:60,
    borderRadius:30,
    width:200,
    marginTop:20,
    backgroundColor:'white',
    display:'flex',
    justifyContent:'center',
  },
  buttonWrap:{
    position:'absolute',
    bottom:42,
    width:'100%',
    height:60,
    display:'flex',
    flexDirection:'row-reverse',
  },
  button:{
    width:150,
    marginRight:'12.5%',
    borderRadius:30,
    height:60,
    display:'flex',
    justifyContent:'center',
    backgroundColor:'#6289FD'
  },  
})