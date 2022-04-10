import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Button from './helpers/Button';
import TextBox from './helpers/TextBox';
import TranscribeController from '../../controllers/transcribe.controller';
import logger from '../../utils/logger';
import useTranscribeConfig from '../../hooks/use-transcribe-config';
import { ImageContext } from '../../store/transcribe-config';


const StreamingView: React.FC<{
  componentName: 'StreamingView';
}> = () => {
  const [transcribeConfig] = useTranscribeConfig();
  const [recognizedTextArray, setRecognizedTextArray] = useState<string[]>([]);
  const [recognizingText, setRecognizingText] = useState<string>('');
  const [started, setStarted] = useState(false);

  const transcribeController = useMemo(() => new TranscribeController(), []);

  useEffect(() => {
    transcribeController.setConfig(transcribeConfig);

    // if config is being updated, then stop the transcription
    setStarted(false);
  }, [transcribeConfig, transcribeController]);

  useEffect(() => {
    const display = ({ text, final }: { text: string; final: boolean }) => {
      logger.info({ text, final });
      if (final) {
        setRecognizingText('');
        setRecognizedTextArray((prevTextArray) => [...prevTextArray, text]);
      } else {
        setRecognizingText(text);
      }
    };

    transcribeController.on('recognized', display);

    return () => {
      transcribeController.removeListener('recognized', display);
    };
  }, [transcribeController]);

  useEffect(() => {
    (async () => {
      if (started) {
        logger.info('attempting to start transcription');

        // reset state
        setRecognizedTextArray([]);
        setRecognizingText('');

        await transcribeController.init().catch((error: Error) => {
          logger.error(error);
          setStarted(false);
        });
      } else {
        logger.info('stopping transcription');
        await transcribeController.stop();
      }
    })();
  }, [started, transcribeController]);

  const {setImages}=useContext(ImageContext);
  const onSearchClick = ()=>{
      const headers={'Access-Control-Allow-Origin':'*'};
      let textToSend = '';
      if (recognizingText==''){
        textToSend = [...recognizedTextArray, recognizingText].join(' ');
      } else { 
        textToSend = recognizingText;
      }
      setRecognizingText('');
      setRecognizedTextArray([]);
      setImages([]);
      axios.get(`https://ig6dvmrlt3.execute-api.us-east-1.amazonaws.com/v1/search?q=${textToSend.replace(/[^a-zA-Z ]/g, '')}`, {headers})
      .then((x:any)=>{
        if (x!=undefined){
          if (x.data.body.keys){
            setImages(x.data.body);
          } 
        } 
         
      });
    };

  return (
    <div className="flex-grow flex flex-col">
      <TextBox
        name="streaming-result"
        placeholder="Your text will show up here"
        setRecognizingText={setRecognizingText}
        setRecognizedTextArray={setRecognizedTextArray}
        value={[...recognizedTextArray, recognizingText].join(' ')}
      />

      <div className="flex-grow flex flex-row justify-center">
        <Button
          text="Record"
          color="green"
          disabled={started}
          onClick={() => setStarted(true)}
        />
        <Button
          text="Stop"
          color="red"
          disabled={!started}
          onClick={() => setStarted(false)}
        />
        <Button
          text="Clear"
          color="purple"
          disabled={false}
          onClick={() => {setRecognizingText(''); setRecognizedTextArray([]); setImages([]);}}
        />
        <Button
          text="Search"
          color="blue"
          disabled={false}
          onClick={() => onSearchClick()}
        />
      </div>
    </div>
  );
};

export default StreamingView;
