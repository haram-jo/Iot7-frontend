import React, {useEffect, useState} from 'react';
import {View, Dimensions} from 'react-native';
import dayjs from 'dayjs';
import {API_URL} from '@env';
import GlobalStyles from '../styles/GlobalStyles';
import categoryColors from '../styles/categoryColors';
import CalendarMonthSelect from '../components/calendar/CalendarMonthSelect';
import CalendarDayModal from '../components/calendar/CalendarDayModal';
import CalendarItemModel from '../components/calendar/CalendarItemModel';
import CustomCalendar from '../components/calendar/CustomCalendar';

const {height} = Dimensions.get('window');

interface EventType {
  menuId: number;
  menuName: string;
  title: string;
  start: Date;
  end: Date;
  category: string;
  color: string;
  description: string;
  price: number;
  brand: string;
  imageUrl: string;
  rating: number;
}

const CalendarScreen = () => {
  const today = new Date();
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentDate, setCurrentDate] = useState(today);
  const [currentYear, setCurrentYear] = useState(dayjs(today).year());
  const [currentMonth, setCurrentMonth] = useState(dayjs(today).month());
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const updateCurrentDate = (newDate: Date) => {
    setCurrentDate(newDate);
    setCurrentYear(dayjs(newDate).year());
    setCurrentMonth(dayjs(newDate).month());
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/calendar/menus`);
        const data = await response.json();
        const mappedEvents = data.map(menu => ({
          menuId: menu.menuId,
          menuName: menu.menuName,
          title: menu.brand,
          start: new Date(
            `${dayjs(menu.regDate).format('YYYY-MM-DD')}T10:00:00`,
          ),
          end: new Date(`${dayjs(menu.regDate).format('YYYY-MM-DD')}T11:00:00`),
          category: menu.category,
          color: categoryColors[menu.category]?.backgroundColor || '#9E9E9E',
          description: menu.description,
          price: menu.price,
          brand: menu.brand,
          imageUrl: menu.imageUrl,
          rating: menu.rating ?? 0,
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to fetch calendar data:', error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = selectedDate
    ? events.filter(event => dayjs(event.start).isSame(selectedDate, 'day'))
    : [];

  return (
    <View style={GlobalStyles.container}>
      <CustomCalendar
        events={events}
        currentDate={currentDate}
        onDateChange={updateCurrentDate}
        onSelectDate={setSelectedDate}
        onSelectEvent={setSelectedEvent}
        openMonthPicker={() => setIsMonthPickerVisible(true)}
      />

      <CalendarMonthSelect
        visible={isMonthPickerVisible}
        selectedYear={currentYear}
        selectedMonth={currentMonth + 1}
        selectYear={year => {
          const newDate = dayjs(currentDate).year(year).toDate();
          updateCurrentDate(newDate);
          setIsMonthPickerVisible(false);
        }}
        selectMonth={month => {
          const newDate = dayjs(currentDate)
            .month(month - 1)
            .toDate();
          updateCurrentDate(newDate);
          setIsMonthPickerVisible(false);
        }}
        onClose={() => setIsMonthPickerVisible(false)}
      />

      <CalendarDayModal
        visible={!!selectedDate}
        date={selectedDate}
        event={filteredEvents}
        onClose={() => setSelectedDate(null)}
        onItemSelect={menu => {
          setSelectedEvent(menu);
          setSelectedDate(null);
        }}
      />

      <CalendarItemModel
        visible={!!selectedEvent}
        menu={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </View>
  );
};

export default CalendarScreen;
