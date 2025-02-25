import React, { useState, useEffect } from 'react';
import MachineCard from './MachineCard';
import CustomerSelector from './CustomerSelector';
import NotificationPanel from './NotificationPanel';
import InfoBox from './InfoBox';

const LaundrySystem = () => {
  // Machine state
  const [machines, setMachines] = useState([
    { id: 1, name: "เครื่องซักผ้า 1", status: "ไม่ว่าง", timeLeft: 2, originalTime: 2 },
    { id: 2, name: "เครื่องซักผ้า 2", status: "ไม่ว่าง", timeLeft: 1, originalTime: 1 },
    { id: 3, name: "เครื่องซักผ้า 3", status: "ว่าง", timeLeft: 0, originalTime: 0 }
  ]);

  // Customer state
  const [customers, setCustomers] = useState([
    { id: 1, name: "ลูกค้า 1", coins: 10 },
    { id: 2, name: "ลูกค้า 2", coins: 10 },
    { id: 3, name: "ลูกค้า 3", coins: 20 }
  ]);
  
  // Selected customer
  const [selectedCustomer, setSelectedCustomer] = useState(1);
  
  // LINE notification history
  const [notifications, setNotifications] = useState([]);
  
  // ติดตามสถานะการแจ้งเตือนของแต่ละเครื่อง
  const [notificationStatus, setNotificationStatus] = useState({});
  
  // Timer effect - uses real minutes now
  useEffect(() => {
    const timer = setInterval(() => {
      setMachines(prevMachines => {
        return prevMachines.map(machine => {
          if (machine.status === "ไม่ว่าง" && machine.timeLeft > 0) {
            // Decrease by 1 minute (60000 ms / 60000 ms = 1 min)
            // For demo display, we'll decrease by 1/60 minutes (1 second) 
            const newTimeLeft = machine.timeLeft - (1/60);
            
            // สร้างสถานะปัจจุบันของเครื่อง
            const currentStatus = notificationStatus[machine.id] || {};
            
            // เงื่อนไขสำหรับการแจ้งเตือนเมื่อเวลาน้อยกว่า 1 นาที
            if (newTimeLeft < 1 && newTimeLeft > 0 && !currentStatus.lessThanOneMin) {
              addLocalNotification(`${machine.name}เหลือเวลาน้อยกว่า 1 นาที`);
              
              // อัปเดตสถานะการแจ้งเตือน
              setNotificationStatus(prev => ({
                ...prev,
                [machine.id]: {
                  ...prev[machine.id],
                  lessThanOneMin: true
                }
              }));
            }
            
            // ลบเงื่อนไขการแจ้งเตือนเมื่อเหลือ 1 นาทีพอดี เพื่อหลีกเลี่ยงการแจ้งเตือนซ้ำซ้อน
            
            // If time is up, set machine to available
            if (newTimeLeft <= 0) {
              addLocalNotification(`${machine.name}ซักเสร็จแล้ว`);
              
              // รีเซ็ตสถานะการแจ้งเตือน
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
    }, 1000); // Update every second (for demo purposes)
    
    return () => clearInterval(timer);
  }, [notificationStatus]); // เพิ่ม dependency
  
  // Add notification to local state only - no API calls
  const addLocalNotification = (message) => {
    console.log("Adding local notification:", message);
    setNotifications(prev => [
      ...prev, 
      { id: Date.now(), message, time: new Date().toLocaleTimeString() }
    ]);
  };
  
  // Insert coins and start machine
  const insertCoins = (machineId) => {
    const machine = machines.find(m => m.id === machineId);
    const customer = customers.find(c => c.id === selectedCustomer);
    
    if (machine.status === "ว่าง" && customer.coins >= 10) {
      // Update customer coins
      setCustomers(customers.map(c => 
        c.id === selectedCustomer ? { ...c, coins: c.coins - 10 } : c
      ));
      
      // รีเซ็ตสถานะการแจ้งเตือนเมื่อเริ่มใช้งานเครื่องใหม่
      setNotificationStatus(prev => ({
        ...prev,
        [machineId]: {}
      }));
      
      // Start machine with user-specified time (5 minutes for this example)
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
      
      {/* Machine Status Section */}
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
      
      {/* Customer Selection */}
      <CustomerSelector
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
      />
      
      {/* Notification Test Button */}
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
      
      {/* Notifications History */}
      <NotificationPanel notifications={notifications} />
      
      {/* Information box about LINE integration */}
      <InfoBox />
    </div>
  );
};

export default LaundrySystem;