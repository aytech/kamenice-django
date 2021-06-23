import { Day, DayRange, DayValue, Locale, utils } from "react-modern-calendar-datepicker";

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

const getDaysWithinMonth = (from: number, to: number, month: number, year: number): Day[] => {
  const days: Day[] = []
  for (let index = from; index <= to; index++) {
    days.push({ year: year, month: month, day: index })
  }
  return days
}

const getDaysWithinOverlappingMonths = (from: number, to: number, months: number[], year: number): Day[] => {
  const { getMonthLength } = utils("en")
  const days: Day[] = []
  months.forEach((month: number, index: number) => {
    if (index === 0) { // first month, get days till the end of the month
      getDaysWithinMonth(from, getMonthLength({ day: from, month, year }), month, year).forEach((day: Day) => days.push(day))
    } else if (index === months.length - 1) { // get days of te last month
      getDaysWithinMonth(1, to, month, year).forEach((day: Day) => days.push(day))
    } else { // get days of the intermediary month
      getDaysWithinMonth(1, getMonthLength({ day: 1, month, year }), month, year).forEach((day: Day) => days.push(day))
    }
  })
  return days
}

const getDaysWithinOverlappingYears = (from: number, to: number, fromMonth: number, toMonth: number, years: number[]) => {
  const { getMonthLength } = utils("en")
  const days: Day[] = []
  years.forEach((year: number, index: number) => {
    const months: number[] = []
    if (index === 0) { // get days from first year
      for (let idx = fromMonth; idx <= 12; idx++) {
        months.push(idx)
      }
      getDaysWithinOverlappingMonths(from, getMonthLength({ day: 1, month: 12, year }), months, year).forEach((day: Day) => days.push(day))
    } else if (index === years.length - 1) { // get days from last year
      for (let idx = 1; idx <= toMonth; idx++) {
        months.push(idx)
      }
      if (months.length > 1) {
        getDaysWithinOverlappingMonths(1, to, months, year).forEach((day: Day) => days.push(day))
      } else {
        getDaysWithinMonth(1, to, months[ 0 ], year).forEach((day: Day) => days.push(day))
      }
    } else { // get days from intermediary year
      const months = Array.from(Array(13).keys())
      months.shift()
      getDaysWithinOverlappingMonths(1, getMonthLength({ day: 1, month: 12, year }), months, year).forEach((day: Day) => days.push(day))
    }
  })
  return days
}

export const TransformDate = {
  getDaysFromRange: (range: DayRange): Day[] => {
    if (range.from === undefined || range.from === null || range.to === undefined || range.to === null) {
      return []
    }
    if (range.to.year === range.from.year) {
      // processing within same year
      if (range.to.month === range.from.month) {
        // processing within same month
        return getDaysWithinMonth(range.from.day, range.to.day, range.from.month, range.from.year)
      } else {
        // processing within overlapping months
        const months = []
        for (let index = range.from.month; index <= range.to.month; index++) {
          months.push(index)
        }
        return getDaysWithinOverlappingMonths(range.from.day, range.to.day, months, range.from.year)
      }
    } else {
      // processing within overlapping years
      const years = []
      for (let index = range.from.year; index <= range.to.year; index++) {
        years.push(index)
      }
      return getDaysWithinOverlappingYears(range.from.day, range.to.day, range.from.month, range.to.month, years)
    }
  },
  toLocaleString: (day: DayValue, defaultValue: string) => {
    if (day === undefined || day === null) {
      return defaultValue
    }
    return `${ day?.day } ${ CsCalendarLocale.months[ day.month - 1 ] } ${ day.year }`
  }
}
