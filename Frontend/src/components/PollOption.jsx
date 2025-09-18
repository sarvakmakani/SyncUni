// components/PollOption.jsx
export default function PollOption({ value, onChange, onRemove, showRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Option text"
        className="flex-1 p-2 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-400 text-black"
        >
          Remove
        </button>
      )}
    </div>
  );
}
