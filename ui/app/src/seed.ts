import { Guest, Room } from "./lib/Types";

export const rooms: Room[] = [
  {
    id: 1,
    name: "Apartman 2 + 2",
    reservedRanges: [
      {
        id: 1,
        from: {
          year: 2021,
          month: 7,
          day: 1,
          hour: 14,
          minute: 0
        },
        to: {
          year: 2021,
          month: 7,
          day: 5
        },
        type: "inhabited"
      },
      {
        id: 2,
        from: {
          year: 2021,
          month: 7,
          day: 14,
          hour: 15,
          minute: 30
        },
        to: {
          year: 2021,
          month: 7,
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
          month: 7,
          day: 28,
          hour: 14,
          minute: 0
        },
        to: {
          year: 2021,
          month: 7,
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
          month: 7,
          day: 7,
          hour: 18,
          minute: 15
        },
        to: {
          year: 2021,
          month: 7,
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
          month: 7,
          day: 23,
          hour: 10,
          minute: 0
        },
        to: {
          year: 2021,
          month: 7,
          day: 25,
          hour: 14,
          minute: 0
        },
        type: "nonbinding"
      }
    ]
  }
]

export const guests: Guest[] = [
  {
    address: {
      obec: "Praha 8",
      psc: 18200,
      street: "Černého"
    },
    citizenship: "CZE",
    email: "oyapparov@gmail.com",
    gender: "male",
    id: 1,
    name: "Oleg",
    obcanka: "12345/8927",
    phone: {
      code: 420,
      number: 12346789
    },
    surname: "Yapparov",
    visa: "123"
  },
  {
    address: {
      obec: "Praha 8",
      psc: 18200,
      street: "Černého"
    },
    citizenship: "CZE",
    email: "ayapparov@gmail.com",
    gender: "female",
    id: 2,
    name: "Alice",
    obcanka: "12345/8927",
    phone: {
      code: 420,
      number: 12346789
    },
    surname: "Ambrozova",
    visa: "123"
  },
  {
    address: {
      obec: "Praha 8",
      psc: 18200,
      street: "Černého"
    },
    citizenship: "CZE",
    email: "syapparov@gmail.com",
    gender: "male",
    id: 3,
    name: "Štěpán",
    obcanka: "12345/8927",
    phone: {
      code: 420,
      number: 12346789
    },
    surname: "Yapparov",
    visa: "123"
  },
  {
    address: {
      obec: "Praha 8",
      psc: 18200,
      street: "Černého"
    },
    citizenship: "CZE",
    email: "a.yapik@gmail.com",
    gender: "female",
    id: 4,
    name: "Adéla",
    obcanka: "12345/8927",
    phone: {
      code: 420,
      number: 12346789
    },
    surname: "Yapparov",
    visa: "123"
  }
]