import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://tayzexblewwyfyzkskln.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheXpleGJsZXd3eWZ5emtza2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcyNDIwNDYsImV4cCI6MjAwMjgxODA0Nn0.Z3-xdQyEOZHiV5rSF-qH-BPOUzTkHvUq-xjt3Sijj-4"
);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComboBox({ label, list, selected, setSelected }) {
  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? list
      : list.filter((car) => {
          return car.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" className="flex gap-4 items-center" value={selected} onChange={setSelected}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">{label}</Combobox.Label>
      <div className="relative w-full">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(car) => car?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredList.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-visible rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredList.map((car) => (
              <Combobox.Option
                key={car.id}
                value={car}
                className={({ active }) =>
                  classNames("relative cursor-default select-none py-2 pl-3 pr-9", active ? "bg-indigo-600 text-white" : "text-gray-900")
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <img src={car.image} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                      <span className={classNames("ml-3 truncate", selected && "font-semibold")}>{car.name}</span>
                    </div>

                    {selected && (
                      <span className={classNames("absolute inset-y-0 right-0 flex items-center pr-4", active ? "text-white" : "text-indigo-600")}>
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
