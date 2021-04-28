import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
// import BottomNav from './components/Header/BottomNav';

import DrawerNavigator from './router/DrawerNavigator';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
// import {AuthContext} from './config/AuthProvider';
import auth from '@react-native-firebase/auth';

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <LoginScreen/>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}

export default App;