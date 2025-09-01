import moment from 'moment-timezone';
import logger from '../utils/logger';

export const formatTimeForDisplay = (timestamp: number): string => {
  try {
    const timezone = process.env.TIMEZONE || 'Asia/Kolkata';
    return moment(timestamp).tz(timezone).format('YYYY-MM-DD HH:mm:ss z');
  } catch (error) {
    logger.error('Error formatting time for display', { error });
    return new Date(timestamp).toISOString();
  }
};

export const getCurrentTime = (): string => {
  try {
    const timezone = process.env.TIMEZONE || 'Asia/Kolkata';
    const now = moment().tz(timezone);
    return now.format('YYYY-MM-DD HH:mm:ss z');
  } catch (error) {
    logger.error('Error getting current time', { error });
    return new Date().toISOString();
  }
};

export const getStatus = () => {
  try {
    const timezone = process.env.TIMEZONE || 'Asia/Kolkata';
    const now = moment().tz(timezone);
    
    return {
      currentTime: now.format('YYYY-MM-DD HH:mm:ss z'),
      timezone: timezone,
      ready: true,
      mode: 'on-demand'
    };

  } catch (error) {
    logger.error('Error getting status', { error });
    return {
      error: 'Failed to get status',
      currentTime: new Date().toISOString(),
      ready: false,
      mode: 'on-demand'
    };
  }
};