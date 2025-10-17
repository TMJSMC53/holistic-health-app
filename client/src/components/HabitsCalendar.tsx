import { useCallback, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { HabitData } from '../habits';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type HabitsCalendarProps = {
  habits: HabitData[];
};
const HabitsCalendar = ({ habits }: HabitsCalendarProps) => {
  const [value, setValue] = useState<Value>(new Date());

  const show = useCallback(({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (date.getDate() % 2 === 0) {
        return <div>Even</div>;
      } else {
        return <div>Odd</div>;
      }
    }
    return null;
  }, []);
  return (
    <>
      <Calendar
        className="font-poppins"
        onChange={setValue}
        value={value}
        locale="en-EN"
        tileContent={show}
      />
    </>
  );
};

export default HabitsCalendar;
