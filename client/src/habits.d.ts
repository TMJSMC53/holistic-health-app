// src/types/habits.d.ts
export type HabitData = {
  _id: string;
  title: string;
  enactments: string[];
};

export type HabitProps = {
  habit?: HabitData;
  habits: HabitData[];
  setHabits: React.Dispatch<React.SetStateAction<HabitData[]>>;
};
