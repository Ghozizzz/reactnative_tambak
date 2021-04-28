import React from 'react';
import {View, TextInput } from 'react-native';
import styles from '../../styles';

const StyledTextInput = (props) => {

  return (
    <View style={styles.textinput_container}>
      <TextInput style={styles.textinput_class} placeholder={props.placeholder}></TextInput>
    </View>
  )
}

export default StyledTextInput;