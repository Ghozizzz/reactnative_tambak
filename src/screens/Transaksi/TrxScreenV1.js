import React, {Component} from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ListItem, Icon } from 'react-native-elements';
import { Appbar } from 'react-native-paper';
import StyledButton from '../../components/Styled/button';
import stylesg from '../../styles';
import {fr} from '../../config/firebase';

export default class TrxScreen extends Component {
  state = {
    loading: true,
    trxList: []
  }

  componentDidMount() {
    this.unsubscribe = fr.collection('Transaksi').where('status','==',0).onSnapshot({ includeMetadataChanges: true }, this.onCollectionUpdate)
  }

  componentWillUnmount() {
    // we have to unsubscribe when component unmounts, because we don't need to check for updates
    this.unsubscribe()
  }

  onCollectionUpdate = (querySnapshot) => {
    // we have to update the state
    const trxList = []
    querySnapshot.forEach((document) => {
      const { ikan, kolam, kolam_name, kode_transaksi } = document.data()
  
      trxList.push({
        id: document.id,
        ikan,
        kolam,
        kolam_name,
        kode_transaksi
      })
    })
  
    this.setState({
      trxList,
      loading: false
    })
  }

  render() {
    
    let dataviewnya;
    if( this.state.trxList.length > 0){
      dataviewnya = <ScrollView>
      {this.state.trxList.map((item, index) => (
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
        <Text style={stylesg.emptyTitle}>No Data Transaksi found</Text>
        <View style={{height:50}}></View>
      </ScrollView>
    }
    return <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Data Transaksi"/>
          <Appbar.Action icon="dots-vertical" onPress={() => this.props.navigation.openDrawer()} />
        </Appbar.Header>
        { this.state.loading ? 
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View> : dataviewnya
        }
        <View style={{height:50}}></View>
        <View style={stylesg.button_container_wrapper}>
          <StyledButton type="primary" text="Tambah Transaksi" onPress={() => this.props.navigation.navigate("Add Transaksi")}/>
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