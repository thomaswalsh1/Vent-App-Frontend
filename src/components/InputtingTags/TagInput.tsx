import React, { useState } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder = "Add a tag" }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      e.preventDefault();
      removeLastTag();
    }
  };

  const addTag = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const removeLastTag = () => {
    const newTags = value.slice(0, -1);
    onChange(newTags);
  };

  return (
    <div className="flex flex-wrap w-full max-h-48 items-center border border-black rounded px-2 py-1 focus-within:border-black overflow-y-scroll">
      {value.map((tag, index) => (
        <div
          key={index}
          className="flex items-center bg-slate-400 text-white rounded px-2 py-1 m-1"
        >
          <span className='text-xs sm:text-sm md:text-base'>{tag}</span>
          <button
            type="button"
            className="ml-2 text-white hover:text-white"
            onClick={() => removeTag(index)}
          >
            ×
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-[30%] sm:w-[25%] text-xs sm:text-sm md:text-base outline-none focus:border-transparent p-1 m-1"
      />
    </div>
  );
};

export default TagInput;
