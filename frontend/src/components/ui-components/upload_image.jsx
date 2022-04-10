import axios from 'axios';
import uuid from 'react-uuid';
import { Button, Input, FormControl, FormLabel } from '@mui/material';
import React, { Component }  from 'react';
import Box from '../app/wrappers/box';
// function ArrayBufferToBinary(buffer) {
//     let uint8 = new Uint8Array(buffer);
//     return uint8.reduce((binary, uint8) => binary + uint8.toString(2), '');
// }

const onButtonClick = e => {
   // const data = new FormData();
   e.preventDefault();
   const input = document.querySelector('#image_input');
   const labels = document.querySelector('#label_input');
   const form = document.querySelector('#form1');
   const customLabels = labels.value.replace(/\s/g, '').split(',');
   const file = input.files[0];
   form.reset();
   console.log(file);
   const headers = {
        'Content-Type': file.type,
        'Content-Disposition': 'acb',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'PUT,OPTIONS',
        'x-amz-meta-tags':customLabels,
        };
   axios.put(`https://ig6dvmrlt3.execute-api.us-east-1.amazonaws.com/v1/upload/b2-ac9137/${uuid()}_${file.name}`, file, {headers})
   .then(response => console.log(response))
        .catch(error => {
            console.error('There was an error!', error);
        });
};
  const ImageUploadCard = () =>{
    return (
      <Box heading='Upload Image'>
        <div className='flex-grow flex flex-row justify-center' style={{paddingBottom: 20}}> 
          <form id='form1' onSubmit={onButtonClick}>
            <div className='flex-grow flex flex-row justify-center'>
              <FormLabel> Image: &nbsp;  
                <input style={{marginRight: 30}} id='image_input' type='file' accept="image/*" />
              </FormLabel>
              <FormLabel> Custom Labels: &nbsp;
                <Input style={{marginRight: 30}} id='label_input' type='text' />
              </FormLabel>
              <Button type='submit' variant="contained">Upload</Button>
            </div>
          </form>
        </div>
      </Box>   
    );
};

export default ImageUploadCard;
