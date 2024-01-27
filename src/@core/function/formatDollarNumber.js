import React from 'react';
import { NumericFormat } from 'react-number-format';

export function NumberDollarValueFormat({ value }) {
  return (
    <NumericFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      prefix={'\$'}
     />
  );
}
