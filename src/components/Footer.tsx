import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>درباره ما</h3>
            <p>اکتیو لجندز، مرجع آموزش‌های حرفه‌ای در زمینه‌های مختلف</p>
          </div>
          <div className="footer-section">
            <h3>دسترسی سریع</h3>
            <ul>
              <li><Link to="/">خانه</Link></li>
              <li><Link to="/videos">ویدیوها</Link></li>
              <li><Link to="/gallery">ویترین</Link></li>
              <li><Link to="/about">درباره ما</Link></li>
              <li><Link to="/contact">تماس با ما</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>تماس با ما</h3>
            <ul>
              <li>ایمیل: info@activelegends.com</li>
              <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>آدرس: تهران، خیابان ولیعصر</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>شبکه‌های اجتماعی</h3>
            <ul>
              <li><a href="https://instagram.com/activelegends" target="_blank" rel="noopener noreferrer">اینستاگرام</a></li>
              <li><a href="https://t.me/activelegends" target="_blank" rel="noopener noreferrer">تلگرام</a></li>
              <li><a href="https://youtube.com/activelegends" target="_blank" rel="noopener noreferrer">یوتیوب</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} اکتیو لجندز. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}; 