import React, {Component} from 'react';
import { Alert } from 'react-native';
import {StyleSheet, View, TouchableOpacity, Text, TextInput} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Spinner from 'react-native-loading-spinner-overlay';
import { Input } from 'react-native-elements';
import {db,firebase} from '../../config/firebase';
import customcss from '../../styles';

export default class MKolamForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      nama : '',
      disabled : false,
      loadingSpinner: false,
    }
  }

  onSubmit = () => {
    if(this.state.nama == ''){
      alert('Silahkan Input Nama ...');
      return false;
    }else{
      NetInfo.fetch().then(status => {
        if (status.isConnected==true) {
          this.setState({
            loadingSpinner: true,
            disabled: true,
          });
          
          var kode = '';
          //Get Numbering
          const numbering = db.collection("Numbering").doc('numbering_kolam');
          numbering.get().then((doc) => {
            const nomor = doc.data().nomor+1;
            kode = 'K'+nomor;

            const increment = firebase.firestore.FieldValue.increment(1);
            const kolam = db.collection('MasterKolam');
            const batch = db.batch();
            //Update Nomor
            batch.update(numbering, { 
              nomor: increment,
            });
            batch.set(kolam.doc(), {
              kode: kode,
              name: this.state.nama,
              status: 0
            });
            if(batch.commit()){
              Alert.alert(
                'Data Kolam berhasil di Tambah'
              );
              this.setState({
                nama: '',
                loadingSpinner: false,
                disabled: false,
              });
              this.props.navigation.navigate("Master Kolam")
            }else{
              Alert.alert(
                'Data Kolam gagal di tambah'
              );
              this.setState({
                nama: '',
                loadingSpinner: false,
                disabled: false,
              });
              console.error("Error adding document: ", error);
            }
          });
        }else{
          alert('Mohon nyalakan Koneksi Internet anda untuk menambah data ini')
        }
      });
    }
  }

  render() {
    return (
      <View style={styles.pages}>
        <Spinner
          visible={this.state.loadingSpinner}
          textContent={'Loading...'}
          textStyle={customcss.spinnerTextStyle}
        />
        <Text>Nama Kolam</Text>
        <Input style={styles.fontitem}
          placeholder='Nama Kolam ...'
          onChangeText = {(text) => this.setState({nama:text})}
          value={this.state.nama}
        />

        <TouchableOpacity style={customcss.tombol} disabled={this.state.disabled} onPress={() => this.onSubmit()}>
          <Text style={customcss.textTombol}>SUBMIT</Text>
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
  fontitem: {
    color: 'black'
  }
});