import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);

const timeConverter = (time: string, formatStyle: string) => {
  return dayjs.utc(time).tz('Asia/Seoul').format(formatStyle);
};

export default timeConverter;
