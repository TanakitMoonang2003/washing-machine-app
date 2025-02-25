import React, { useState } from 'react';

const CustomerSelector = ({ customers, selectedCustomer, onSelectCustomer, onTopUp }) => {
  const currentCustomer = customers.find(c => c.id === selectedCustomer);
  const [topUpAmount, setTopUpAmount] = useState(10); // ค่าเติมเหรียญเริ่มต้น 10 เหรียญ

  return (
    <div className="customer-selector">
      <h2>เลือกลูกค้า</h2>
      <div className="selector-content">
        <select 
          value={selectedCustomer} 
          onChange={(e) => onSelectCustomer(parseInt(e.target.value))}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - เหรียญ: {customer.coins}
            </option>
          ))}
        </select>
        <div className="coin-display">
          <span className="coin-icon">🪙</span>
          <span className="coin-count">{currentCustomer?.coins || 0}</span>
        </div>
      </div>

      {/* 🆕 ส่วนเติมเหรียญ */}
      <div className="top-up-section">
        <input 
          type="number" 
          min="1"
          value={topUpAmount} 
          onChange={(e) => setTopUpAmount(Number(e.target.value))}
          className="top-up-input"
        />
        <button 
          onClick={() => onTopUp(selectedCustomer, topUpAmount)}
          className="top-up-button"
        >
          เติมเหรียญ
        </button>
      </div>
    </div>
  );
};

export default CustomerSelector;
