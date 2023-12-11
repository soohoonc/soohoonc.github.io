import React from 'react'

import { getWelcomeMessage } from '@/lib/commands';
import { useTerminalState } from '@/app/providers'

export const TerminalContent = () => {
    const { showWelcome, inputs, outputs, prompt } = useTerminalState();
    return (
      <div className="bg-transparent outline-none resize-none break-all" suppressHydrationWarning>
        {showWelcome && <span>{getWelcomeMessage()}</span>}
        {inputs.map((input, index) => (
          <React.Fragment key={index}>
            <span>{`${prompt} ${input}`}</span>
            <span>
              {outputs[index]}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  }