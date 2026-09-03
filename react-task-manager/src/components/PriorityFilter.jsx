const OPTIONS = ['All', 'High', 'Medium', 'Low'];

export default function PriorityFilter({ value, onChange }) {
  return (
    <div className="filter-group" aria-label="Filter tasks by priority">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={value === option ? 'filter-button active' : 'filter-button'}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
