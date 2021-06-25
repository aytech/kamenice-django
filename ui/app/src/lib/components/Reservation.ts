export type ReservationType = "Závazná Rezervace" | "Nezávazná Rezervace" | "Aktuálně Ubytování" | "Obydlený Termín"
export type ReservationTypeKey = "binding" | "nonbinding" | "accommodated" | "inhabited"

export const Reservation = {
  getType: (key: ReservationTypeKey): ReservationType => {
    switch (key) {
      case "nonbinding":
        return "Nezávazná Rezervace"
      case "accommodated":
        return "Aktuálně Ubytování"
      case "inhabited":
        return "Obydlený Termín"
      case "binding":
      default: return "Závazná Rezervace"
    }
  }
}