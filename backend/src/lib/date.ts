import moment from 'moment-timezone';

export function convertToUTC(dateString: string | undefined, timeString: string | undefined, timeZone: string): Date {
  if (!dateString || !timeString) {
      throw new Error("Date and time are required");
  }
  const formattedTime = timeString.padStart(5, '0');
  const dateTimeStr = `${dateString}T${formattedTime}:00`;
  const date = new Date(dateTimeStr);
  const tzOffset = moment.tz(dateTimeStr, timeZone).utcOffset();
  const utcDate = new Date(date.getTime() - (tzOffset * 60000));
  return utcDate;
}