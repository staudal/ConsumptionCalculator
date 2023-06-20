export default function InputField({ onChange, label, type, name, placeholder, currency }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>}
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          className="w-96 block w-full rounded-md border-0 py-1.5 pl-4 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
          aria-describedby="price-currency"
          onChange={onChange}
          step=".01"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {currency}
          </span>
        </div>
      </div>
    </div>
  );
}
