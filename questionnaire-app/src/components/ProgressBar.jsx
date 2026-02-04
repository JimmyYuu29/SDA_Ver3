function ProgressBar({ steps, visibleSteps, currentStep, onStepClick }) {
  return (
    <div className="progress-bar">
      {steps.map((label, idx) => {
        const isVisible = visibleSteps.includes(idx)
        const isActive = currentStep === idx
        const isCompleted = visibleSteps.includes(idx) && visibleSteps.indexOf(idx) < visibleSteps.indexOf(currentStep)

        let className = 'progress-step-btn'
        if (!isVisible) className += ' hidden'
        else if (isActive) className += ' active'
        else if (isCompleted) className += ' completed'

        return (
          <div className="progress-step" key={idx}>
            {idx > 0 && (
              <div className={`progress-connector${isCompleted || isActive ? ' active' : ''}`} />
            )}
            <button
              className={className}
              onClick={() => isVisible && onStepClick(idx)}
              disabled={!isVisible}
            >
              {label}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ProgressBar
