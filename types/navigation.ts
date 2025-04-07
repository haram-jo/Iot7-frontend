export type RootStackParamList = {
  Home: undefined;
  Login: undefined; // ✅ 이 줄 추가!
  BottomNav: undefined;
  Product: {
    menu: {
      menuId: number;
      menuName: string;
      price: number;
    } | null;
  };
};
