"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

export default function CheckoutPage() {

  //////////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////////

  const [reservation, setReservation] =
    useState<any>(null);

  const [timeLeft, setTimeLeft] =
    useState("00:00");

  //////////////////////////////////////////////////////
  // LOAD RESERVATION
  //////////////////////////////////////////////////////

  useEffect(() => {

    const stored =

      localStorage.getItem(
        "reservation"
      );

    if (!stored) {

      window.location.assign(
        "/inventory"
      );

      return;
    }

    const parsed =
      JSON.parse(stored);

    console.log(
        "PARSED STOAGE:",
        parsed
      );

    setReservation(parsed.reservation);

  }, []);

  //////////////////////////////////////////////////////
  // LIVE TIMER
  //////////////////////////////////////////////////////

  useEffect(() => {

    if (!reservation) return;

    const interval =
      setInterval(() => {

        const now =
          new Date().getTime();

        const expiry =
          new Date(
            reservation.expiresAt
          ).getTime();

        const difference =
          expiry - now;

        //////////////////////////////////////////////////
        // EXPIRED
        //////////////////////////////////////////////////

        if (difference <= 0) {

          clearInterval(interval);

          setTimeLeft(
            "00:00"
          );

          toast.error(
            "Reservation expired"
          );

          localStorage.removeItem(
            "reservation"
          );

          setTimeout(() => {

            window.location.assign(
              "/inventory"
            );

          }, 1500);

          return;
        }

        //////////////////////////////////////////////////
        // MINUTES
        //////////////////////////////////////////////////

        const minutes =
          Math.floor(
            difference /
            1000 /
            60
          );

        //////////////////////////////////////////////////
        // SECONDS
        //////////////////////////////////////////////////

        const seconds =
          Math.floor(
            (difference / 1000) % 60
          );

        //////////////////////////////////////////////////
        // FORMAT
        //////////////////////////////////////////////////

        const formatted =

          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        setTimeLeft(
          formatted
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, [reservation]);

  //////////////////////////////////////////////////////
  // CONFIRM PURCHASE
  //////////////////////////////////////////////////////

  const confirmPurchase =
    async () => {

      try {

        const res =
          await fetch(

            `/api/reservations/${reservation.id}/confirm`,

            {
              method: "POST",
            }
          );

        const data =
          await res.json();

        //////////////////////////////////////////////////
        // 410
        //////////////////////////////////////////////////

        if (
          res.status === 410
        ) {

          toast.error(
            data.message
          );

          return;
        }

        //////////////////////////////////////////////////
        // ERROR
        //////////////////////////////////////////////////

        if (!res.ok) {

          toast.error(
            data.message
          );

          return;
        }

        //////////////////////////////////////////////////
        // SUCCESS
        //////////////////////////////////////////////////

        toast.success(
          "Purchase confirmed"
        );

        localStorage.removeItem(
          "reservation"
        );

        setTimeout(() => {

          window.location.assign(
            "/inventory"
          );

        }, 1500);

      } catch (error) {

        console.log(error);

        toast.error(
          "Confirmation failed"
        );
      }
    };

  //////////////////////////////////////////////////////
  // CANCEL
  //////////////////////////////////////////////////////

  const cancelReservation =
    async () => {

      try {

        const res =
          await fetch(

            `/api/reservations/${reservation.id}/release`,

            {
              method: "POST",
            }
          );

        const data =
          await res.json();

        //////////////////////////////////////////////////
        // ERROR
        //////////////////////////////////////////////////

        if (!res.ok) {

          toast.error(
            data.message
          );

          return;
        }

        //////////////////////////////////////////////////
        // SUCCESS
        //////////////////////////////////////////////////

        toast.success(
          "Reservation cancelled"
        );

        localStorage.removeItem(
          "reservation"
        );

        setTimeout(() => {

          window.location.assign(
            "/inventory"
          );

        }, 1500);

      } catch (error) {

        console.log(error);

        toast.error(
          "Cancellation failed"
        );
      }
    };

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////

  if (!reservation) {

    return (

      <div className="h-screen flex items-center justify-center text-3xl font-bold">

        Loading...

      </div>
    );
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white rounded-3xl shadow-xl p-10 w-[500px]">

        <h1 className="text-5xl font-bold mb-10">

          Checkout

        </h1>

        <div className="space-y-5">

          <div>

            <span className="font-semibold">

              Reservation ID:

            </span>

            <p>
              {reservation.id}
            </p>

          </div>

          <div>

            <span className="font-semibold">

              Reserved Quantity:

            </span>

            <p>
              {reservation.quantity}
            </p>

          </div>

          <div>

            <span className="font-semibold">

              Available Stock Left:

            </span>

            <p>
              {reservation.availableStockLeft}
            </p>

          </div>

          <div>

            <span className="font-semibold">

              Status:

            </span>

            <p>
              {reservation.status}
            </p>

          </div>

          <div>

            <span className="font-semibold">

              Time Remaining:

            </span>

            <p className="text-red-500 text-5xl font-bold mt-2">

              {timeLeft}

            </p>

          </div>

        </div>

        <div className="flex gap-5 mt-10">

          <button
            onClick={
              confirmPurchase
            }
            className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl"
          >

            Confirm Purchase

          </button>

          <button
            onClick={
              cancelReservation
            }
            className="flex-1 bg-red-600 text-white py-4 rounded-2xl"
          >

            Cancel

          </button>

        </div>

      </div>

    </div>
  );
}