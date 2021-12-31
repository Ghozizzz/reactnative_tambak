import React, {useState,useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Button, Alert, TextInput } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
// import { Searchbar } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import customcss from '../../styles';
import {db, fr, user} from '../../config/firebase';
import moment from "moment";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const TrxAdd = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [kolam, setKolam] = useState([]);
  const [sikan, setSikan] = useState('');
  const [ikan, setIkan] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [tgl, setTgl] = useState(new Date());
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const onSubmit = () => {
    if(value == ''){
      alert('Silahkan Pilih Kolam ...');
      return false;
    }else if(sikan == ''){
      alert('Silahkan Pilih Ikan ...');
      return false;
    }else{
      setLoadingSpinner(true);
      const kode_transaksi = moment(tgl).format("YYMMDDhhmmss");
      
      const transaksi = db.collection('Transaksi');
      const batch = db.batch();
      db.collection('MasterKolam').where("kode", "==", value).get()
      .then(querySnapshot => {

        const kolam_doc = db.collection('MasterKolam').doc(querySnapshot.docs[0].id)
        
        batch.update(kolam_doc, {
          status: 1
        });
        batch.set(transaksi.doc(), {
          kode_transaksi: kode_transaksi,
          kolam: value,
          kolam_name: querySnapshot.docs[0].data().name,
          ikan: sikan,
          tanggal: tgl,
          status: 0,
          sync: 0,
          countHari: 0,
          jumlah: 0,
          berat: 0,
          created_by: user.email,
          created_at: new Date()
        })
        
        if(batch.commit()){
          Alert.alert(
            'Data Transaksi berhasil di Tambah'
          );
          setLoadingSpinner(false);
          setDisabled(false);
          navigation.navigate('Data Transaksi')
        }else{
          Alert.alert(
            'Data Transaksi gagal di Tambah'
          );
        }
      })
    }
  }

  const get_selected_kolam = (itemValue) => {
    setKolam(itemValue)
  }

  const get_selected_ikan = (itemValue) => {
    setIkan(itemValue)
  }

  const gantiTgl = (event, selectedDate) => {
    const currentDate = selectedDate || tgl;
    setTgl(currentDate);
    setShow(false)
  }

  const showMode = () => {
    setShow(true)
  };
  
  useEffect(()=>{
    get_kolam_list()
    get_ikan_list()
  }, []);

  const get_kolam_list = async () => {
    return fr.collection('MasterKolam').where('status','==',0).orderBy('name','asc').get().then((querySnapshot) => {
        const kolamList = [];
        querySnapshot.forEach((doc) => {
          const { name, kode } = doc.data()
      
          kolamList.push({
            label: name,
            value: kode
          })
        });
        setKolam(kolamList)
        // console.log(kolam);
      })
      .catch((error) => {
        console.error("Error get document: ", error);
      }); 
  }
    
  const get_ikan_list = async () => {
    return fr.collection('MasterIkan').orderBy('name','asc').get().then((querySnapshot) => {
        const ikanList = [];
        querySnapshot.forEach((doc) => {
          const { name, kode } = doc.data()
      
          ikanList.push({
            name
          })
        });
        setIkan(ikanList)
        // console.log(ikan);
      })
      .catch((error) => {
        console.error("Error get document: ", error);
      }); 
  }

    // let kolamItems = this.state.kolamList.map( (s, i) => {
    //   return <Picker.Item key={i} value={s.kode} label={s.name} />
    // });
    
    const ikanItems = () => {
      return ikan.map( (s, i) => {
        return <Picker.Item key={i} value={s.name} label={s.name} />
      });
    }
    
  // const renderIkantList = () => {
  //   return ikan.map((product) => {
  //     return <Picker.item label={product.name} value={product} />
  //   })
  // }

    return (
      <View style={styles.pages}>
        <Spinner
          visible={loadingSpinner}
          textContent={'Loading...'}
          textStyle={customcss.spinnerTextStyle}
        />
        <Text style={styles.text}>Pilih Kolam</Text>
        <DropDownPicker
          searchable={true}
          open={open}
          value={value}
          items={kolam}
          setValue={setValue}
          setItems={setKolam}
          setOpen={setOpen}
        />
        
        <Text style={styles.text}>Pilih Ikan</Text>
        <Picker
          selectedValue={''}
          searchable={true}
          style={customcss.picker}
          onValueChange={(value) => setSikan(value)}
        >
          <Picker.Item label="Pilih Ikan ..." value="" />
          {ikanItems()}
        </Picker>

        <Text style={styles.text}>Tanggal</Text>
        <View style={{ flexDirection:'row', zIndex:0, justifyContent:'space-between' }}>
          <TextInput style={styles.text} value={moment(tgl).format('YYYY-MM-DD')} />
          <Button onPress={showMode} title="Pilih Tgl" />
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={tgl}
            mode='date'
            is24Hour={true}
            display="default"
            onChange={gantiTgl}
          />
        )}

        <TouchableOpacity style={styles.tombol} disabled={disabled} onPress={() => onSubmit()}>
          <Text style={styles.textTombol}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    );
}

export default TrxAdd;
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
    marginTop: 5,
    color: 'black',
  },
  textTombol: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});