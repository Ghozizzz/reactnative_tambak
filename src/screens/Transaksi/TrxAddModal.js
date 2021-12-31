import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Button, TextInput, Alert } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import AntDesign from 'react-native-vector-icons/AntDesign'
import customcss from '../../styles';
import moment from "moment";
import { db,firebase,user } from '../../config/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class TrxAddModal extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      jml_now: this.props.jml_now,
      jml_mati: this.props.jml_mati,
      jml_panen: this.props.jml_panen,
      jml_tambah: this.props.jml_tambah,
      jml_rata: this.props.jml_rata,
      berat_r2: this.props.berat_r2,
      berat_mati: this.props.berat_mati,
      berat_pakan: this.props.berat_pakan,
      berat_now: 0,
      disabled : false,
      isSelected: this.props.tfSelected,
      nomor: this.props.nomor,
      show: false,
      showTgl: (this.props.jml_panen>0)?true:false,
      tgl: new Date(this.props.tgl)
    }
  }

  onSubmit = () => {
    const nilai_minus = Number(this.state.jml_mati) + Number(this.state.jml_panen);
    const nilai_tambah =  Number(this.state.jml_now) +  Number(this.state.jml_tambah);
    if(nilai_minus>nilai_tambah){
      alert('Nilai Perhitungan tidak dapat kurang dari 0');
      return false;
    }else{
      if(this.props.modalType==0){//INPUT
        const increment = firebase.firestore.FieldValue.increment(1);
        const hari_now = this.props.nomor;
        const transaksi = db.collection('Transaksi').doc(this.props.idnih);
        const transaksiDetails = transaksi.collection('details');
        const jumlah_now = Number(this.props.jml_now) + Number(this.state.jml_tambah) - Number(this.state.jml_mati) - Number(this.state.jml_panen);
        const berat_total = Number(this.state.berat_r2)*Number(jumlah_now);
        const batch = db.batch();
        var tgl = this.state.tgl;
        if(this.state.jml_panen==0){
          tgl = '';
        }
        batch.update(transaksi, { 
          countHari: increment,
          jumlah: Number(jumlah_now),
          berat: Number(berat_total.toFixed(2)),
          sync: 0,
        })
        batch.set(transaksiDetails.doc(), {
          hari: hari_now,
          jml_before: Number(this.props.jml_now),
          jml_now: Number(jumlah_now),
          berat_now: Number(berat_total.toFixed(2)),
          jml_mati: Number(this.state.jml_mati),
          jml_panen: Number(this.state.jml_panen),
          jml_tambah: Number(this.state.jml_tambah),
          berat_r2: Number(this.state.berat_r2),
          berat_mati: Number(this.state.berat_mati),
          berat_pakan: Number(this.state.berat_pakan),
          tgl: tgl,
          tfSelected: this.state.isSelected,
          sync: 0,
          created_by: user.email,
          created_at: new Date()
        })
        // console.log('input')
        if(batch.commit()){
          Alert.alert(
            'Data Transaksi berhasil di Simpan'
          );
        
          this.setState({
            berat: 0,
            jml_mati: 0,
            jml_panen: 0,
            jml_tambah: 0,
            jml_rata: 0,
            isSelected : false,
            disabled : false,
          });
          this.props.closeModal();
          this.props.updateHari();
        }else{
          Alert.alert(
            'Data Transaksi gagal di Simpan'
          );
        }
      }else{//UPDATE
        const transaksi = db.collection('Transaksi').doc(this.props.idnih);
        const transaksiDetails = transaksi.collection('details').doc(this.props.id_edit);
        const jumlah_now = Number(this.props.jml_now) + Number(this.state.jml_tambah) - Number(this.state.jml_mati) - Number(this.state.jml_panen);
        const berat_total = Number(this.state.berat_r2)*Number(jumlah_now);
        const batch = db.batch();
        var tgl = this.state.tgl;
        if(this.state.jml_panen==0){
          tgl = '';
        }
        batch.update(transaksi, {
          jumlah: Number(jumlah_now),
          berat: Number(berat_total.toFixed(2)),
          sync: 0,
        })
        batch.update(transaksiDetails, {
          jml_before: Number(this.props.jml_now),
          jml_now: Number(jumlah_now),
          berat_now: Number(berat_total.toFixed(2)),
          jml_mati: Number(this.state.jml_mati),
          jml_panen: Number(this.state.jml_panen),
          jml_tambah: Number(this.state.jml_tambah),
          tgl: tgl,
          tfSelected: this.state.isSelected,
          sync: 0,
          berat_r2: Number(this.state.berat_r2),
          berat_mati: Number(this.state.berat_mati),
          berat_pakan: Number(this.state.berat_pakan),
          created_at: new Date()
        })
        // console.log('update')
        if(batch.commit()){
          Alert.alert(
            'Data Transaksi berhasil di Simpan'
          );
        
          this.setState({
            berat: 0,
            jml_mati: 0,
            jml_panen: 0,
            jml_tambah: 0,
            jml_rata: 0,
            isSelected : false,
            disabled : false,
          });
          this.props.closeModal();
          this.props.updateHari();
        }else{
          Alert.alert(
            'Data Transaksi gagal di Simpan'
          );
        }
      }
    }
  }

  setToggleCheckBox = (val) => {
    this.setState({
      isSelected: val,
    })
  }
  
  gantiTgl = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.tgl;
    this.setState({
      tgl: currentDate,
      show: false,
    })
  }

  showMode = () => {
    this.setState({
      show: true
    })
  };

  modeTgl = (val) => {
    if(val==0 || val==''){
      this.setState({
        jml_panen: val,
        showTgl: false
      })
    }else{
      this.setState({
        jml_panen: val,
        showTgl: true
      })
    }
  }

  // componentDidMount(){
  //   console.log(this.state.tgl)
  // }

  render() {
    return (
      <View style={styles.container} behavior="padding">
        <TouchableOpacity style={styles.touch} onPress={this.props.closeModal}>
          <AntDesign name="close" size={24} color={'#900'}/>
        </TouchableOpacity>
        <View style={styles.view}>
          <Text style={customcss.headerText}>{this.props.modalType==0? 'Input':'Edit'} ke - {this.state.nomor}</Text>
          <Text>Jumlah Saat Ini</Text>
          <TextInput style={styles.inputReadonly} value={''+this.props.jml_now} editable={false}/>
        </View>

        <View style={styles.view}>
          <Text>Jumlah Ikan Mati</Text>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText = {(val) => this.setState({jml_mati:val})} value={''+this.state.jml_mati}/>
        </View>
        
        <View style={styles.view}>
          <Text>Jumlah Ikan Panen</Text>
          <View style={styles.checkboxContainer}>
            <TextInput style={[styles.input, {flex: 2}]} keyboardType='numeric' value={''+this.state.jml_panen}
              // onChangeText = {(val) => this.setState({jml_panen:val})}
              onChangeText={(val) => this.modeTgl(val)}
            />
            <CheckBox
              tintColors={{ true: 'blue', false: 'green' }}
              value={this.state.isSelected}
              onValueChange={(newValue) => this.setToggleCheckBox(newValue)}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Transfer</Text>
          </View>
        </View>

        {this.state.showTgl ? ( 
          <View style={styles.view}>
            <View style={{ flexDirection:'row', zIndex:0, justifyContent:'space-between' }}>
              <TextInput style={styles.text} value={moment(this.state.tgl).format('YYYY-MM-DD')} />
              <Button onPress={this.showMode} title="Pilih Tgl Panen" />
            </View>
            {this.state.show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={this.state.tgl}
                mode='date'
                is24Hour={true}
                display="default"
                onChange={this.gantiTgl}
              />
            )}
          </View>
          ) : null}
        <View style={styles.view}>
          <Text>Jumlah Ikan Tambah</Text>
          <TextInput style={styles.input} keyboardType='numeric' onChangeText = {(val) => this.setState({jml_tambah:val})} value={''+this.state.jml_tambah}/>
        </View>

        <View style={styles.view}>
          <Text>Berat Rata2 (Kg)</Text>
          <TextInput style={styles.input} keyboardType='numeric' value={''+this.state.berat_r2} onChangeText = {(val) => this.setState({berat_r2:val})}/>
        </View>
        <View style={styles.view}>
          <Text>Berat Ikan Mati (Kg)</Text>
          <TextInput style={styles.input} keyboardType='numeric' value={''+this.state.berat_mati} onChangeText = {(val) => this.setState({berat_mati:val})}/>
        </View>
        <View style={styles.view}>
          <Text>Berat Pakan (Kg)</Text>
          <TextInput style={styles.input} keyboardType='numeric' value={''+this.state.berat_pakan} onChangeText = {(val) => this.setState({berat_pakan:val})}/>
        </View>

        <TouchableOpacity style={customcss.tombol} disabled={this.state.disabled} onPress={() => this.onSubmit()}>
          <Text style={customcss.textTombol}>SIMPAN</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  touch: {
    position: 'absolute',
    top: 25,
    right: 32
  },
  titles: {
    fontSize: 28,
    fontWeight: "800",
    color: 'black',
    alignSelf: 'center',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    color: 'black',
  },
  inputReadonly: {
    backgroundColor: 'grey',
    color: 'white'
  },
  view:{ 
    alignSelf: "stretch", 
    marginHorizontal:32
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
})
