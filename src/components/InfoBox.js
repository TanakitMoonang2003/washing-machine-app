import React from 'react';

const InfoBox = () => {
  return (
    <div className="info-box">
      <h3>
        <span className="info-icon">ℹ️</span>
        การเชื่อมต่อกับ LINE
      </h3>
      <p>ในการใช้งานจริง คุณต้องสร้าง API Backend เพื่อส่งข้อความไปยัง LINE โดยตรง</p>
      <p>ไม่สามารถเรียกใช้ LINE API โดยตรงจาก Frontend เนื่องจากข้อจำกัดของ CORS</p>
    </div>
  );
};

export default InfoBox;