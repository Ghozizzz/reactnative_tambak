import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  //Header
  // headerContainer: {
  //   flex: 1,
  //   backgroundColor: "white",
  // },
  headerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500'
  },
  container: {
    flex: 1
  },
  headerContainer: {
    zIndex: 100,
    resizeMode: 'contain',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlignVertical: 'top',
    width: '100%',
    height: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1976D2'
  },
  logo_img: {
    width: 100,
    height: 20
  },

  //MiddleMenu
  MiddleMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 4,
    marginTop: '-12%',
    marginLeft: '2%',
    marginRight: '2%',
    width: '96%',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    top: 5,
  },
  MiddleMenuIsi: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  ImgIcon:{
    width:25,
    height:25
  },
  MMText: {
    paddingLeft: 5,
  },

  //LandingItem
  landingContainer: {
    width: '100%',
    height: '100%',
  },
  titlesContainer: {
    paddingTop: '15%',
    paddingBottom: '12%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontSize: 30,
    lineHeight: 30,
    color: '#ffff'
  },
  sub_title: {
    fontSize: 16,
    color: '#ffff'
  },
  landingBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    backgroundColor: '#CFD8DC'
  },

  //StyledButton
  button_container_wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  button_container: {
    width: '100%',
    padding: 10
  },
  button: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button_text: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },

  //Button normal
  tombol: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  tombol_edit: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  tombol_danger: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  textTombol: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },

  //StyledTextInput
  textinput_container :{
    justifyContent: 'center',
    flex:1,
    marginTop:25,
    marginBottom:25,
  },
  textinput_class:{
    paddingLeft: 10,
    textAlign: 'left',
    height: 40,
    borderWidth: 1,
    borderColor: '#039BE5',
    borderRadius: 5,
  },

  //Card
  cardContainer: {
    width: '100%'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor:'#5C6BC0',
    borderBottomWidth:1,
    marginBottom: 10,
    marginLeft: '2%',
    marginRight: '2%',
    width: '96%',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  //Input
  inputContainer: {
    alignSelf: 'stretch',
    padding: 10,
    top: 50,
  },
  inputText2: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 10,
    color: '#000',
    borderBottomColor: '#039BE5',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15
  },

  
  inputText: {
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 10,
    color: '#000',
    borderBottomColor: '#039BE5',
    borderWidth: 1,
    paddingHorizontal: 15
  },

  //Picker
  picker: { 
    height: 50,
    width: '100%'
  },

  //Master
  masterContainer: {
    width: '100%',
    height: '100%',
  },
  masterTitles:{
    paddingTop: 10,
    paddingBottom: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  
  spinnerTextStyle: {
    color: '#FFF'
  },
})

export default styles;