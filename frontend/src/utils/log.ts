import { LogFrontend } from '@app';

export const Log = (...args: string[]) => {
  // forces it to by synchronous
  LogFrontend(args.join(' ')).then(() => {});
};
