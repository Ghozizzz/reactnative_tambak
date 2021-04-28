import React, {Component} from 'react';
import { Alert } from 'react-native';
import {StyleSheet, View, TouchableOpacity, Text, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import stylesg from '../../styles';
import {fr} from '../../config/firebase';

export default class TrxAdd extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      kolamList: [],
      selectedKolam : '',
      nama: '',
      disabled: false
    }
  }
  

  onSubmit = () => {
    if(this.state.nama == ''){
      alert('Silahkan Input Nama ...');
      return false;
    }else{
      this.setState({
        disabled: true,
      });
      fr.collection('MasterIkan')
        .add({
          name: this.state.nama
        })
        .then(() => {
          Alert.alert(
            'Data Ikan berhasil di Tambah'
          );
          this.setState({
            nama: '',
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

  get_selected_kolam = (itemValue) => {
    console.log(itemValue);
    // this.setState({
    //   selectedKolam: itemValue
    // });
  }
  
  async get_kolam_list(){
    return fr.collection('MasterKolam').orderBy('kode','asc').get().then((querySnapshot) => {
        const kolamList = [];
        querySnapshot.forEach((doc) => {
          const { name, kode } = doc.data()
      
          kolamList.push({
            name,
            kode
          })
        });
        this.setState({ 
          kolamList
        })
      })
      .catch((error) => {
        console.error("Error get document: ", error);
      }); 
  }

  async componentDidMount(){
    await this.get_kolam_list()
  }

  render() {
    let kolamItems = this.state.kolamList.map( (s, i) => {
      return <Picker.Item key={i} value={s.kode} label={s.name} />
    });

    return (
      <View style={styles.pages}>
        <Text>Jenis Ikan</Text>
        <TextInput placeholder="Jenis Ikan ..." style={stylesg.inputText}
          onChangeText = {(text) => this.setState({nama:text})}
          value={this.state.nama}
          namaState="nama"
        ></TextInput>

        <Text>Pilih Kolam</Text>
        <Picker
          selectedValue={''}
          style={stylesg.picker}
          onValueChange={(value) => this.get_selected_kolam(value)}
        >
          <Picker.Item label="Please Select ..." value="" />
          {kolamItems}
        </Picker>

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