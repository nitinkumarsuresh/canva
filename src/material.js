import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Material() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [cta, setCta] = useState('');

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleContent = (event) => {
        setContent(event.target.value);
    };

    const handleCta = (event) => {
        setCta(event.target.value);
    };
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '65ch', },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" className='text-slate-300'  label="Ad title" variant="outlined" onChange={handleTitle} value={title} />
      <TextField id="outlined-basic" className='text-slate-300'  label="Ad content" variant="outlined" onChange={handleContent} value={content}/>
      <TextField id="outlined-basic" className='text-slate-300' label="CTA" variant="outlined" onChange={handleCta} value={cta} />
      
    </Box>
  );
}