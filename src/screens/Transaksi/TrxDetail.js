import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView
} from 'react-native';
import StyledButton from '../../components/Styled/button';
import NetInfo from "@react-native-community/netinfo";
import customcss from '../../styles';
import {fr,db} from '../../config/firebase';
import TrxAddModal from './TrxAddModal';
import BottomSheet from 'reanimated-bottom-sheet';
import { Icon } from 'react-native-elements';
import { DataTable, Button } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';

export default class TrxDetail extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      trxHeader: '',
      trxDetail: [],
      id:'',
      id_edit:'',
      hari: 0,
      addModalVisible: false,
      lastDoc: 0,
      last_br2: 0,
      isLoading: true,
      tfSelected: false,
      jml_now: 0,
      jml_mati: 0,
      jml_panen: 0,
      jml_transfer: 0,
      jml_tambah: 0,
      jml_rata: 0,
      berat_mati: 0,
      berat_pakan: 0,
      tgl: new Date(),
      selectedId: 0,
      selectedHari: 0,
      hariModal: 0,
      modalType: 0,//0 = insert, 1 = edit
    }
  }

  toggleAddModal(){
    const hariModal = this.state.trxHeader.countHari+1;
    this.setState({
      modalType: 0,
      jml_now:this.state.trxHeader.jumlah,
      jml_mati:0,
      jml_panen:0,
      jml_tambah:0,
      jml_rata:0,
      berat_mati:0,
      berat_pakan:0,
      id_edit:'',
      tfSelected: false,
      hariModal
    });
    this.setState({addModalVisible: !this.state.addModalVisible})
  }
  
  toggleEditModal(){
    fr.collection("Transaksi").doc(this.props.route.params.id).collection('details').doc(this.state.selectedId).get()
    .then((doc) => {
      const { jml_now,jml_mati,jml_panen,jml_tambah,jml_rata,jml_before,hari,berat_mati,berat_pakan,tfSelected } = doc.data()
      const hariModal = hari;
      let tgl = doc.data().tgl;
      if(tgl){
        tgl =tgl.toDate();
      }else{
        tgl = new Date();
      }
      this.setState({
        id_edit:doc.id,
        modalType: 1,
        jml_now:jml_before,
        jml_mati,
        jml_panen,
        jml_tambah,
        jml_rata,
        berat_mati,
        berat_pakan,
        tgl,
        tfSelected,
        hariModal,
        addModalVisible: !this.state.addModalVisible
      });
      this.myRef.current.snapTo(0)
    });
  }

  //DELETE ALL
  deletePressed = (id) => {
    NetInfo.fetch().then(status => {
      if (status.isConnected==true) {
        Alert.alert(
          "Hapus data Transaksi",
          "Anda yakin akan melakukan proses delete ? Ini akan menghapus seluruh data kolam ini",
          [
            {
              text: "Tidak",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Ya", onPress: () => this.deleteTrx(id) }
          ]
        );
      }else{
        alert('Mohon nyalakan Koneksi Internet anda untuk menghapus transaksi ini')
      }
    });
  }

  deleteTrx = (id) => {
    const batch = db.batch();

    const deleted_data = db.collection('Transaksi').doc(id)
    batch.delete(deleted_data);
    db.collection('MasterKolam').where("kode", "==", this.state.trxHeader.kolam).get()
    .then(querySnapshot => {

      const kolam_doc = db.collection('MasterKolam').doc(querySnapshot.docs[0].id)
      
      batch.update(kolam_doc, {
        status: 0
      });
  
      if(batch.commit()){
        alert('Data transaksi berhasil dihapus');
        this.props.navigation.navigate("Data Transaksi");
      }else{
        Alert.alert(
          'Data Transaksi gagal di Simpan'
        );
      }
    })
  }

  //DELETE DETAIL
  deleteDetail = (id) => {
    // console.log(id);
    Alert.alert(
      "Hapus data Transaksi",
      "Anda yakin ingin menghapus data harian ini ?",
      [
        {
          text: "Tidak",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Ya", onPress: () => this.deleteTrxDetail() }
      ]
    );
  }

  deleteTrxDetail = () => {
    this.myRef.current.snapTo(0)
    const transaksi = db.collection('Transaksi').doc(this.props.route.params.id);
    if(this.state.selectedHari==1){
      const batch = db.batch();
      batch.update(transaksi, {
        countHari: 0,
        jumlah: 0,
        berat: 0,
      })
      const deleted_data = transaksi.collection('details').doc(this.state.selectedId)
      batch.delete(deleted_data);
      const trxLog = transaksi.collection('deleted_log');
      batch.set(trxLog.doc(), {
        id_fr: this.state.selectedId
      });
      
      if(batch.commit()){
        alert('Data transaksi detail berhasil dihapus');
        this.loadData();
        this.setState({
          trxDetail: [],
          selectedId: 0,
          selectedHari: 0
        });
      }else{
        Alert.alert(
          'Data Transaksi gagal di Simpan'
        );
      }
    }else{
      const hari_before = this.state.selectedHari-1;
      const batch = db.batch();
      transaksi.collection('details').where('hari','==',hari_before).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const { jml_now, berat_now } = doc.data();
          batch.update(transaksi, {
            countHari: hari_before,
            jumlah: jml_now,
            berat: berat_now,
          })
        })

        const deleted_data = transaksi.collection('details').doc(this.state.selectedId)
        batch.delete(deleted_data);
        const trxLog = transaksi.collection('deleted_log');
        batch.set(trxLog.doc(), {
          id_fr: this.state.selectedId
        });
        if(batch.commit()){
          alert('Data transaksi detail berhasil dihapus');
          this.loadDetail();
          this.loadData();
          this.setState({
            selectedId: 0,
            selectedHari: 0
          });
        }else{
          Alert.alert(
            'Data Transaksi gagal di Simpan'
          );
        }
      });
    }
  }

  //CLOSE TRX
  closePressed = (id) => {
    NetInfo.fetch().then(status => {
      if (status.isConnected==true) {
        if(this.state.trxHeader.jumlah==0){
          Alert.alert(
            "Close data Transaksi",
            "Anda yakin akan melakukan proses tutup transaksi ? Transaksi akan di tutup dan tidak dapat di edit kembali",
            [
              {
                text: "Tidak",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Ya", onPress: () => this.closeTrx(id) }
            ]
          );
        }else{
          alert('Jumlah Ikan harus 0, harap panen semua saat tambah data harian')
        }
      }else{
        alert('Mohon nyalakan Koneksi Internet anda untuk menutup transaksi ini')
      }
    });
  }

  closeTrx = (id) => {
    const batch = db.batch();

    const updated_data = db.collection('Transaksi').doc(id)
    batch.update(updated_data,{
      status: 1
    });
    db.collection('MasterKolam').where("kode", "==", this.state.trxHeader.kolam).get()
    .then(querySnapshot => {

      const kolam_doc = db.collection('MasterKolam').doc(querySnapshot.docs[0].id)
      
      batch.update(kolam_doc, {
        status: 0
      });
  
      if(batch.commit()){
        alert('Data transaksi berhasil diClose');
        this.props.navigation.navigate("Data Transaksi");
      }else{
        Alert.alert(
          'Data Transaksi gagal di Close'
        );
      }
    })
  }

  loadData = () => {
    fr.collection("Transaksi").doc(this.props.route.params.id).get()
    .then((doc) => {
      this.setState({
        id: doc.id,
        trxHeader: doc.data(),
      });
      // console.log('reada');
    });
  }

  loadDetail = () => {
    this.setState({ 
      isLoading: true
    })
    fr.collection("Transaksi").doc(this.props.route.params.id).collection('details').orderBy('hari','desc').limit(7).get()
    .then((snap) => {
      if(snap.docs.length==0){
        this.setState({
          isLoading: false
        })
      }else{
        const trxDetail = snap.docs.map((trx) => {return{...trx.data(), id:trx.id}});
        const lastDoc = snap.docs[snap.docs.length-1];
        const last_br2 = snap.docs[0].data().berat_r2;
        this.setState({ 
          last_br2,
          trxDetail,
          lastDoc,
          isLoading: false
        })
      }
    });
  }

  loadMore = () => {
    this.setState({ 
      isLoading: true
    })
    fr.collection("Transaksi").doc(this.props.route.params.id).collection('details').orderBy('hari','desc').startAfter(this.state.lastDoc).limit(7).get()
    .then((snap) => {
      const trxDetail = snap.docs.map((trx) => {return{...trx.data(), id:trx.id}});
      const lastDoc = snap.docs[snap.docs.length-1];
      
      this.setState({ 
        trxDetail:[...this.state.trxDetail,...trxDetail],
        lastDoc,
        isLoading: false
      })
    })
    .catch(function(error) {
      console.log(error.message);
      throw error;
    });
  }

  componentDidMount() {
    this.loadData();
    this.loadDetail();
  }

  renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 200,
      }}
    >
      <Text>Swipe down to close</Text>
      <TouchableOpacity style={customcss.tombol_edit} onPress={() => this.toggleEditModal()}>
        <Text style={customcss.textTombol}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={customcss.tombol_danger} onPress={() => this.deleteDetail()}>
        <Text style={customcss.textTombol}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    let dataviewnya;
    let lihat_data;
    if(this.state.trxDetail.length>0){
      dataviewnya = <ScrollView>{this.state.trxDetail.map((item, index) => (
        <TouchableOpacity key={index}
          onPress={() => {
            if(item.hari==this.state.trxHeader.countHari){
              this.setState({
                selectedId: item.id,
                selectedHari: item.hari
              })
              this.myRef.current.snapTo(200)
            }
          }}>
          <DataTable.Row style={[item.hari==this.state.trxHeader.countHari ? styles.last_table: '']}>
            <DataTable.Cell numeric style={{flex: 1}}>{item.hari}</DataTable.Cell>
            {/* <DataTable.Cell numeric>{item.jml_before}</DataTable.Cell> */}
            <DataTable.Cell numeric style={{flex: 1}}>{item.jml_now}</DataTable.Cell>
            <DataTable.Cell numeric style={{flex: 1}}>{item.jml_mati}</DataTable.Cell>
            <DataTable.Cell numeric style={{flex: 1}}>{(item.tfSelected==false)? item.jml_panen:0}</DataTable.Cell>
            <DataTable.Cell numeric style={{flex: 1}}>{(item.tfSelected==true)? item.jml_panen:0}</DataTable.Cell>
            <DataTable.Cell numeric style={{flex: 1}}>{item.jml_tambah}</DataTable.Cell>
            <DataTable.Cell numeric style={{flex: 1}}>{item.berat_r2}</DataTable.Cell>
            <DataTable.Cell numeric style={{flex: 1}}>{item.berat_mati}</DataTable.Cell>
            <DataTable.Cell numeric style={{flex: 1}}>{item.berat_pakan}</DataTable.Cell>
            <DataTable.Cell numeric style={{flex: 2}}>{item.berat_now}</DataTable.Cell>
          </DataTable.Row>
        </TouchableOpacity>
      ))}
      </ScrollView>
      lihat_data = <Button icon="refresh" mode="outlined" onPress={() => this.loadMore()}>
        Lihat data Sebelumnya
      </Button>
    }else{
      dataviewnya = <Text>No Data Found</Text>
    }
    return <ScrollView>
        <Spinner
          visible={this.state.isLoading}
          textContent={'Loading...'}
          textStyle={customcss.spinnerTextStyle}
        />
        <Modal animationType="slide" visible={this.state.addModalVisible} 
          onRequestClose={() => this.toggleAddModal()}>
            <TrxAddModal idnih={this.props.route.params.id} nomor={this.state.hariModal}
              id_edit={this.state.id_edit}
              berat_r2={this.state.last_br2}
              berat_mati={this.state.berat_mati}
              berat_pakan={this.state.berat_pakan}
              jml_now={this.state.jml_now}
              jml_mati={this.state.jml_mati}
              jml_panen={this.state.jml_panen}
              jml_tambah={this.state.jml_tambah}
              jml_rata={this.state.jml_rata}
              tgl={this.state.tgl}
              tfSelected={this.state.tfSelected}
              modalType={this.state.modalType}
              closeModal={() => this.toggleAddModal()} 
              updateHari={() => {
                this.loadData();
                this.loadDetail();
              }}/>
        </Modal>
        <BottomSheet
          ref={this.myRef}
          snapPoints={[0, 200]}
          overdragResistanceFactor={0}
          borderRadius={10}
          renderContent={this.renderContent}
        />
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.header}>
              <View style={styles.headleft}>
                <TouchableOpacity>
                <Icon
                  name="delete"
                  size={15}
                  color="black"
                  reverse
                  onPress={() => { this.deletePressed(this.state.id) }}
                /></TouchableOpacity>
              </View>
              <View>
                <Text style={styles.time}>Kode Transaksi : {this.state.trxHeader.kode_transaksi}</Text>
                <Text style={styles.time}>Kode Kolam : {this.state.trxHeader.kolam} ({this.state.trxHeader.kolam_name})</Text>
                <Text style={styles.time}>Jenis Ikan : {this.state.trxHeader.ikan}</Text>
              </View>
              <View style={styles.headright}>
                <TouchableOpacity>
                <Icon
                  raised
                  name='check'
                  type='font-awesome'
                  size={15}
                  color="green"
                  reverse
                  onPress={() => { this.closePressed(this.state.id) }}
                /></TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.socialBarContainer}>
              <View style={styles.socialBarSection}>
                <View style={styles.socialBarButton}>
                  <Text style={styles.socialBarLabel}>Input ke - {this.state.trxHeader.countHari}</Text>
                </View>
              </View>
              <View style={styles.socialBarSection}>
                <View style={styles.socialBarButton}>
                  <Text rkType='primary4 hintColor' style={styles.socialBarLabel}>Jumlah : {this.state.trxHeader.jumlah}</Text>
                </View>
              </View>
              <View style={styles.socialBarSection}>
                <View style={styles.socialBarButton}>
                  <Text rkType='primary4 hintColor' style={styles.socialBarLabel}>Berat : {this.state.trxHeader.berat}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.cardLegend}>
            <View style={styles.legendRow}>
              <Text style={styles.time}>SI : Jumlah Hari ini</Text>
              <Text style={styles.time}>T : Jumlah tambah hari ini</Text>
            </View>
            <View style={styles.legendRow}>
              <Text style={styles.time}>M : Jumlah Mati</Text>
              <Text style={styles.time}>P : Jumlah Panen</Text>
            </View>
            <View style={styles.legendRow}>
              <Text style={styles.time}>R2 : Berat Rata-rata</Text>
              <Text style={styles.time}>TL : Berat Total</Text>
            </View>
            <View style={styles.legendRow}>
              <Text style={styles.time}>BM : Berat Mati</Text>
              <Text style={styles.time}>BP : Berat Pakan</Text>
            </View>
            <View style={styles.legendRow}>
              <Text style={styles.time}>TF : Jumlah Transfer</Text>
            </View>
          </View>
          <View>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={{flex: 1}}>#</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 1}}>SI</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 1}}>M</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 1}}>P</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 1}}>TF</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 1}}>T</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 1}}>R2</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 1}}>BM</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 1}}>BP</DataTable.Title>
                  <DataTable.Title numeric style={{flex: 2}}>TL</DataTable.Title>
                </DataTable.Header>
                { this.state.isLoading ? 
                  <Text>Loading . . .</Text> : dataviewnya
                }
                {lihat_data}
              </DataTable>
            <StyledButton type="primary" text="Tambah Data Harian" 
              onPress={() => this.toggleAddModal()}
              // onPress={() => this.myRef.current.snapTo(200)}
            />
          </View>
        </View>
      </ScrollView>
  }
};

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  header: {
    width: '100%',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headright: {
    paddingLeft: 20,
    width: 100,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headleft: {
    paddingRight: 20,
    width: 100,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  /******** card **************/
  card:{
    shadowColor: '#00000021',
    shadowOffset: {
      width: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    backgroundColor:"white"
  },
  cardHeader: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  /******** card components **************/
  title:{
    fontSize:18,
  },
  time:{
    fontSize:13,
    textAlign:'center',
    color: "#808080",
    marginTop: 5
  },
  icon: {
    width:25,
    height:25,
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  socialBarSection: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarlabel: {
    marginLeft: 8,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  socialBarButton:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //Legend
  cardLegend: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  legendRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  //Last
  last_table: {
    backgroundColor: 'powderblue'
  }
});