import { useEffect, useState } from 'react';

import { useEvent } from '@hooks';
import { ActionIcon } from '@mantine/core';
import { msgs } from '@models';
import { BiCopy } from 'react-icons/bi';

import './StatusBar.css';

export const StatusBar = () => {
  const [status, setStatus] = useState('');
  const [visible, setVisible] = useState(false);
  const [cn, setCn] = useState('okay');

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(status);
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
    }
  };

  useEvent(msgs.EventType.STATUS, (message: string) => {
    if (cn === 'error' && visible) return;
    setCn('okay');
    setStatus(message);
    setVisible(true);
  });

  useEvent(msgs.EventType.ERROR, (message: string) => {
    setCn('error');
    setStatus(message);
    setVisible(true);
  });

  useEffect(() => {
    if (!visible) return;
    const timeout = cn === 'error' ? 8000 : 1500;
    const timer = setTimeout(() => {
      setVisible(false);
    }, timeout);
    return () => clearTimeout(timer);
  }, [visible, status, cn]);

  if (!visible) return null;

  return (
    <div className={cn}>
      {cn === 'error' && (
        <ActionIcon
          size="xs"
          variant="subtle"
          onClick={handleCopyToClipboard}
          style={{ marginRight: '8px' }}
          aria-label="Copy error message"
        >
          <BiCopy size={12} />
        </ActionIcon>
      )}
      <span>{status}</span>
    </div>
  );
};
