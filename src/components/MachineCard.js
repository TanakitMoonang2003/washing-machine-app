import React from 'react';

const MachineCard = ({ machine, onInsertCoins, formatTime, customerCoins }) => {
  const isAvailable = machine.status === "ว่าง";
  const canUse = isAvailable && customerCoins >= 10;
  
  return (
    <div className={`machine-card ${isAvailable ? 'available' : 'busy'}`}>
      <div className="machine-header">
        <h2>{machine.name}</h2>
        <span className={`status-badge ${isAvailable ? 'status-available' : 'status-busy'}`}>
          {machine.status}
        </span>
      </div>
      
      {!isAvailable && (
        <div className="time-display">
          <div className="time-progress">
            <div 
              className="progress-bar"
              style={{ width: `${(machine.timeLeft / machine.originalTime) * 100}%` }}
            ></div>
          </div>
          <p>เวลาที่เหลือ: {formatTime(machine.timeLeft)}</p>
        </div>
      )}
      
      <div className="action-area">
        <button 
          onClick={() => onInsertCoins(machine.id)}
          disabled={!canUse}
          className={`coin-button ${canUse ? '' : 'disabled'}`}
        >
          <span className="coin-icon">🪙</span>
          หยอดเหรียญ (10 เหรียญ)
        </button>
      </div>
    </div>
  );
};

export default MachineCard;