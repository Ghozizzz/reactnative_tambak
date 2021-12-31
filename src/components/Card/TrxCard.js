import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Title } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import customcss from '../../styles';

const TrxCard = (props) => {

  const hari = props.hari;
  const jml_now = props.jml_now;
  const jml_mati = props.jml_mati;
  const jml_panen = props.jml_panen;
  const jml_tambah = props.jml_tambah;
    return (
      <View style={customcss.cardContainer}>
        <TouchableOpacity style={customcss.card}>
          <View style={customcss.cardHeader}>
            <Title style={customcss.cardTitle}>Hari ke - {hari}</Title>
            <Icon
              name="edit"
              size={15}
              color="black"
              reverse
              // onPress={() => this.props.navigation.navigate("Detail Transaksi", { id: item.id})}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
            <View style={styles.cardJumlah}>
              <Text style={{color: 'black'}}>Saat Ini</Text>
              <View style={styles.listJumlah}>
                <Text style={{color: 'white'}}>{jml_now}</Text>
              </View>
            </View>
            <View style={styles.cardJumlah}>
              <Text style={{color: 'black'}}>Ikan Mati</Text>
              <View style={styles.listJumlah}>
                <Text style={{color: 'white'}}>{jml_mati}</Text>
              </View>
            </View>
            <View style={styles.cardJumlah}>
              <Text style={{color: 'black'}}>Ikan Panen</Text>
              <View style={styles.listJumlah}>
                <Text style={{color: 'white'}}>{jml_panen}</Text>
              </View>
            </View>
            <View style={styles.cardJumlah}>
              <Text style={{color: 'black'}}>Ikan Tambah</Text>
              <View style={styles.listJumlah}>
                <Text style={{color: 'white'}}>{jml_tambah}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  cardJumlah: {
    flexDirection: 'column', 
    alignItems:'center'
  },
  listJumlah: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default TrxCard;