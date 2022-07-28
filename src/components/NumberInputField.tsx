import React from 'react';

import NumberFormat from 'react-number-format';

interface NumberFormatProps {
  inputRef: (instance: NumberFormat<any> | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberInputField: React.FC<NumberFormatProps> = ({
  inputRef,
  onChange,
  name,
  ...other
}) => (
  <NumberFormat
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...other}
    isNumericString
    decimalSeparator=","
    allowNegative={false}
    getInputRef={inputRef}
    onValueChange={(values) => {
      onChange({
        target: { name, value: values.value },
      });
    }}
  />
);

export default NumberInputField;
