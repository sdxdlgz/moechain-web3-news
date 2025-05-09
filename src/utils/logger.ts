import log from 'loglevel';
import chalk from 'chalk';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

log.setLevel(LOG_LEVEL as log.LogLevelDesc);

const styles = {
  debug: chalk.blue,
  info: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
  success: chalk.green,
  important: chalk.magenta,
  progress: chalk.cyan,
};

const getTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const prefix = (level: string) => {
  const time = getTime();
  const colorFn = styles[level as keyof typeof styles] || chalk.white;
  return colorFn(`[${time}][${level.toUpperCase()}]`);
};

const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  
  return function (...args) {
    const logPrefix = prefix(methodName);
    rawMethod(logPrefix, ...args);
  };
};

log.setLevel(log.getLevel());

const logger = {
  ...log,
  
  success: function(...args: any[]) {
    const successPrefix = styles.success(`[${getTime()}][SUCCESS]`);
    console.log(successPrefix, ...args);
  },
  
  important: function(...args: any[]) {
    const importantPrefix = styles.important(`[${getTime()}][IMPORTANT]`);
    console.log(importantPrefix, ...args);
  },
  
  groupStart: function(label: string) {
    const groupPrefix = styles.progress(`[${getTime()}][GROUP]`);
    console.group(`${groupPrefix} ${label}`);
  },
  
  groupEnd: function() {
    console.groupEnd();
  },
  
  progress: function(message: string, percent: number) {
    const progressPrefix = styles.progress(`[${getTime()}][PROGRESS]`);
    const progressBar = generateProgressBar(percent);
    console.log(progressPrefix, `${message} ${progressBar} ${Math.round(percent)}%`);
  }
};

function generateProgressBar(percent: number): string {
  const width = 20;
  const complete = Math.round((percent / 100) * width);
  const incomplete = width - complete;
  
  return '[' + '='.repeat(complete) + ' '.repeat(incomplete) + ']';
}

export default logger; 