import React, { useState, useEffect } from 'react';
import MachineCard from './MachineCard';
import CustomerSelector from './CustomerSelector';
import NotificationPanel from './NotificationPanel';
import InfoBox from './InfoBox';

const LaundrySystem = () => {
  
  const [machines, setMachines] = useState([
    { id: 1, name: "เครื่องซักผ้า 1", status: "ไม่ว่าง", timeLeft: 2, originalTime: 2 },
    { id: 2, name: "เครื่องซักผ้า 2", status: "ไม่ว่าง", timeLeft: 1, originalTime: 1 },
    { id: 3, name: "เครื่องซักผ้า 3", status: "ว่าง", timeLeft: 0, originalTime: 0 }
  ]);

  
  const [customers, setCustomers] = useState([
    { id: 1, name: "ลูกค้า 1", coins: 10 },
    { id: 2, name: "ลูกค้า 2", coins: 10 },
    { id: 3, name: "ลูกค้า 3", coins: 20 }
  ]);
  
  
  const [selectedCustomer, setSelectedCustomer] = useState(1);
  
  
  const [notifications, setNotifications] = useState([]);
  
  
  const [notificationStatus, setNotificationStatus] = useState({});
  
  
  useEffect(() => {
    const timer = setInterval(() => {
      setMachines(prevMachines => {
        return prevMachines.map(machine => {
          if (machine.status === "ไม่ว่าง" && machine.timeLeft > 0) {
           
            const newTimeLeft = machine.timeLeft - (1/60);
            
           
            const currentStatus = notificationStatus[machine.id] || {};
            
            
            if (newTimeLeft < 1 && newTimeLeft > 0 && !currentStatus.lessThanOneMin) {
              addLocalNotification(`${machine.name}เหลือเวลาน้อยกว่า 1 นาที`);
              
              
              setNotificationStatus(prev => ({
                ...prev,
                [machine.id]: {
                  ...prev[machine.id],
                  lessThanOneMin: true
                }
              }));
            }
            
            
            
            
            if (newTimeLeft <= 0) {
              addLocalNotification(`${machine.name}ซักเสร็จแล้ว`);
              
              
              setNotificationStatus(prev => ({
                ...prev,
                [machine.id]: {}
              }));
              
              return { ...machine, timeLeft: 0, status: "ว่าง" };
            }
            
            return { ...machine, timeLeft: newTimeLeft };
          }
          return machine;
        });
      });
    }, 1000); 
    
    return () => clearInterval(timer);
  }, [notificationStatus]); 
  
  
  const addLocalNotification = (message) => {
    console.log("Adding local notification:", message);
    setNotifications(prev => [
      ...prev, 
      { id: Date.now(), message, time: new Date().toLocaleTimeString() }
    ]);
  };
  
 
  const insertCoins = (machineId) => {
    const machine = machines.find(m => m.id === machineId);
    const customer = customers.find(c => c.id === selectedCustomer);
    
    if (machine.status === "ว่าง" && customer.coins >= 10) {
      
      setCustomers(customers.map(c => 
        c.id === selectedCustomer ? { ...c, coins: c.coins - 10 } : c
      ));
      
      
      setNotificationStatus(prev => ({
        ...prev,
        [machineId]: {}
      }));
      
      
      setMachines(machines.map(m => 
        m.id === machineId ? { ...m, status: "ไม่ว่าง", timeLeft: 5, originalTime: 5 } : m
      ));
      
      addLocalNotification(`${customer.name} เริ่มใช้งาน ${machine.name} แล้ว`);
    }
  };
  
  // Format time display (minutes:seconds)
  const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Test notification function
  const testNotification = () => {
    addLocalNotification("ทดสอบการแจ้งเตือน");
  };
  
  return (
    <div className="laundry-system">
      <div className="header">
        <h1>ระบบเครื่องซักผ้าหยอดเหรียญ</h1>
      </div>
      
      
      <div className="machine-container">
        {machines.map(machine => (
          <MachineCard
            key={machine.id}
            machine={machine}
            onInsertCoins={insertCoins}
            formatTime={formatTime}
            customerCoins={customers.find(c => c.id === selectedCustomer)?.coins || 0}
          />
        ))}
      </div>
      
      
      <CustomerSelector
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
      />
      
      
      <div className="notification-test">
        <button 
          onClick={testNotification}
          className="test-button"
        >
          ทดสอบการแจ้งเตือน
        </button>
        <p className="note">
          หมายเหตุ: การแจ้งเตือนจะแสดงเฉพาะในหน้าเว็บนี้
        </p>
      </div>
      
      
      <NotificationPanel notifications={notifications} />
      
      
      <InfoBox />
    </div>
  );
};

export default LaundrySystem;