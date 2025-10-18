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

  const show = useCallback(
    ({ date, view }: { date: Date; view: string }) => {
      if (view === 'month') {
        //1. Find all habits that were enacted on this date
        const enactedHabits = habits.filter((habit) =>
          isHabitEnactedOnDate(habit, date)
        );

        // 2. Extract emojis from those habits
        const emojis = enactedHabits.map((habit) =>
          extractEmojiFromHabitTitle(habit.title)
        );

        // 3. Display the emojis (if any)
        if (emojis.length > 0) {
          return <div>{emojis.join('')}</div>;
        }
      }
      return null;
    },
    [habits]
  );

  const extractEmojiFromHabitTitle = (habitTitle: string) => {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const emojis = habitTitle.match(emojiRegex);
    return emojis ? emojis.join('') : '';
  };

  const isHabitEnactedOnDate = (habit: HabitData, date: Date) => {
    // check if habit was done on this date
    const dateString = date.toLocaleDateString().split('T')[0];

    return habit.enactments.some((enactment) => {
      const enactmentDate = new Date(enactment)
        .toLocaleDateString()
        .split('T')[0];
      return enactmentDate === dateString;
    });
  };

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
