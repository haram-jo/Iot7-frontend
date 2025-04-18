import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFFF',
    paddingTop: height * 0.05,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  textCenter: {
    textAlign: 'center',
  },
  button_dark: {
    marginTop: 10,
    backgroundColor: '#dcceed',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  button_light: {
    marginTop: 10,
    backgroundColor: '#eacef0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.02,
  },
  infoContainer: {
    alignItems: 'center',
  },
  sectionContainer: {
    // flex: 1,
    backgroundColor: '#F5EFFF',
    width: width,
    height: height * 0.06,
  },
  icon: {
    fontSize: width * 0.05,
    marginLeft: width * 0.02,
    color: '#777',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: width * 0.025,
    padding: width * 0.035,
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.003,
    alignItems: 'center',
    elevation: 2,
    height: height * 0.1,
  },
  imageBox: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.02,
    backgroundColor: '#D3D3D3',
    marginRight: width * 0.04,
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: height * 0.003,
  },
  price: {
    fontSize: width * 0.04,
    color: '#555',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    marginLeft: 8,
  },
  description: {
    fontSize: width * 0.035,
    color: '#777',
    marginBottom: height * 0.005,
  },
  scheduleItem: {
    padding: height * 0.2,
    marginVertical: 4,
    borderRadius: 6,
  },

  scheduleText: {
    fontSize: width * 0.2,
    color: '#000',
  },
  CalendarListSheetContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  CalendarListSheetText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F5EFFF',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerBox: {
    backgroundColor: '#F5EFFF',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
  },
  // modalItem: {
  //   padding: 10,
  //   fontSize: 18,
  // },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: '#F5EFFF',
    padding: 20,
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  scheduleRow: {
    backgroundColor: '#e9dbff',
    padding: height * 0.009,
    borderRadius: width * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.0035,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 12,
    textAlign: 'center',
    color: '#000',
  },
  buttonText_light: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText_dark: {
    color: 'purple',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GlobalStyles;
