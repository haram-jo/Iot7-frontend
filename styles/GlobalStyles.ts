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
  highlightedMenuName: {
    fontWeight: 'bold', // 굵게
    color: '#b861ff', // 오렌지 색상 (원하면 바꿔도 됨)
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
  bannerImage: {
    height: '100%', // 배너 높이에 맞추기
    width: height * 0.17, // 비율에 맞춰 폭 설정
    resizeMode: 'contain',
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
  monthModalTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
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

  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c7c7c7',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    width: width * 0.9,
  },
  bannerTitle: {
    color: '#805ef7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bannerSubtitle: {
    color: '#ae9af5',
    fontSize: 12,
    marginTop: 4,
  },
  modalBox: {
    width: width * 0.8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  modalBackgroundImage: {
    width: '100%',
    height: height * 0.5,
    resizeMode: 'cover',
  },
  alertCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  modalTextContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
  },
  alertModalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    marginBottom: 8,
  },
  alertModalSubTitle: {
    color: '#fff',
    fontSize: 14,
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  alertModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  alertModalButton: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  slide: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    left: 20,
    top: 30,
  },
  wrapper: {
    height: height * 0.2,
  },
  banner: {
    flex: 1,
    overflow: 'hidden',
    padding: 20,
    flexDirection: 'row', // ⭐⭐ 추가: 텍스트 + 이미지 옆으로
    alignItems: 'center', // 세로 가운데 정렬
    justifyContent: 'space-between', // 텍스트-이미지 양쪽 정렬
  },
  textBox: {
    flex: 1,
    maxWidth: '60%',
  },
  brand: {
    fontSize: 14,
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#142b82',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
  pageIndicator: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
});

export default GlobalStyles;
