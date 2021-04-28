import React, {Component, useState} from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ListItem, Button, Icon } from 'react-native-elements';
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
    return this.state.ikanList.length > 0 ? 
      <View style={styles.container}>
        <ScrollView>
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
        <View style={{height:50}}></View>
        <View style={stylesg.button_container_wrapper}>
          <StyledButton type="primary" text="Tambah Master Ikan" onPress={() => this.props.navigation.navigate("Master Ikan Form")}/>
        </View>
      </View>
      :
      <View style={stylesg.masterContainer}>
        <ScrollView style={{marginTop:10}}>
          <Text style={stylesg.emptyTitle}>No Ikan found</Text>
          <View style={{height:50}}></View>
        </ScrollView>
        <View style={stylesg.button_container_wrapper}>
          <StyledButton type="primary" text="Tambah Master Ikan" onPress={() => this.props.navigation.navigate("Master Ikan Form")}/>
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