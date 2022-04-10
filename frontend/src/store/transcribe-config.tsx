/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import transcribeConfig from '../constants/transcribe.constants';

type TranscribeContext = [
  typeof transcribeConfig,
  React.Dispatch<React.SetStateAction<typeof transcribeConfig>> | (() => {}),
];

export const TranscribeConfigContext = React.createContext<TranscribeContext>([
  transcribeConfig,
  () => {},
]);

export const ImageContext = React.createContext<any>({
    images:[],
    setImages:(images:any)=>{},
});

const TranscribeConfigProvider: React.FC<{}> = ({ children }) => {
  const transcribeConfigHook = React.useState(transcribeConfig);
  const [images, setImages] = React.useState([]);
  return (
    <TranscribeConfigContext.Provider value={transcribeConfigHook}>
      <ImageContext.Provider value={{images, setImages}}>
        {children}
      </ImageContext.Provider>
    </TranscribeConfigContext.Provider>
  );
};

export default TranscribeConfigProvider;
