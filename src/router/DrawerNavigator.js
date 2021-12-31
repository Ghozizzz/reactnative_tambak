import React from 'react';

import { createDrawerNavigator , DrawerItem} from "@react-navigation/drawer";

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MikanStackNavigator, MKolamStackNavigator, TrxStackNavigator } from './StackNavigator';
import { DrawerContent } from './DrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Master Ikan" component={MikanStackNavigator} />
      <Drawer.Screen name="Master Kolam" component={MKolamStackNavigator} />
      <Drawer.Screen name="Data Transaksi" component={TrxStackNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;