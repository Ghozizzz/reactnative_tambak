import React, {useContext, useState} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import FormInput from '../components/Form/Input';
import FormButton from '../components/Form/Button';
import stylesg from '../styles';
// import { Icon } from 'react-native-elements';
import { Button, Appbar  } from 'react-native-paper';
import {user} from '../config/firebase';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {windowHeight, windowWidth} from '../components/utils/Dimentions';
import { AuthContext } from '../router/AuthProvider';

const ProfileScreen = ({navigation}) => {
  const [name, setName] = useState();
  const { update } = useContext(AuthContext);

    return (
      <View style={stylesg.container}>
        <Appbar.Header>
          <Appbar.Content title="Profile"/>
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
          <Text>Email</Text>
          <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
              <AntDesign name={'user'} size={25} color="#666" />
            </View>
            <Text style={styles.input}>{user.email}</Text>
          </View>
          
          <Text>Name</Text>
          <FormInput
            labelValue={user.displayName}
            onChangeText={(userName) => setName(userName)}
            placeholderText="Your name"
            iconType="user"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormButton
            buttonTitle="Update"
            onPress={() => {update(name)}}
          />
        </ScrollView>
      </View>
    );
};

export default ProfileScreen;
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