import React, {Component} from 'react';
import { Alert } from 'react-native';
import {StyleSheet, View, TouchableOpacity, Text, TextInput} from 'react-native';
import { Input } from 'react-native-elements';
import NetInfo from "@react-native-community/netinfo";
import Spinner from 'react-native-loading-spinner-overlay';
import {db} from '../../config/firebase';
import customcss from '../../styles';

export default class MikanForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       nama : '',
       loadingSpinner: false,
    }
  }
  state = {
    disabled: false,
  }

  onSubmit = () => {
    if(this.state.nama == ''){
      alert('Silahkan Input Nama ...');
      return false;
    }else{
      this.setState({
        disabled: true,
        loadingSpinner: true,
      });
      
      NetInfo.fetch().then(status => {
        if (status.isConnected==true) {
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
                loadingSpinner: false,
              });
              this.props.navigation.navigate("Master Ikan")
            })
            .catch((error) => {
              this.setState({
                disabled: false,
                loadingSpinner: false,
              });
              console.error("Error adding document: ", error);
            });
        }else{
          db.collection('MasterIkan')
          .add({
            name: this.state.nama
          })
          Alert.alert(
            'Data Ikan berhasil di Tambah'
          );
          this.state.nama = '';
          this.setState({
            disabled: false,
          });
          this.props.navigation.navigate("Master Ikan")
        }
      })
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
        <Spinner
          visible={this.state.loadingSpinner}
          textContent={'Loading...'}
          textStyle={customcss.spinnerTextStyle}
        />
        <Text>Jenis Ikan</Text>
        <Input style={styles.fontitem}
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
  fontitem: {
    color: 'black'
  }
});