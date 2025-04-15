import {API_URL} from '@env';
import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-big-calendar';
import dayjs from 'dayjs';
import GlobalStyles from '../styles/GlobalStyles';
import categoryColors from '../styles/categoryColors';
import CalendarMonthSelect from '../components/calendar/CalendarMonthSelect';
import CalendarDayModal from '../components/calendar/CalendarDayModal';
import CalendarItemModel from '../components/calendar/CalendarItemModel';
import CalendarItem from '../components/calendar/CalendarItem';

const {height} = Dimensions.get('window');

interface EventType {
  menuId: number;
  title: string;
  start: Date;
  end: Date;
  category: string;
  color: string;
  description: string;
  price: number;
  brand: string;
  image?: string;
}

const CalendarScreen = () => {
  const today = new Date();

  const [events, setEvents] = useState<EventType[]>([]);
  const [currentDate, setCurrentDate] = useState(today);
  const [currentYear, setCurrentYear] = useState(dayjs(today).year());
  const [currentMonth, setCurrentMonth] = useState(dayjs(today).month());
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const updateCurrentDate = (newDate: Date) => {
    setCurrentDate(newDate);
    setCurrentYear(dayjs(newDate).year());
    setCurrentMonth(dayjs(newDate).month());
  };
  useEffect(() => {
    console.log('📅 currentDate changed:', currentDate);
  }, []);
  useEffect(() => {
    const fetchEvents = async () => {
      console.log('Fetching events from API:', API_URL);
      try {
        const response = await fetch(`${API_URL}/calendar/menus`);
        const data = await response.json();
        // console.log('Received response:', data);
        const mappedEvents = data.map(item => ({
          menuId: item.menuId,
          title: item.menuName,
          start: new Date(
            `${dayjs(item.regDate).format('YYYY-MM-DD')}T10:00:00`,
          ),
          end: new Date(`${dayjs(item.regDate).format('YYYY-MM-DD')}T11:00:00`),
          category: item.category,
          color: categoryColors[item.category]?.backgroundColor || '#9E9E9E',
          description: item.description,
          price: item.price,
          brand: item.brand,
          image: item.imageUrl,
        }));
        // console.log('Mapped events:', mappedEvents);
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
      <View style={GlobalStyles.header}>
        <TouchableOpacity onPress={() => setIsMonthPickerVisible(true)}>
          <Text style={GlobalStyles.title}>
            {currentYear}년 {currentMonth + 1}월
          </Text>
        </TouchableOpacity>
      </View>

      <Calendar
        events={events}
        height={height * 0.8}
        mode="month"
        weekStartsOn={0}
        date={currentDate}
        onChangeDate={([startDate]) => {
          if (startDate && !dayjs(startDate).isSame(currentDate, 'day')) {
            updateCurrentDate(startDate);
          }
        }}
        onPressCell={date => {
          setSelectedDate(date);
          setSelectedEvent(null);
        }}
        onPressEvent={(event: EventType) => {
          setSelectedDate(event.start);
          setSelectedEvent(null);
          // setSelectedDate(null);
        }}
        eventCellStyle={event => ({
          backgroundColor: event.color || '#9E9E9E',
          borderRadius: 6,
          padding: 2,
        })}
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
        onItemSelect={item => {
          setSelectedEvent(item);
          setSelectedDate(null);
        }}
      />
      <CalendarItemModel
        visible={!!selectedEvent}
        item={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </View>
  );
};

export default CalendarScreen;
