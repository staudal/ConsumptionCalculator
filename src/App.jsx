import React, { useEffect, useState } from "react";
import InputField from "./components/InputField";
import Combobox from "./components/ComboBox";
import { createClient } from "@supabase/supabase-js";
import ModalButton from "./components/ModalButton";
import Modal from "./components/Modal";

// Create a single supabase client for interacting with your database
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

export default function App() {
  const [fossilModal, setFossilModal] = useState(false);
  const [electricModal, setElectricModal] = useState(false);
  const [fossilCars, setFossilCars] = useState([]);
  const [electricCars, setElectricCars] = useState([]);
  const [selectedFossilCar, setSelectedFossilCar] = useState(null);
  const [selectedElectricCar, setSelectedElectricCar] = useState(null);
  const [kilometers, setKilometers] = useState(0);
  const [fuelPrice, setFuelPrice] = useState(0);
  const [electricityPrice, setElectricityPrice] = useState(0);
  const [result, setResult] = useState(false);
  const [resultData, setResultData] = useState({
    fossil: 0,
    electric: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    let fossilCars = await getFossilCars();
    let electricCars = await getElectricCars();

    setFossilCars(fossilCars);
    setElectricCars(electricCars);
  }

  async function getElectricCars() {
    let { data: electricCars } = await supabase.from("cars").select("*").eq("type", "electric");

    electricCars.forEach((car) => {
      car["name"] = `${car.make} ${car.model} ${car.variant}`;
    });

    return electricCars;
  }

  async function getFossilCars() {
    let { data: fossilCars } = await supabase.from("cars").select("*").eq("type", "fossil");

    fossilCars.forEach((car) => {
      car["name"] = `${car.make} ${car.model} ${car.variant}`;
    });

    return fossilCars;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setResultData({
      fossil: calculateFossil(),
      electric: calculateElectric(),
    });
    setResult(true);
  }

  function calculateFossil() {
    let fuelCost = selectedFossilCar.consumption * fuelPrice * kilometers;
    return fuelCost;
  }

  function calculateElectric() {
    let electricityCost = selectedElectricCar.consumption * electricityPrice * kilometers;
    return electricityCost;
  }

  const formatter = new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
  });

  function handleChange(event) {
    switch (event.target.name) {
      case "kilometers":
        setKilometers(event.target.value);
        break;
      case "fuelPrice":
        setFuelPrice(event.target.value);
        break;
      case "electricityPrice":
        setElectricityPrice(event.target.value);
        break;
      default:
        break;
    }
  }

  function handleChangeCar(type) {
    if (type === "fossil") {
      setFossilModal(true);
    } else {
      setElectricModal(true);
    }
  }

  return (
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 flex h-full mx-auto">
      <form onSubmit={handleSubmit} className="flex mx-auto">
        <div className="m-auto space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {selectedFossilCar ? (
              <div
                onClick={() => handleChangeCar("fossil")}
                className="cursor-pointer w-full mt-2 bg-gray-100 rounded-md px-3 py-2 text-center flex flex-col items-center hover:bg-gray-200"
              >
                <span className="font-bold w-full">
                  {selectedFossilCar.make} {selectedFossilCar.model}
                </span>
                <span>{selectedFossilCar.variant}</span>
              </div>
            ) : (
              <ModalButton handleClick={() => setFossilModal(true)} text="Tilføj bil" label="Fossilbil" />
            )}
            {selectedElectricCar ? (
              <div
                onClick={() => handleChangeCar("electric")}
                className="cursor-pointer w-full mt-2 bg-gray-100 rounded-md px-3 py-2 text-center flex flex-col items-center hover:bg-gray-200"
              >
                <span className="font-bold w-full">
                  {selectedElectricCar.make} {selectedElectricCar.model}
                </span>
                <span>{selectedElectricCar.variant}</span>
              </div>
            ) : (
              <ModalButton handleClick={() => setElectricModal(true)} text="Tilføj bil" label="Elbil" />
            )}
          </div>
          <div>
            <InputField onChange={handleChange} name="kilometers" label="Antal kilometer" placeholder="100" type="number" currency="km" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <InputField onChange={handleChange} label="Pris pr. liter" name="fuelPrice" placeholder="14.19" type="number" currency="kr." />
            <InputField onChange={handleChange} label="Pris pr. kWh" name="electricityPrice" placeholder="2.25" type="number" currency="kr." />
          </div>
          <div>
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 px-3 py-2 text-white rounded-md w-full">
              Beregn
            </button>
          </div>

          {result && resultData.fossil < resultData.electric && (
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full mt-2 bg-green-300 rounded-md px-3 py-2 text-center flex flex-col items-center">
                <span className="font-bold w-full">Fossilbil</span>
                <span>{formatter.format(resultData.fossil)}</span>
              </div>
              <div className="w-full mt-2 bg-red-300 rounded-md px-3 py-2 text-center flex flex-col items-center">
                <span className="font-bold w-full">Elbil</span>
                <span>{formatter.format(resultData.electric)}</span>
              </div>
            </div>
          )}

          {result && resultData.fossil > resultData.electric && (
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full mt-2 bg-red-300 rounded-md px-3 py-2 text-center flex flex-col items-center">
                <span className="font-bold w-full">Fossilbil</span>
                <span>{formatter.format(resultData.fossil)}</span>
              </div>
              <div className="w-full mt-2 bg-green-300 rounded-md px-3 py-2 text-center flex flex-col items-center">
                <span className="font-bold w-full">Elbil</span>
                <span>{formatter.format(resultData.electric)}</span>
              </div>
            </div>
          )}

          <p className="text-center text-gray-500">
            Husk at klikke <span className="italic">beregn</span> ved ændringer i ovenstående felter.
          </p>
        </div>
      </form>
      <Modal setSelected={setSelectedFossilCar} cars={fossilCars} open={fossilModal} setOpen={setFossilModal} />
      <Modal setSelected={setSelectedElectricCar} cars={electricCars} open={electricModal} setOpen={setElectricModal} />
    </div>
  );
}
