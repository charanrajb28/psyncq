type LogLevel = 'info' | 'warn' | 'error';

type LogDetails = Record<string, string | number | boolean | null | undefined>;

const write = (level: LogLevel, event: string, details: LogDetails = {}): void => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.info(line);
};

export const logInfo = (event: string, details?: LogDetails): void => write('info', event, details);
export const logWarn = (event: string, details?: LogDetails): void => write('warn', event, details);
export const logError = (event: string, details?: LogDetails): void => write('error', event, details);
