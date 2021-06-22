import { Locale } from "react-modern-calendar-datepicker";

export const CsCalendarLocale: Locale = {
  months: [
    'Leden',
    'Únor',
    'Březen',
    'Duben',
    'Květen',
    'Červen',
    'Červenec',
    'Srpen',
    'Září',
    'Říjen',
    'Listopad',
    'Prosinec'
  ],
  weekDays: [
    {
      name: 'Neděle', // used for accessibility 
      short: 'Ned', // displayed at the top of days' rows
      isWeekend: true, // is it a formal weekend or not?
    },
    {
      name: 'Pondělí',
      short: 'Pon',
    },
    {
      name: 'Úterý',
      short: 'Út',
    },
    {
      name: 'Středa',
      short: 'St',
    },
    {
      name: 'Čtvrtek',
      short: 'Čt',
    },
    {
      name: 'Pátek',
      short: 'Pá',
    },
    {
      name: 'Sobota',
      short: 'Sob',
      isWeekend: true,
    }
  ],
  weekStartingIndex: 0,
  // return a { year: number, month: number, day: number } object
  getToday(gregorainTodayObject) {
    return gregorainTodayObject;
  },
  // return a native JavaScript date here
  toNativeDate(date) {
    return new Date(date.year, date.month - 1, date.day);
  },
  // return a number for date's month length
  getMonthLength(date) {
    return new Date(date.year, date.month, 0).getDate();
  },
  // return a transformed digit to your locale
  transformDigit(digit) {
    return digit;
  },
  // texts in the date picker
  nextMonth: 'Příští Měsíc',
  previousMonth: 'Předchozí Měsíc',
  openMonthSelector: 'Otevřít Výběr Měsíce',
  openYearSelector: 'Otevřít Výběr Roku',
  closeMonthSelector: 'Zavřít Výběr Měsíce',
  closeYearSelector: 'Zavřít Výběr Roku',
  defaultPlaceholder: 'Vybrat...',
  // for input range value
  from: 'od',
  to: 'do',
  // used for input value when multi dates are selected
  digitSeparator: ',',
  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,
  // is your language rtl or ltr?
  isRtl: false
}