import React, {Component} from 'react';
import { Alert } from 'react-native';
import {StyleSheet, View, TouchableOpacity, Text, TextInput} from 'react-native';
import { Input } from 'react-native-elements';
import {db} from '../../config/firebase';

export default class MikanForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       nama : '',
    }
  }
  state = {
    disabled: false
  }

  onSubmit = () => {
    if(this.state.nama == ''){
      alert('Silahkan Input Nama ...');
      return false;
    }else{
      this.setState({
        disabled: true,
      });
      db.collection('MasterIkan')
        .add({
          name: this.state.nama
        })
        .then(() => {
          Alert.alert(
            'Data Ikan berhasil di Tambah'
          );
          this.state.nama = '';
          this.setState({
            disabled: false,
          });
          this.props.navigation.navigate("Master Ikan")
        })
        .catch((error) => {
          this.setState({
            disabled: false,
          });
          console.error("Error adding document: ", error);
        });
    }
  }

  render() {
    return (
      <View style={styles.pages}>
        {/* 
        <TextInput placeholder="Jenis Ikan ..." style={styles.inputText}
          onChangeText = {(text) => this.setState({nama:text})}
          value={this.state.nama}
          namaState="nama"
        ></TextInput>
         */}
        <Text>Jenis Ikan</Text>
        <Input
          placeholder='Jenis Ikan ...'
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