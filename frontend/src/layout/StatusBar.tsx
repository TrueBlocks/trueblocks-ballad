import { useEffect, useState } from 'react';

import { useEvent } from '@hooks';
import { msgs } from '@models';

import './StatusBar.css';

export const StatusBar = () => {
  const [status, setStatus] = useState('');
  const [visible, setVisible] = useState(false);
  const [cn, setCn] = useState('okay');

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
      <span>{status}</span>
    </div>
  );
};
