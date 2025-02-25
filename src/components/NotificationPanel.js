import React from 'react';

const NotificationPanel = ({ notifications }) => {
  return (
    <div className="notification-panel">
      <h2>
        <span className="notification-icon">🔔</span>
        ประวัติการแจ้งเตือน
      </h2>
      <div className="notification-container">
        {notifications.length === 0 ? (
          <p className="empty-message">ยังไม่มีการแจ้งเตือน</p>
        ) : (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li key={notification.id} className="notification-item">
                <span className="notification-time">{notification.time}</span>
                <p className="notification-message">{notification.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;