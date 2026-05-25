import { create } from "zustand";

interface ReservationState {

  reservation: any;

  setReservation:
    (reservation: any) => void;

  clearReservation:
    () => void;
}

export const useReservationStore =
  create<ReservationState>((set: (arg0: { reservation: any; }) => any) => ({

    reservation: null,

    setReservation:
      (reservation: any) =>
        set({ reservation }),

    clearReservation:
      () =>
        set({
          reservation: null,
        }),
  }));