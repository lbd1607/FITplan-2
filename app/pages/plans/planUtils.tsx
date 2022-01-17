export const DayOfWeek = {
  Monday: {
    dayName: "Monday",
    abbr: "M",
    key: "1",
    ref: "mon",
  },
  Tuesday: {
    dayName: "Tuesday",
    abbr: "Tu",
    key: "2",
    ref: "tue",
  },
  Wednesday: {
    dayName: "Wednesday",
    abbr: "W",
    key: "3",
    ref: "wed",
  },
  Thursday: {
    dayName: "Thursday",
    abbr: "Th",
    key: "4",
    ref: "thu",
  },
  Friday: {
    dayName: "Friday",
    abbr: "F",
    key: "5",
    ref: "fri",
  },
  Saturday: {
    dayName: "Saturday",
    abbr: "Sa",
    key: "6",
    ref: "sat",
  },
  Sunday: {
    dayName: "Sunday",
    abbr: "Su",
    key: "7",
    ref: "sun",
  },
} as const

export const getDayChip = (days) => {
  switch (days) {
    case DayOfWeek.Monday.dayName:
      return (
        <div className="daysChip daySelected daysChipSm" key={DayOfWeek.Monday.key}>
          {DayOfWeek.Monday.abbr}
        </div>
      )
    case DayOfWeek.Tuesday.dayName:
      return (
        <div className="daysChip daySelected daysChipSm" key={DayOfWeek.Tuesday.key}>
          {DayOfWeek.Tuesday.abbr}
        </div>
      )
    case DayOfWeek.Wednesday.dayName:
      return (
        <div className="daysChip daySelected daysChipSm" key={DayOfWeek.Wednesday.key}>
          {DayOfWeek.Wednesday.abbr}
        </div>
      )
    case DayOfWeek.Thursday.dayName:
      return (
        <div className="daysChip daySelected daysChipSm" key={DayOfWeek.Thursday.key}>
          {DayOfWeek.Thursday.abbr}
        </div>
      )
    case DayOfWeek.Friday.dayName:
      return (
        <div className="daysChip daySelected daysChipSm" key={DayOfWeek.Friday.key}>
          {DayOfWeek.Friday.abbr}
        </div>
      )
    case DayOfWeek.Saturday.dayName:
      return (
        <div className="daysChip daySelected daysChipSm" key={DayOfWeek.Saturday.key}>
          {DayOfWeek.Saturday.abbr}
        </div>
      )
    case DayOfWeek.Sunday.dayName:
      return (
        <div className="daysChip daySelected daysChipSm" key={DayOfWeek.Sunday.key}>
          {DayOfWeek.Sunday.abbr}
        </div>
      )
    default:
      break
  }
}

export enum GroupName {
  UNASSIGNED = "Unassigned",
  WEEK1 = "Week 1",
  WEEK2 = "Week 2",
  WEEK3 = "Week 3",
  WEEK4 = "Week 4",
}
