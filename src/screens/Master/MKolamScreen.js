import React, {Component } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ListItem, Icon } from 'react-native-elements';
import { Appbar, Searchbar  } from 'react-native-paper';
import StyledButton from '../../components/Styled/button';
import stylesg from '../../styles';
import {fr} from '../../config/firebase';

export default class MKolamScreen extends Component {
  state = {
    loading: true,
    kolamList: [],
    numbering: 0,
    search: [],
  }

  deletePressed = (id) => {
    console.log(id);
    Alert.alert(
      "Hapus data Kolam",
      "Anda yakin ingin menghapus data ini ?",
      [
        {
          text: "Tidak",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Ya", onPress: () => this.deleteKolam(id) }
      ]
    );
  }

  deleteKolam = (id) => {
    fr.collection('MasterKolam')
      .doc(id).delete()
      .then(() => {
        alert('Data berhasil dihapus')
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.unsubscribe = fr.collection('MasterKolam').orderBy('name', 'asc').onSnapshot({ includeMetadataChanges: true }, this.onCollectionUpdate)
  }

  componentWillUnmount() {
    // we have to unsubscribe when component unmounts, because we don't need to check for updates
    this.unsubscribe()
  }

  onCollectionUpdate = (querySnapshot) => {
    // we have to update the state
    const kolamList = []
    querySnapshot.forEach((document) => {
      const { name, kode } = document.data()
  
      kolamList.push({
        id: document.id,
        document,
        name,
        kode
      })
    })
  
    this.setState({ 
      kolamList,
      searchList: kolamList,
      loading: false
   })
  }

  searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the this.state.kolamList
      // Update FilteredDataSource
      const searchList = this.state.kolamList.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      
      this.setState({
        searchList,
        search: text
      });
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with this.state.kolamList
      
      this.setState({
        searchList: this.state.kolamList,
        search: text
      });
    }
  };

  render() {
    let dataviewnya;
    if( this.state.kolamList.length > 0){
      dataviewnya = <ScrollView>
      {this.state.searchList.map((item, index) => (
          <ListItem key={index} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>Nama : {item.name}</ListItem.Title>
              <ListItem.Subtitle>Kode : {item.kode}</ListItem.Subtitle>
            </ListItem.Content>
            <TouchableOpacity>
              <Icon
                name="delete"
                size={15}
                color="black"
                reverse
                onPress={() => {
                  this.setState(prevState => ({ selectedIndex: prevState.selectedIndex = index }))
                  this.deletePressed(item.id)
                }}
              />
            </TouchableOpacity>
          </ListItem>
        ))
      }
      </ScrollView>
    }else{
      dataviewnya = <ScrollView style={{marginTop:10}}>
        <Text style={stylesg.emptyTitle}>No Kolam found</Text>
        <View style={{height:50}}></View>
      </ScrollView>
    }
    return <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Data Kolam"/>
          <Appbar.Action icon="dots-vertical" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar.Header>
        <Searchbar
          placeholder="Cari Kolam ..."
          onChangeText={(text) => this.searchFilterFunction(text)}
          onClear={(text) => this.searchFilterFunction('')}
          value={this.state.searchtext}
          // onSubmitEditing={(val) => this.searchKolam(val)}
        />
        { this.state.loading ? 
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View> : dataviewnya
        }
        <View style={{height:50}}></View>
        <View style={stylesg.button_container_wrapper}>
          <StyledButton type="primary" text="Tambah Master Kolam" onPress={() => {
            if(this.state.loading==false){
              this.props.navigation.navigate("Master Kolam Form")
            }else{
              alert('Harap tunggu loading selesai');
            }
          }}/>
        </View>
      </View>
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  listItem: {
    marginTop: 8,
    marginBottom: 8
  },
  titleStyle: {
    fontSize: 30,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});