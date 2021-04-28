import React, {useContext} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Drawer,
} from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { AuthContext } from '../router/AuthProvider';

export function DrawerContent(props) {
  const { logout } = useContext(AuthContext);

  return(
      <View style={{flex:1}}>
          <DrawerContentScrollView {...props}>
              <View style={styles.drawerContent}>
                  <View style={styles.userInfoSection}>
                      <View style={{flexDirection:'row',marginTop: 15}}>
                          <Avatar.Image 
                              source={require('../assets/bene.png')}
                              size={50}
                          />
                          <View style={{marginLeft:15, flexDirection:'column'}}>
                              <Title style={styles.title}>John Doe</Title>
                              <Caption style={styles.caption}>@j_doe</Caption>
                          </View>
                      </View>
                  </View>

                  <Drawer.Section style={styles.drawerSection}>
                      <DrawerItem
                          label="Home"
                          onPress={() => {props.navigation.navigate('Home')}}
                      />
                      <DrawerItem
                          label="Data Transaksi"
                          onPress={() => {props.navigation.navigate('Data Transaksi')}}
                      />
                  </Drawer.Section>
                  <Drawer.Section style={styles.drawerSection}>
                    <View style={styles.drawerInfoSection}>
                      <Text>Master</Text>
                    </View>
                      <DrawerItem
                          label="Master Ikan"
                          onPress={() => {props.navigation.navigate('Master Ikan')}}
                      />
                      <DrawerItem
                          label="Master Kolam"
                          onPress={() => {props.navigation.navigate('Master Kolam')}}
                      />
                  </Drawer.Section>
              </View>
          </DrawerContentScrollView>
          <Drawer.Section style={styles.bottomDrawerSection}>
              <DrawerItem 
                  label="Logout"
                  onPress={() => {logout()}}
              />
          </Drawer.Section>
      </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  drawerInfoSection: {
    paddingLeft: 17,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
      marginBottom: 15,
      borderTopColor: '#f4f4f4',
      borderTopWidth: 1
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});