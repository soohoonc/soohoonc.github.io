import React from 'react';

import { useTerminalState } from '@/app/providers';
import { getFormattedDate } from '@/lib/utils';

export const TerminalContent = () => {
  const { showWelcome, inputs, outputs } = useTerminalState();
  return (
    <div className='bg-transparent outline-none resize-none break-all' suppressHydrationWarning>
      {showWelcome && (
        <>
        <p suppressHydrationWarning>
          <a href="https://soohoonchoi.com" className="link">soohoonchoi</a> ({getFormattedDate()})<br />
          Type &quot;help&quot;, &quot;credits&quot; or &quot;license&quot; for more.
        </p>
        </>
      )}
      {inputs.map((input, index) => (
        <React.Fragment key={index}>
          <span>{`${input}`}</span>
          <span>{outputs[index]}</span>
        </React.Fragment>
      ))}
    </div>
  );
};
