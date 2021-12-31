import React, {Component, useState} from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ListItem, Button, Icon } from 'react-native-elements';
import { Appbar  } from 'react-native-paper';
import StyledButton from '../../components/Styled/button';
import stylesg from '../../styles';
import {getIkan, deleteIkan} from '../../api/IkanApi';
import { Alert } from 'react-native';
import {fr} from '../../config/firebase';

export default class MikanScreen extends Component {
  state = {
    loading: true,
    ikanList: []
  }

  deletePressed = (id) => {
    console.log(id);
    Alert.alert(
      "Hapus data Ikan",
      "Anda yakin ingin menghapus data ini ?",
      [
        {
          text: "Tidak",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Ya", onPress: () => deleteIkan(id) }
      ]
    );
  }

  componentDidMount() {
    this.unsubscribe = fr.collection('MasterIkan').onSnapshot({ includeMetadataChanges: true }, this.onCollectionUpdate)
  }

  componentWillUnmount() {
    // we have to unsubscribe when component unmounts, because we don't need to check for updates
    this.unsubscribe()
  }

  onCollectionUpdate = (querySnapshot) => {
    // we have to update the state
    const ikanList = []
    querySnapshot.forEach((document) => {
      const { name } = document.data()
  
      ikanList.push({
        id: document.id,
        document,
        name
      })
    })
  
    this.setState({ 
      ikanList,
      loading: false
   })
  }

  render() {
    let dataviewnya;
    if( this.state.ikanList.length > 0){
      dataviewnya = <ScrollView>
      {this.state.ikanList.map((item, index) => (
          <ListItem key={index} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
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
    }else{
      dataviewnya = <ScrollView style={{marginTop:10}}>
        <Text style={stylesg.emptyTitle}>No Ikan found</Text>
        <View style={{height:50}}></View>
      </ScrollView>
    }
    return <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Data Ikan"/>
          <Appbar.Action icon="dots-vertical" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar.Header>
        { this.state.loading ? 
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>: dataviewnya
        }
        <View style={{height:50}}></View>
        <View style={stylesg.button_container_wrapper}>
          <StyledButton type="primary" text="Tambah Master Ikan" onPress={() => 
            {if(this.state.loading==false){
              this.props.navigation.navigate("Master Ikan Form")
            }else{
              alert('Harap tunggu loading selesai');
            }}}/>
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