import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from '../../styles';

const Header = (props) => {
  const type = props.type;
  const txtColor = type === 'primary' ? '#1A237E' : 'white';

  return (
    <View style={styles.headerContainer}>
      <Text style={{color:txtColor}}>{props.text}</Text>
    </View>
  );
}

export default Header;