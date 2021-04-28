import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from '../../styles';

const MiddleMenu = (props) => {
  return (
    <View style={styles.MiddleMenuContainer}>
      <View style={styles.MiddleMenuIsi}>
        <Image source={require('../../assets/history.png')} style={styles.ImgIcon}/>
        <Text style={styles.MMText}>History</Text>
      </View>
      <View style={styles.MiddleMenuIsi}>
        <Image source={require('../../assets/stats.png')} style={styles.ImgIcon}/>
        <Text style={styles.MMText}>Stats</Text>
      </View>
    </View>
  );
}

export default MiddleMenu;