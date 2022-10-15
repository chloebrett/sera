import * as React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface Props {
  fieldName: string;
  possibleValues: string[];
  chosenValues: string[]; // separated by comma
  fieldTitle: string;
  setFieldValue: any;
}

export default function AutocompleteMultiSelect({
  fieldName,
  possibleValues,
  chosenValues,
  fieldTitle,
  setFieldValue,
}: Props) {
  return (
    <Autocomplete
      multiple
      freeSolo
      sx={{
        margin: '10px',
        width: 'calc(50% - 20px)',
        color: 'black',
        background: 'white',
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
