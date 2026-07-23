import { useMemo, useState } from "react";
import { Minus, Plus, Users, X } from "lucide-react";

type PassengerType =
  | "adult"
  | "youth"
  | "child"
  | "infantLap"
  | "infantSeat";

interface Passenger {
  key: PassengerType;
  label: string;
  age: string;
}

const passengerTypes: Passenger[] = [
  {
    key: "adult",
    label: "Adult",
    age: "16+",
  },
  {
    key: "youth",
    label: "Youth",
    age: "12-15",
  },
  {
    key: "child",
    label: "Child",
    age: "2-11",
  },
  {
    key: "infantLap",
    label: "Infant (on lap)",
    age: "Under 2",
  },
  {
    key: "infantSeat",
    label: "Infant (in seat)",
    age: "Under 2",
  },
];

export default function PassengerPopup() {
  const [open, setOpen] = useState(true);

  const [count, setCount] = useState({
    adult: 1,
    youth: 0,
    child: 0,
    infantLap: 0,
    infantSeat: 0,
  });

  const totalPassengers = useMemo(() => {
    return (
      count.adult +
      count.youth +
      count.child +
      count.infantLap +
      count.infantSeat
    );
  }, [count]);

  const totalInfants = useMemo(() => {
    return count.infantLap + count.infantSeat;
  }, [count]);

  const increase = (key: PassengerType) => {
    setCount((prev) => {
      const total =
        prev.adult +
        prev.youth +
        prev.child +
        prev.infantLap +
        prev.infantSeat;

      // Max passengers = 9
      if (total >= 9) {
        alert("Maximum 9 passengers are allowed.");
        return prev;
      }

      const updated = {
        ...prev,
        [key]: prev[key] + 1,
      };

      // Infants cannot exceed adults
      const infants =
        updated.infantLap + updated.infantSeat;

      if (infants > updated.adult) {
        alert("Total infants cannot be greater than total adults.");
        return prev;
      }

      return updated;
    });
  };

  const decrease = (key: PassengerType) => {
    setCount((prev) => {
      if (key === "adult" && prev.adult === 1) {
        return prev;
      }

      if (prev[key] === 0) {
        return prev;
      }

      const updated = {
        ...prev,
        [key]: prev[key] - 1,
      };

      // If adults decrease below infant count
      let infants =
        updated.infantLap + updated.infantSeat;

      while (infants > updated.adult) {
        if (updated.infantSeat > 0) {
          updated.infantSeat--;
        } else if (updated.infantLap > 0) {
          updated.infantLap--;
        }

        infants =
          updated.infantLap + updated.infantSeat;
      }

      return updated;
    });
  };

  return (
    <div className="flex items-start">
      <div className="relative">
        {/* Trigger */}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 shadow-sm"
        >
          <Users size={18} />
          <span>{totalPassengers} Passenger(s)</span>
        </button>

        {/* Popup */}

        {open && (
          <div className="absolute left-0 mt-3 w-[270px] rounded border border-gray-300 bg-white shadow-xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-xl font-normal text-slate-700">
                Travelers
              </h2>

              <button type="button" onClick={() => setOpen(false)}>
                <X
                  size={22}
                  className="text-slate-600 hover:text-black"
                />
              </button>
            </div>

            {/* Body */}

            <div className="space-y-4 p-4">
              {passengerTypes.map((item) => (
                <div key={item.key}>
                  <div className="mb-2 text-[16px] text-gray-700">
                    {item.label}{" "}
                    <span className="text-gray-500">
                      {item.age}
                    </span>
                  </div>

                  <div className="flex h-10 overflow-hidden border border-gray-300">
                    {/* Minus */}

                    <button
                        type="button"
                      onClick={() => decrease(item.key)}
                      disabled={
                        item.key === "adult"
                          ? count.adult === 1
                          : count[item.key] === 0
                      }
                      className="flex w-10 items-center justify-center border-r hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                    >
                      <Minus size={15} />
                    </button>

                    {/* Value */}

                    <div className="flex flex-1 items-center justify-center text-lg">
                      {count[item.key]}
                    </div>

                    {/* Plus */}

                    <button
                        type="button"
                      onClick={() => increase(item.key)}
                      disabled={
                        totalPassengers >= 9 ||
                        ((item.key === "infantLap" ||
                          item.key === "infantSeat") &&
                          totalInfants >= count.adult)
                      }
                      className="flex w-10 items-center justify-center border-l hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}

            {/* <div className="border-t bg-gray-50 p-3 text-center text-sm text-gray-600">
              <div>Total Passengers : {totalPassengers} / 9</div>
              <div>Total Infants : {totalInfants}</div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}