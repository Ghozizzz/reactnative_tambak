import React from 'react';
import { View, ImageBackground, Text} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CardComponents from '../components/Card';
import styles from '../styles';
import { Icon } from 'react-native-elements';

const HomeScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <View style={styles.landingBg}></View>
        <View style={styles.headerContainer}>
          <Text style={{color:'#fff'}}>Home</Text>
          <View>
            <Icon
              name = "menu"
              color = "#fff"
              onPress = {() => navigation.openDrawer()}
            />
          </View>
        </View>

        {/* <View style={styles.titlesContainer}>
          <Text style={styles.sub_title}>Total Hutang</Text>
          <Text style={styles.title}>Rp 500.000</Text>
        </View> */}
        {/* <MiddleMenu/> */}
        <ScrollView style={{marginTop:10}}>
          <CardComponents/>
          <CardComponents/>
          <CardComponents/>
          <CardComponents/>
          <CardComponents/>
          <CardComponents/>
          <CardComponents/>
          <CardComponents/>
        </ScrollView>
      </View>
    );
};

export default HomeScreen;