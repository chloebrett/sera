import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface Props {
  fieldName: string;
  possibleValues: string[];
  chosenValues: string[]; // separated by comma
  fieldTitle: string;
  setFieldValue: any;
  freeSolo: boolean;
  fullWidth: boolean;
}

export default function AutocompleteMultiSelect({
  fieldName,
  possibleValues,
  chosenValues,
  fieldTitle,
  setFieldValue,
  freeSolo,
  fullWidth,
}: Props) {
  return (
    <Autocomplete
      multiple
      freeSolo={freeSolo}
      sx={{
        margin: '10px',
        width: fullWidth ? '100%' : 'calc(50% - 20px)',
        color: 'black',
        background: 'white',
        padding: '10px',
        borderRadius: '4px',
      }}
      options={possibleValues}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={fieldTitle}
          id={fieldName}
          name={fieldName}
        />
      )}
      value={chosenValues}
      onChange={(_, value) => setFieldValue(fieldName, value)}
    />
  );
}
