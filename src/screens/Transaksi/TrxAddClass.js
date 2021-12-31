import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Button, Alert, TextInput } from 'react-native';
import { Searchbar } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import stylesg from '../../styles';
// import SearchableDropdown from 'react-native-searchable-dropdown';
import {db, fr, user} from '../../config/firebase';
import moment from "moment";
// import DatePicker from 'react-native-date-picker'
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class TrxAdd extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      kolamList: [],
      ikanList: [],
      selectedKolam : '',
      selectedIkan : '',
      nama: '',
      disabled: false,
      show: false,
      selectedTgl: new Date(),
      open: false,
      // test: moment(new Date()).format("YYMMDDhhii")
    }
  }

  onSubmit = () => {
    if(this.state.selectedKolam == ''){
      alert('Silahkan Pilih Kolam ...');
      return false;
    }else if(this.state.selectedIkan == ''){
      alert('Silahkan Pilih Ikan ...');
      return false;
    }else{
      // this.setState({
      //   disabled: true,
      // });
      const kode_transaksi = moment(this.state.selectedTgl).format("YYMMDDhhmmss");
      db.collection('Transaksi')
        .add({
          kode_transaksi: kode_transaksi,
          kolam: this.state.selectedKolam,
          ikan: this.state.selectedIkan,
          tanggal: this.state.selectedTgl,
          status: 0,
          countHari: 0,
          jumlah: 0,
          berat: 0,
          created_by: user.email,
          created_at: new Date()
        })
        .then(() => {
          Alert.alert(
            'Data Transaksi berhasil di Tambah'
          );
          this.setState({
            nama: '',
            disabled: false,
          });
          this.props.navigation.navigate('Data Transaksi')
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
    // console.log(itemValue);
    this.setState({
      selectedKolam: itemValue
    });
  }

  get_selected_ikan = (itemValue) => {
    // console.log(itemValue);
    this.setState({
      selectedIkan: itemValue
    });
  }

  gantiTgl = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.selectedTgl;
    // console.log('ni tanggal :'+moment(currentDate).format('YYYY-MM-DD'))
    this.setState({
      selectedTgl: selectedDate,
      show: false,
    })
  }

  showMode = () => {
    this.setState({
      show: true
    });
  };
  
  async get_kolam_list(){
    return fr.collection('MasterKolam').orderBy('kode','asc').get().then((querySnapshot) => {
        const kolamList = [];
        querySnapshot.forEach((doc) => {
          const { name, kode } = doc.data()
      
          kolamList.push({
            id: doc.id,
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
    
  async get_ikan_list(){
    return fr.collection('MasterIkan').orderBy('name','asc').get().then((querySnapshot) => {
        const ikanList = [];
        querySnapshot.forEach((doc) => {
          const { name, kode } = doc.data()
      
          ikanList.push({
            name
          })
        });
        this.setState({ 
          ikanList
        })
      })
      .catch((error) => {
        console.error("Error get document: ", error);
      }); 
  }

  async componentDidMount(){
    // console.log(new Date()+' vs '+moment().format('DD-MM-YYYY'));
    await this.get_kolam_list()
    await this.get_ikan_list()
  }

  render() {
    // let kolamItems = this.state.kolamList.map( (s, i) => {
    //   return <Picker.Item key={i} value={s.kode} label={s.name} />
    // });
    
    let ikanItems = this.state.ikanList.map( (s, i) => {
      return <Picker.Item key={i} value={s.name} label={s.name} />
    });

    return (
      <View style={styles.pages}>
        <Text style={styles.text}>Pilih Kolam</Text>
        <DropDownPicker
          schema={{
            label: 'name',
            value: 'kode'
          }}
          searchable={true}
          open={this.state.open}
          value={this.state.selectedKolam}
          items={this.state.kolamList}
          // setValue={this.props.value}
          // setValue={(item) => {
          //   console.log(item.label);
          //   this.setState({
          //     selectedKolam: item,
          //   });
          // }}
          setOpen={() =>
            this.setState({
              open:true
            })
          }
          onClose={() =>
            this.setState({
              open:false
            })
          }
        />
        
        <Text style={styles.text}>Pilih Ikan</Text>
        <Picker
          selectedValue={''}
          searchable={true}
          style={stylesg.picker}
          onValueChange={(value) => this.get_selected_ikan(value)}
        >
          <Picker.Item label="Please Select ..." value="" />
          {ikanItems}
        </Picker>

        <Text style={styles.text}>Tanggal</Text>
        <View style={{ flexDirection:'row', zIndex:0, justifyContent:'space-between' }}>
          <TextInput value={moment(this.state.selectedTgl).format('YYYY-MM-DD')} />
          <Button onPress={this.showMode} title="Pilih Tgl" />
        </View>
        {this.state.show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.selectedTgl}
            mode='date'
            is24Hour={true}
            display="default"
            onChange={this.gantiTgl}
          />
        )}

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
    paddingHorizontal: 15,
    padding: 20
  },
  tombol: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    marginTop: 5
  },
  textTombol: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});