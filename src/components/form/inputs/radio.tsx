
import * as React from 'react';
import { RadioButton } from 'react-native-paper';
import {View,Text} from 'react-native'

export default function Radio({inverted,name,label,required,error,setValue,handleBlur,value}){
  const val = inverted ? (value?false:true) : (value||false)
  return <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:20,paddingLeft:10}}>
    <RadioButton
      value={value}
      status={val ? 'checked' : 'unchecked'}
      onPress={()=> setValue(!value)}
    />
    <Text style={{fontSize:12,marginLeft:5}}>{label.en}</Text>
  </View>
}