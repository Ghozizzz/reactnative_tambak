import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MikanScreen from '../screens/Master/MikanScreen';
import MikanForm from '../screens/Master/MikanForm';

import MKolamScreen from '../screens/Master/MKolamScreen';
import MKolamForm from '../screens/Master/MKolamForm';

import TrxScreen from '../screens/Transaksi/TrxScreen';
import TrxAdd from '../screens/Transaksi/TrxAdd';

const Stack = createStackNavigator();

const MikanStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Master Ikan" component={MikanScreen}></Stack.Screen>
      <Stack.Screen name="Master Ikan Form" component={MikanForm}></Stack.Screen>
    </Stack.Navigator>
  )
}

const MKolamStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Master Kolam" component={MKolamScreen}></Stack.Screen>
      <Stack.Screen name="Master Kolam Form" component={MKolamForm}></Stack.Screen>
    </Stack.Navigator>
  )
}

const TrxStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Data Transaksi" component={TrxScreen}></Stack.Screen>
      <Stack.Screen name="Add Transaksi" component={TrxAdd}></Stack.Screen>
    </Stack.Navigator>
  )
}

export { MikanStackNavigator, MKolamStackNavigator, TrxStackNavigator }