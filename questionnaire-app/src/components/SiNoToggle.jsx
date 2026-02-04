function SiNoToggle({ value, onChange }) {
  return (
    <div className="toggle-group">
      <button
        type="button"
        className={`toggle-btn${value === 'SI' ? ' selected-si' : ''}`}
        onClick={() => onChange(value === 'SI' ? '' : 'SI')}
      >
        SI
      </button>
      <button
        type="button"
        className={`toggle-btn${value === 'NO' ? ' selected-no' : ''}`}
        onClick={() => onChange(value === 'NO' ? '' : 'NO')}
      >
        NO
      </button>
    </div>
  )
}

export default SiNoToggle
