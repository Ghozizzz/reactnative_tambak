import React, {Component } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ListItem, Icon } from 'react-native-elements';
import StyledButton from '../../components/Styled/button';
import stylesg from '../../styles';
import {fr} from '../../config/firebase';

export default class MKolamScreen extends Component {
  state = {
    loading: true,
    kolamList: []
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
    this.unsubscribe = fr.collection('MasterKolam').orderBy('kode', 'asc').onSnapshot({ includeMetadataChanges: true }, this.onCollectionUpdate)
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
      loading: false
   })
  }

  render() {
    return this.state.kolamList.length > 0 ? 
      <View style={styles.container}>
        <ScrollView>
          {this.state.kolamList.map((item, index) => (
              <ListItem key={index} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>Nama : {item.name}</ListItem.Title>
                  <ListItem.Subtitle>Kode : {item.kode}</ListItem.Subtitle>
                </ListItem.Content>
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
              </ListItem>
            ))
          }
        </ScrollView>
        <View style={{height:50}}></View>
        <View style={stylesg.button_container_wrapper}>
          <StyledButton type="primary" text="Tambah Master Kolam" onPress={() => this.props.navigation.navigate("Master Kolam Form")}/>
        </View>
      </View>
      :
      <View style={stylesg.masterContainer}>
        <ScrollView style={{marginTop:10}}>
          <Text style={stylesg.emptyTitle}>No Kolam found</Text>
          <View style={{height:50}}></View>
        </ScrollView>
        <View style={stylesg.button_container_wrapper}>
          <StyledButton type="primary" text="Tambah Master Kolam" onPress={() => this.props.navigation.navigate("Master Kolam Form")}/>
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
});