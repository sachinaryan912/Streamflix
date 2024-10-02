import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

export default function AccordionUsage({ faqList }) {
  const darkStyle = {
    backgroundColor: '#333', 
    color: '#fff',
  };

  return (
    <div>
      {faqList.map((item, index) => (
        <Accordion key={index} sx={{ backgroundColor: '#333', color: '#fff' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            sx={darkStyle}
          >
            {item.question}
          </AccordionSummary>
          <AccordionDetails sx={darkStyle}>
            {item.answer}
          </AccordionDetails>
          {item.actions && (
            <AccordionActions sx={darkStyle}>
              <Button sx={{ color: '#fff' }}>Cancel</Button>
              <Button sx={{ color: '#fff' }}>Agree</Button>
            </AccordionActions>
          )}
        </Accordion>
      ))}
    </div>
  );
}
