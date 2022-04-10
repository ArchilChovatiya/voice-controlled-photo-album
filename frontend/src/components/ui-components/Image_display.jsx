import React, { Component, useContext }  from 'react';
import { ImageList, ImageListItem } from '@mui/material';
import Box from '../app/wrappers/box';
import { ImageContext } from '../../store/transcribe-config';


  const ImageDisplayCard = () =>{
    const {images} =  useContext(ImageContext);
    console.log(images);
    return (
    {images}?
      <Box>
        <div className='flex-grow flex flex-col justify-center'> 
          <ImageList rowHeight={800} cols={2}>
            {images.map((item) => (
              <ImageListItem key={item.objectKey}>
                <img
                  src={`https://${item.bucket}.s3.amazonaws.com/${item.objectKey}`}
                  alt={item.objectKey}
                  loading="lazy"
                />
              </ImageListItem>
              ))}
          </ImageList>
        </div> 
      </Box> : <></>
    );
};

export default ImageDisplayCard;