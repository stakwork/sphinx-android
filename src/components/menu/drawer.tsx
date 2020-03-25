import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer'
import {Avatar,Title,Drawer,Button} from 'react-native-paper'
import { MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons'
import { useStores } from '../../store'
import { useObserver } from 'mobx-react-lite'

const itemStyle = {height:60,paddingLeft:15}

export default function TheDrawer(props) {
  const {ui, details, user} = useStores()
  return useObserver(() =>
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <View style={styles.userName}>
            <Avatar.Image
              source={require('../../../assets/avatar.png')}
              size={50}
            />
            <Title style={styles.title}>{user.alias}</Title>
          </View>
          <View style={styles.userBalance}>
            <Text style={{marginLeft:60}}>{details.balance}</Text>
            <Text style={{marginLeft:10,marginRight:10,color:'#c0c0c0'}}>sat</Text>
            <AntDesign name="wallet" color="#d0d0d0" size={20} />
          </View>
        </View>
      </View>
      <View style={styles.break}></View>
      <Drawer.Section style={styles.drawerSection}>
        <DrawerItem style={itemStyle}
          icon={({ color, size }) => (
            <Entypo name="chat" color={color} size={size} />
          )}
          label="Dashboard"
          onPress={() => props.navigation.navigate('Dashboard')}
        />
        <DrawerItem style={itemStyle}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="account-multiple" color={color} size={size} />
          )}
          label="Contacts"
          onPress={() => props.navigation.navigate('Contacts')}
        />
        <DrawerItem style={itemStyle}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          )}
          label="Profile"
          onPress={() => props.navigation.navigate('Profile')}
        />
      </Drawer.Section>
      <Button icon="plus" mode="contained" dark={true}
        onPress={() => ui.setAddFriendModal(true)}
        style={{backgroundColor:'#55D1A9',borderRadius:25,width:'60%',height:50,display:'flex',justifyContent:'center',marginLeft:20,marginTop:15}}>
        Add Friend
      </Button>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop:25
  },
  userInfoSection: {
    paddingLeft: 20,
    marginBottom:15,
  },
  title: {
    marginTop: 10,
    marginLeft:15,
    fontWeight: 'bold',
  },
  drawerSection: {
    marginTop: 25,
  },
  userName:{
    flexDirection:'row',
    alignItems:'center',
  },
  userBalance:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:5,
  },
  break:{
    height:20,
    borderBottomWidth:1,
    borderBottomColor:'#eee'
  }
})

