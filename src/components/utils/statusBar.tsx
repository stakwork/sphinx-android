import React from 'react'
import { StyleSheet, Platform, StatusBar, View } from 'react-native'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight

type BarStyle = 'default' | 'light-content' | 'dark-content'

const GeneralStatusBarColor = (props) => {

  // const navState = useNavigationState(state=>state.routeNames)

  const {primary} = props
  let backgroundColor = 'white'
  let barStyle:BarStyle = 'dark-content'
  if(primary){
    backgroundColor = '#6289FD'
    barStyle = 'light-content'
  }
  return <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} barStyle={barStyle} />
  </View>
}

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT
  }
})

export default GeneralStatusBarColor
