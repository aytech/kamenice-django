import { ReservationTypeKey } from "../Types"

interface Props {
  colors: any
  getDefaultColor: () => string
  getRandomColor: () => string
  getReservationColor: (reservationType?: ReservationTypeKey) => string
  getResizeHandlerColor: (reservationType?: ReservationTypeKey) => string
}

export const Colors: Props = {
  colors: {
    blue: "#1890ff",
    cyan: "#13c2c2",
    darkcyan: "#0e9494",
    darkpink: "#8c0e53",
    geekblue: "#2f54eb",
    gold: "#faad14",
    green: "#52c41a",
    lime: "#a0d911",
    magenta: "#eb2f96",
    orange: "#fa8c16",
    purple: "#722ed1",
    red: "#f5222d",
    silver: "#bdc3c7",
    strongblue: "#0069cb",
    strongorange: "#d87205",
    strongyellow: "#d6bb06",
    volcano: "#fa541c",
    yellow: "#fadb14"
  },
  getDefaultColor: () => '#cccccc',
  getRandomColor: () => {
    return Colors.colors[ Math.floor(Math.random() * Colors.colors.length) ]
  },
  getReservationColor: (reservationType?: ReservationTypeKey): string => {
    switch (reservationType) {
      case "NONBINDING":
        return Colors.colors.yellow
      case "ACCOMMODATED":
        return Colors.colors.blue
      case "INHABITED":
        return Colors.colors.orange
      case "INQUIRY":
        return Colors.colors.silver
      case "SELECTED":
        return Colors.colors.magenta
      case "BINDING":
      default: return Colors.colors.cyan
    }
  },
  getResizeHandlerColor: (reservationType?: ReservationTypeKey): string => {
    if (reservationType === "SELECTED") {
      return Colors.colors.darkpink
    }
    return "transparent"
  }
}