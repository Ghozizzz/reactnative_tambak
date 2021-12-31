import React from 'react';
import {View, Text, Pressable, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../../styles';

const StyledButton = (props) => {

  const type = props.type;
  const bgColor = type === 'primary' ? '#03A9F4' : 'white';
  const txtColor = type === 'primary' ? 'white' : 'black';
  const onPress = props.onPress;

  // const createTwoButtonAlert = () =>
  //   Alert.alert(
  //     "Alert Title",
  //     "My Alert Msg",
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel"
  //       },
  //       { text: "OK", onPress: () => console.log("OK Pressed") }
  //     ],
  //     { cancelable: false }
  //   );

  return (
    <View style={styles.button_container}>
      <TouchableOpacity style={[styles.button, {backgroundColor: bgColor}]} onPress={onPress}>
        <Text  style={[styles.button_text, { color: txtColor }]}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default StyledButton;