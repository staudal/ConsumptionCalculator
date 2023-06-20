export default function ModalButton({ label, text, handleClick }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>}
      <button type="button" onClick={handleClick} className="w-full mt-2 bg-indigo-500 text-white rounded-md px-3 py-2 hover:bg-indigo-600">
        {text}
      </button>
    </div>
  );
}
