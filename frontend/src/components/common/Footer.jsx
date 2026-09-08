// frontend/src/components/common/Footer.jsx
import React from 'react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="ob-footer">
      <div className="container">
        {/* Top Section: Factory Address & Hotline */}
        <div className="ob-footer-top">
          <div className="ob-footer-top-left">
            <h3 className="ob-factory-title">Visit our factory</h3>
            <p className="ob-factory-address">
              Officebase Furniture Trading LLC,<br />
              Unit 327, Schon Business Park,<br />
              Dubai Investments Park,<br />
              Dubai, United Arab Emirates
            </p>
            <p style={{ marginTop: '12px', color: '#eeeeee' }}>
              Mon - Sat: 9AM - 6PM &nbsp;|&nbsp; Sun: Holiday
            </p>

            <div className="ob-footer-socials">
              <a target="_blank" rel="noreferrer" href="https://www.facebook.com/OFFICEBASEUAE/" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/OFFICEBASEUAE/" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a target="_blank" rel="noreferrer" href="https://www.instagram.com/OFFICEBASEUAE/" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@officebaseuae" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>
              <a target="_blank" rel="noreferrer" href="https://www.youtube.com/@officebaseuae" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="ob-footer-top-right">
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="ob-footer-directions-btn">
              Get Directions
            </a>
            <div className="ob-footer-hotline">
              <i className="fa fa-phone" style={{ fontSize: '24px' }}></i>
              <div className="ob-footer-hotline-num">+971 4 324 1913</div>
            </div>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="ob-footer-columns">
          {/* Col 1: Useful Links */}
          <div className="ob-footer-col">
            <h4>USEFUL LINKS</h4>
            <ul className="ob-footer-links">
              <li><a href="#faqs">&rarr; Frequently Asked Questions</a></li>
              <li><a href="#about">&rarr; About Us</a></li>
              <li><a href="#warranty">&rarr; Warranty Statement</a></li>
              <li><a href="#terms">&rarr; Terms & Conditions</a></li>
              <li><a href="#return">&rarr; Returns & Refund Policy</a></li>
              <li><a href="#blogs">&rarr; Blogs</a></li>
              <li><a href="#contact">&rarr; Contact Us</a></li>
              <li><a href="#materials">&rarr; Materials</a></li>
              <li><a href="#privacy">&rarr; Privacy Policy</a></li>
            </ul>
          </div>

          {/* Col 2: Our Range */}
          <div className="ob-footer-col">
            <h4>OUR RANGE</h4>
            <ul className="ob-footer-links">
              <li>
                <a href="/desks/" onClick={(e) => { e.preventDefault(); onNavigate('category', { category: 'desks', subcategory: 'Executive Desks' }); }}>
                  &rarr; Executive Desks
                </a>
              </li>
              <li>
                <a href="/meeting/" onClick={(e) => { e.preventDefault(); onNavigate('category', { category: 'meeting-and-shared-spaces' }); }}>
                  &rarr; Meeting and Shared Spaces
                </a>
              </li>
              <li>
                <a href="/accessories/" onClick={(e) => { e.preventDefault(); onNavigate('category', { category: 'accessories' }); }}>
                  &rarr; Office Accessories
                </a>
              </li>
              <li>
                <a href="/pantries/" onClick={(e) => { e.preventDefault(); onNavigate('category', { category: 'pantries' }); }}>
                  &rarr; Pantries
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="ob-footer-col ob-footer-newsletter">
            <h4>SIGN UP FOR OUR<br />NEWSLETTER</h4>
            <p className="ob-newsletter-sub">Receive promotional offers.</p>
            <div className="ob-newsletter-form">
              <input type="text" placeholder="Email Address" />
              <button type="button">SUBSCRIBE</button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="ob-footer-copyright">
          <p className="ob-copyright-text">
            Copyright &copy; 2026 OFFICEBASE<br />
            FURNITURE TRADING. All Rights Reserved.<br />
            Designed & Developed By Catalyst<br />
            Communications DMCC
          </p>
        </div>
      </div>
    </footer>
  );
};
