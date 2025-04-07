type CategoryColor = {
  backgroundColor: string;
  textColor: string;
};

export const categoryColors: Record<string, CategoryColor> = {
  카페: {
    backgroundColor: '#FF6F61',
    textColor: 'white',
  },
  편의점: {
    backgroundColor: '#FF6F61',
    textColor: 'white',
  },
  한식: {
    backgroundColor: '#FF6F61',
    textColor: 'white',
  },
  버거: {
    backgroundColor: '#FF6F61',
    textColor: 'white',
  },
  휴일: {
    backgroundColor: '#00ff0000',
    textColor: 'red',
  },
  기본: {
    backgroundColor: '#6e6e6e',
    textColor: 'white',
  },
};
export default categoryColors;
