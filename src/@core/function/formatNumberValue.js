import React from 'react';
import { NumericFormat } from 'react-number-format';

export function NumberValueFormat({ value }) {
  return (
    <NumericFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      prefix={'\u20A6'}
     />
  );
}
