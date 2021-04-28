import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Title, Paragraph } from 'react-native-paper';
import styles from '../../styles';

const CardComponents = () => {
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Nama</Title>
            <Text>Rp 250.000</Text>
          </View>
          <Text>Tanggal : 2021-01-01</Text>
        </TouchableOpacity>
      </View>
    );
};

export default CardComponents;