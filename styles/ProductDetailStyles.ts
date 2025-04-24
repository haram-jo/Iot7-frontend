// screens/ProductDetailStyles.ts

import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export const ITEM_WIDTH = width * 0.4;
export const SPACING = 10;

const styles = StyleSheet.create({
  wrapper: {flex: 1, backgroundColor: '#fff'},
  loading: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3,
  },
  brandText: {
    color: '#777',
    marginBottom: 6,
  },
  nameAndStar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuName: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  stars: {
    fontSize: 16,
    color: '#f1c40f',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  summaryTable: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    width: 90,
    height: 90,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  horizontalCards: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
    paddingRight: 10,
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  blogCard: {
    width: width * 0.4,
    backgroundColor: '#F5EBFF',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  blogDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  blogDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  youtubeCard: {
    width: width * 0.6,
    marginRight: 12,
    backgroundColor: '#FFFCF3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  youtubeThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 6,
  },
  youtubeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
});

export default styles;
