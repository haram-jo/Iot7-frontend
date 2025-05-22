type CategoryColor = {
  backgroundColor: string;
  textColor: string;
};

export const categoryColors: Record<string, CategoryColor> = {
  카페: {
    backgroundColor: '#db5f4f',
    textColor: '#ffd3cf',
  },
  편의점: {
    backgroundColor: '#85b50b',
    textColor: '#000000',
  },
  한식: {
    backgroundColor: '#4fa64b',
    textColor: '#c2ffbf',
  },
  버거: {
    backgroundColor: '#7b61ff',
    textColor: 'white',
  },
  올리브영: {
    backgroundColor: '#25b34b',
    textColor: 'white',
  },
  음료: {
    backgroundColor: '#6190ff',
    textColor: 'white',
  },
  디저트: {
    backgroundColor: '#c688db',
    textColor: 'white',
  },
  휴일: {
    backgroundColor: '#00ff0000', //투명색
    textColor: 'red',
  },
  기본: {
    backgroundColor: '#6e6e6e',
    textColor: 'white',
  },
};
export default categoryColors;
