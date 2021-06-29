import { Room } from "./lib/components/Room";

export const rooms: Room[] = [
  {
    id: 1,
    name: "Apartman 2 + 2",
    reservedRanges: [
      {
        id: 1,
        from: {
          year: 2021,
          month: 6,
          day: 1,
          hour: 14,
          minute: 0
        },
        to: {
          year: 2021,
          month: 6,
          day: 5
        },
        type: "inhabited"
      },
      {
        id: 2,
        from: {
          year: 2021,
          month: 6,
          day: 14,
          hour: 15,
          minute: 30
        },
        to: {
          year: 2021,
          month: 6,
          day: 18,
          hour: 14,
          minute: 15
        },
        type: "accommodated"
      },
      {
        id: 3,
        from: {
          year: 2021,
          month: 6,
          day: 28,
          hour: 14,
          minute: 0
        },
        to: {
          year: 2021,
          month: 6,
          day: 30,
          hour: 14,
          minute: 30
        },
        type: "binding"
      },
    ]
  },
  {
    id: 2,
    name: "Apartman 2 + 4",
    reservedRanges: [
      {
        id: 4,
        from: {
          year: 2021,
          month: 6,
          day: 7,
          hour: 18,
          minute: 15
        },
        to: {
          year: 2021,
          month: 6,
          day: 11,
          hour: 14,
          minute: 0
        },
        type: "binding"
      },
      {
        id: 5,
        from: {
          year: 2021,
          month: 6,
          day: 23,
          hour: 10,
          minute: 0
        },
        to: {
          year: 2021,
          month: 6,
          day: 25,
          hour: 14,
          minute: 0
        },
        type: "nonbinding"
      }
    ]
  }
]