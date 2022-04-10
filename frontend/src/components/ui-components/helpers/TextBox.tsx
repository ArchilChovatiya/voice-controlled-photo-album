import React, { useEffect, useState } from 'react';

const TextBox: React.FC<{
  name: string;
  value: string;
  placeholder?: string;

  setRecognizingText:Function;
  setRecognizedTextArray:Function;
}> = ({ name, placeholder, value, setRecognizingText, setRecognizedTextArray }) => {
  
  return (
    <textarea
      className="flex-grow flex mx-8 my-4 bg-gray-100 border-black border-2 text-sm"
      id={name}
      name={name}
      placeholder={placeholder}
      rows={2}
      value={value}
      onChange={e=>{setRecognizedTextArray([]); setRecognizingText(e.target.value);}}
    />
  );
};

export default TextBox;