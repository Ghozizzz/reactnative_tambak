import React, {Component} from 'react';
import { Alert } from 'react-native';
import {StyleSheet, View, TouchableOpacity, Text, TextInput} from 'react-native';
import { Input } from 'react-native-elements';
import {db} from '../../config/firebase';

export default class MKolamForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      kode : '',
      nama : '',
      disabled : false,
    }
  }

  onSubmit = () => {
    if(this.state.kode == ''){
      alert('Silahkan Input Kode ...');
      return false;
    }else if(this.state.nama == ''){
      alert('Silahkan Input Nama ...');
      return false;
    }else{
      this.setState({
        disabled: true,
      });
      db.collection('MasterKolam')
        .add({
          kode: this.state.kode,
          name: this.state.nama
        })
        .then(() => {
          Alert.alert(
            'Data Kolam berhasil di Tambah'
          );
          this.setState({
            kode: '',
            nama: '',
            disabled: false,
          });
          this.props.navigation.navigate("Master Kolam")
        })
        .catch((error) => {
          this.setState({
            kode: '',
            nama: '',
            disabled: false,
          });
          console.error("Error adding document: ", error);
        });
    }
  }

  render() {
    return (
      <View style={styles.pages}>
        <Text>Kode Kolam</Text>
        <Input
          placeholder='Kode Kolam ...'
          onChangeText = {(text) => this.setState({kode:text})}
          value={this.state.kode}
        />

        <Text>Nama Kolam</Text>
        <Input
          placeholder='Nama Kolam ...'
          onChangeText = {(text) => this.setState({nama:text})}
          value={this.state.nama}
        />

        <TouchableOpacity style={styles.tombol} disabled={this.state.disabled} onPress={() => this.onSubmit()}>
          <Text style={styles.textTombol}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer:{
    borderLeftWidth: 4,
    borderRightWidth: 4,
    height: 30
  },
  pages: {
    flex: 1,
    padding: 30,
  },
  tombol: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  textTombol: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});