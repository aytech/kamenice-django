import { GuestForm, Room } from "./lib/Types";

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
        type: "INHABITED"
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
        type: "ACCOMMODATED"
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
        type: "BINDING"
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
        type: "BINDING"
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
        type: "NONBINDING"
      }
    ]
  }
]

export const guests: GuestForm[] = [
  {
    address: {
      municipality: "Praha 8",
      psc: 18200,
      street: "Černého"
    },
    citizenship: { selected: "RU" },
    email: "oyapparov@gmail.com",
    gender: "M",
    id: 1,
    name: "Oleg",
    identity: "12345/8927",
    phone: "+420 12346789",
    surname: "Yapparov",
    visa: "123"
  },
  {
    address: {
      municipality: "Praha 8",
      psc: 18200,
      street: "Černého"
    },
    citizenship: { selected: "CZE" },
    email: "syapparov@gmail.com",
    gender: "M",
    id: 3,
    name: "Štěpán",
    identity: "12345/8927",
    phone: "+420 12346789",
    surname: "Yapparov",
    visa: "123"
  },
  {
    address: {
      municipality: "Praha 8",
      psc: 18200,
      street: "Černého"
    },
    citizenship: { selected: "CZE" },
    email: "a.yapik@gmail.com",
    gender: "F",
    id: 4,
    name: "Adéla",
    identity: "12345/8927",
    phone: "+420 12346789",
    surname: "Yapparov",
    visa: "123"
  }
]