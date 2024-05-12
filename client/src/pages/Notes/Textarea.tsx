import { useState, ChangeEvent } from 'react';

interface TextareaProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  initialTextValue?: string;
}

const Textarea: React.FC<TextareaProps> = ({ setText, initialTextValue }) => {
  const [textValue, setTextValue] = useState(initialTextValue || '');
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
    setText(event.target.value);
  };
  return (
    <div>
      <label htmlFor="myTextarea"></label>
      <textarea
        className="text-14 md:text-18 text-primary-600 font-poppins border w-full mt-6 mb-4"
        id="myTextarea"
        value={textValue}
        onChange={handleChange}
        rows={5} // Optional: Set the number of visible rows
        cols={40} // Optional: Set the number of visible columns
      />
    </div>
  );
};

export default Textarea;
