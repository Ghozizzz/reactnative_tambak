import React, {useContext, useState} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import FormButton from '../components/Form/Button';
import stylesg from '../styles';
// import { Icon } from 'react-native-elements';
import { Button, Appbar  } from 'react-native-paper';
import {windowHeight, windowWidth} from '../components/utils/Dimentions';

const HomeScreen = ({navigation}) => {

    return (
      <View style={stylesg.container}>
        <Appbar.Header>
          <Appbar.Content title="Home"/>
          <Appbar.Action icon="dots-vertical" onPress={() => navigation.openDrawer()} />
        </Appbar.Header>
        {/* <View style={stylesg.headerContainer}>
          <Text style={{color:'#fff'}}>Home</Text>
            <Icon
              name = "menu"
              color = "#fff"
              onPress = {() => navigation.openDrawer()}
            />
        </View> */}

        <ScrollView contentContainerStyle={styles.container}>
          <FormButton
            buttonTitle="Data Transaksi"
            onPress={() => navigation.navigate("Data Transaksi")}
          />
          <FormButton
            buttonTitle="Master Kolam"
            onPress={() => navigation.navigate("Master Kolam")}
          />
          <FormButton
            buttonTitle="Master Ikan"
            onPress={() => navigation.navigate("Master Ikan")}
          />
        </ScrollView>
      </View>
    );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});