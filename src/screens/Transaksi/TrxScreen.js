import React, {Component} from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ListItem, Icon, Button } from 'react-native-elements';
import { Appbar, Searchbar } from 'react-native-paper';
import StyledButton from '../../components/Styled/button';
import customcss from '../../styles';
import {Picker} from '@react-native-picker/picker';
import {fr} from '../../config/firebase';

export default class TrxScreen extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      loading: false,
      trxList: [],
      selectedIkan: '',
      ikanList: [],
      searchList: [],
      searchText: '',
      showPicker: false,
      emptyText: 'Silahkan filter data ikan terlebih dahulu'
    }
  }

  componentDidMount() {
    // this.unsubscribe = fr.collection('Transaksi').where('status','==',0).onSnapshot({ includeMetadataChanges: true }, this.onCollectionUpdate)
    this.get_ikan_list()
  }

  get_ikan_list = () => {
    fr.collection('MasterIkan').orderBy('name','asc').get().then((querySnapshot) => {
      const ikanList = [];
      querySnapshot.forEach((doc) => {
        const { name, kode } = doc.data()
    
        ikanList.push({
          name
        })
      });
      this.setState({ikanList})
    })
    .catch((error) => {
      console.error("Error get document: ", error);
    }); 
  }

  filterChange = (value) => {
    this.setState({
      selectedIkan: value
    });
  }

  filterByIkan = () => {
    if(this.state.selectedIkan!=''){
      this.loadTrx();
      this.setState({
        showPicker: !this.state.showPicker,
        searchtext: '',
      });
    }else{
      alert('Harap Pilih ikan terlebih dahulu');
    }
  }

  loadTrx = () => {
    this.setState({
      loading: true
    });
    // we have to update the state
    fr.collection('Transaksi').where('status','==',0).where('ikan','==',this.state.selectedIkan).get().then((querySnapshot) => {
      const trxList = [];
      querySnapshot.forEach((doc) => {
        const { ikan, kolam, kolam_name, kode_transaksi } = doc.data()
    
        trxList.push({
          id: doc.id,
          ikan,
          kolam,
          kolam_name,
          kode_transaksi
        })
      });
      this.setState({
        trxList,
        searchList: trxList,
        emptyText: 'Tidak ada data',
        loading: false})
    })
    .catch((error) => {
      console.error("Error get document: ", error);
    });
  }

  togglePicker = () => {
    this.setState({
      showPicker: !this.state.showPicker
    });
  }

  searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the this.state.trxList
      // Update FilteredDataSource
      const searchList = this.state.trxList.filter(function (item) {
        const itemData = item.kolam_name
          ? item.kolam_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      
      this.setState({
        searchList,
        searchText: text
      });
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with this.state.trxList
      
      this.setState({
        searchList: this.state.trxList,
        searchText: text
      });
    }
  };

  render() {
    
    let dataviewnya;
    if( this.state.trxList.length > 0){
      dataviewnya = <ScrollView>
        <Searchbar
          placeholder="Cari Kolam ..."
          onChangeText={(text) => this.searchFilterFunction(text)}
          onClear={(text) => this.searchFilterFunction('')}
          value={this.state.search}
          // onSubmitEditing={(val) => this.searchKolam(val)}
        />
      {this.state.searchList.map((item, index) => (
          <ListItem key={index} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Kode : {item.kode_transaksi}</ListItem.Title>
              <ListItem.Subtitle>Kolam : {item.kolam} ({item.kolam_name})</ListItem.Subtitle>
              <ListItem.Subtitle>Ikan : {item.ikan}</ListItem.Subtitle>
            </ListItem.Content>
            <TouchableOpacity>
            <Icon
              name="edit"
              size={15}
              color="black"
              reverse
              // onPress={() => {
              //   this.setState(prevState => ({ selectedIndex: prevState.selectedIndex = index }))
              //   this.deletePressed(item.id)
              // }}
              onPress={() => this.props.navigation.navigate("Detail Transaksi", { id: item.id})}
            /></TouchableOpacity>
          </ListItem>
        ))
      }
      </ScrollView>
    }else{
      dataviewnya = <ScrollView style={{marginTop:10}}>
        <Text style={customcss.emptyTitle}>{this.state.emptyText}</Text>
        <View style={{height:50}}></View>
      </ScrollView>
    }

    let renderPicker;
    if (this.state.showPicker) {
      renderPicker = <View>
        <Picker
          selectedValue={this.state.selectedIkan}
          style={customcss.picker}
          onValueChange={(value) => this.filterChange(value)}
        >
          <Picker.Item label="Pilih Ikan ..." value="" />
          {this.state.ikanList.map( (s, i) => {
            return (<Picker.Item key={i} value={s.name} label={s.name} />)
          })}
        </Picker>
        <Button title="Search Filter" onPress={() => this.filterByIkan()}/>
      </View>
    } else {
      renderPicker = null
    }

    return <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Data Transaksi"/>
          <Appbar.Action icon="dots-vertical" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar.Header>
        <View style={styles.search_header}>
          <Button title="Filter Data"  type="outline" onPress={() => this.togglePicker()}/>
          {renderPicker} 
        </View>
        { this.state.loading ? 
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View> : dataviewnya
        }
        <View style={{height:50}}></View>
        <View style={customcss.button_container_wrapper}>
          <StyledButton type="primary" text="Tambah Transaksi" onPress={() => this.props.navigation.navigate("Add Transaksi")}/>
        </View>
      </View>
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    marginTop: 8,
    marginBottom: 8
  },
  titleStyle: {
    fontSize: 30,
  },
  search_header: {
    padding: 5,
    borderBottomColor: '#03A9F4',
    borderBottomWidth: 1,
  }
});