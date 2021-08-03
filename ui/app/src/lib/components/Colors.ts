import { ReservationTypeKey } from "../Types"

interface Props {
  colors: string[]
  getRandomColor: () => string
  getReservationColor: (reservationType: ReservationTypeKey) => string
}

export const Colors: Props = {
  colors: [
    "#f5222d", // red
    "#fa541c", // volcano
    "#fa8c16", // orange
    "#faad14", // gold
    "#fadb14", // yellow
    "#a0d911", // lime
    "#52c41a", // green
    "#13c2c2", // cyan
    "#1890ff", // blue
    "#2f54eb", // geekblue
    "#722ed1", // purple
    "#eb2f96", // magenta
  ],
  getRandomColor: () => {
    return Colors.colors[ Math.floor(Math.random() * Colors.colors.length) ]
  },
  getReservationColor: (reservationType: ReservationTypeKey): string => {
    switch (reservationType) {
      case "NONBINDING":
        return "rgb(254, 223, 3)"
      case "ACCOMMODATED":
        return "rgb(0, 133, 182)"
      case "INHABITED":
        return "rgb(254, 127, 45)"
      case "BINDING":
      default: return "rgb(0, 212, 157)"
    }
  }
}