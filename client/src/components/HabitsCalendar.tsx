import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const HabitsCalendar = () => {
  //   const [value, onChange] = useState<Value>(new Date());
  const [value, setValue] = useState<Value>(new Date());

  return (
    <>
      {/* <Calendar onChange={onChange} value={value} /> */}
      <Calendar onChange={setValue} value={value} locale="en-EN" />
    </>
  );
};

export default HabitsCalendar;
