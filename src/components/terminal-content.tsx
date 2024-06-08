import React, { useState, useEffect } from 'react';
import { useTerminalState } from '@/app/providers';

export const TerminalContent = () => {
  const { showWelcome, inputs, outputs } = useTerminalState();
  const getTime = () => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return `${formattedDate}, ${formattedTime}`;
  };
  const [currentTime, setCurrentTime] = useState(getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {showWelcome && (
        <>
          <p suppressHydrationWarning>
            <a href='https://soohoonchoi.com' className='link'>
              soohoonchoi
            </a>{' '}
            ({currentTime})<br />
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
    </>
  );
};
