// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import homeData from '../data/homeData.json';

const HERO_SLIDES = [
  { img: 'https://officebaseuae.b-cdn.net/assets/minify/data/website/images/1335x685/8617274274-1335x685.webp', alt: 'Command your workspace with Magna Pro' },
  { img: 'https://officebaseuae.b-cdn.net/assets/minify/data/website/images/1335x685/472509392-1335x685.webp', alt: 'Executive Office Desks' },
  { img: 'https://officebaseuae.b-cdn.net/assets/minify/data/website/images/1335x685/1396717986-1335x685.webp', alt: 'Modern Workspace Furniture' }
];

// 10 authentic Instagram posts matching live HTML
const INSTA_POSTS = [
  {
    "href": "https://www.instagram.com/reel/DciGBtzjfPG/",
    "img": "https://scontent-ccu1-2.cdninstagram.com/v/t51.82787-15/787121767_18032934497814701_1827974956949703548_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=CUIG1VjGjIAQ7kNvwFvLhMU&_nc_oc=Adrn9YXp8MkyIE7bKf77cacQN4y3bJ5WbNUR0WeG5UfLyP3HahjysSMTxe_J-4KVncfsnQusGlCvFmhjk2gGaXzV&_nc_zt=23&_nc_ht=scontent-ccu1-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQIimDmfvCkitDh6JoBqEvQOyE0JV4DkmIk8AM0mjfgSseotsPJYxkUeHiH5H8lbFhjH9vICYgmr&oh=00_AQLc9UZpeTTQlaY8CdSbf_OhMTcyN-IzruShdT5eqchqQg&oe=6AA49BE0",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/p/Dcfvft7kTZf/",
    "img": "https://scontent-ccu2-1.cdninstagram.com/v/t39.30808-6/787367673_1051904484263620_8655002424420418968_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=m7r6lZbS1YwQ7kNvwHjF582&_nc_oc=Adpdl4KHN4vWR__MjoEk-cNNL4tcwn6xxJOsRzuypA_wlKPtobTSzIWmF8uRVW682dCTH7VS0oRwJlwfVLX9c_uA&_nc_zt=23&_nc_ht=scontent-ccu2-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQL-c1MXuZcWt6PwKZp0HfbEILCUQBMxu-9jsGBBebIQZJJH0_wuWLI-AEaQ8NLjh-Ke52vqRWVl&oh=00_AQJANuJLFxq1UgsIOLWBNjZlRhGH4UCoLdQHomFuKO-ruw&oe=6AA491A8",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/p/Dcc-VShkZ6z/",
    "img": "https://scontent-ccu2-1.cdninstagram.com/v/t39.30808-6/786960937_1050980237689378_1469769565241773744_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=QNfnmsDwYZEQ7kNvwFTE3q9&_nc_oc=Adqta-XjkLsGbAgm_nLqE_hP3bJIQHmy_syX9C5iu_BYk4ewMcR4Acs6-n0B4ZjgBM95kKI-uzw_mvFEu1yABAzw&_nc_zt=23&_nc_ht=scontent-ccu2-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQJ4nZtJqgrH7QmlsJR7VwehMp-ZGZ7wW-8dTEZ45IBJDHv68CXfhONDO4iXJGgDVm0v_ZN8H3mf&oh=00_AQIQWQ9AjNDLWn6oSH_5-x5iKoa33Z7sNAUTkS0yc1JSnw&oe=6AA4A60A",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/reel/DcaUb7jFUlO/",
    "img": "https://scontent-ccu1-1.cdninstagram.com/v/t51.82787-15/784198239_18032553200814701_3540554399823315236_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=RMWNRyye9sUQ7kNvwFAP-41&_nc_oc=AdpS7cCoChssdih-4OoYjBjRooFmLoQ2Lo_YARuUIudAf0X-jrWwSiKId5mlxMme5K2lDCgKBw2GW1EBUIpTJn9j&_nc_zt=23&_nc_ht=scontent-ccu1-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQK9NVQ3d3uI461v6wbMSovmFoRpjS7SZsDnYcSKIyULyC-tsUfXtr0fRmp8guEwGK8WVkZgV-BH&oh=00_AQIFykM3G2rQPlwjd6AXWDdGArnfi5qtv29BO2M4Gxnl4g&oe=6AA4A2D0",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/reel/DcQERa9GKaN/",
    "img": "https://scontent-ccu1-2.cdninstagram.com/v/t51.82787-15/771823015_18032049446814701_5839471543789847409_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=Jhl4E0HB_qsQ7kNvwFzRR7V&_nc_oc=AdqNieATsukBcYx7GA7_e_HaEWO1acPevb3WAbGovOXyX36sLvDx7Q-fzyeP0uNd-ReEwO4huyP687pMpIMp3keN&_nc_zt=23&_nc_ht=scontent-ccu1-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQJJcjYXXqqMOLg0ZrnymDNThCakFFNLyg2hWpDdU9sYuVsfTcJesMdBmbC-CL7-XrFFjFnWXP6W&oh=00_AQJb7pHy18djCJ0RnqTkAs23zA3FpSp_rKwpJKtc204xSg&oe=6AA48BCD",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/p/Dc-Qrwlijzu/",
    "img": "https://scontent-ccu1-2.cdninstagram.com/v/t39.30808-6/792109528_1062115406575861_6097254378916529991_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=eM7a_L_5GsoQ7kNvwE6kGbd&_nc_oc=AdoiWiuQXTXJ2lNHJ5KP-j0wqYuzIlNueuoNkClyj-X5npchF0VDGgUDOCFsQXuk6PJv1cq93JJ0wxqHEc3yup7L&_nc_zt=23&_nc_ht=scontent-ccu1-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQIutiBbqK9Sl7dbkLsDu7Qg5-t2oycD3nBJ9M4SwbBSKJeDe82g3xoROc6vfxXIByNMosraEvI-&oh=00_AQJv3dkCCB5pTYSL3x_BEpB2iykWjAn_mUuhMzLwvsWKtA&oe=6AA4A0E8",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/reel/Dc0XHB9j40q/",
    "img": "https://scontent-ccu2-1.cdninstagram.com/v/t51.82787-15/791062688_18033863066814701_2778487706794828120_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=qHL-inCqiX0Q7kNvwEVQiSA&_nc_oc=AdrGtvjMpwFGF3WxsPkVU8SxcnJSGUEflwl2S-gCuVod3xYYguHVbmO4Wt9YKZcFnKubkm8EdxdgJcRPR1pxIIsM&_nc_zt=23&_nc_ht=scontent-ccu2-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQLs-wlOLYDSbdrcLR7M9UEQ-OH7AYwyEkxfXKAfOHxj5UKpzJCwc06iAL_A8yPhPI-FtCvQDXRH&oh=00_AQK9g5bynsws6j-NMvsSqKFLhjCpVrU6dRec2aISMqXRdQ&oe=6AA49F2D",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/p/Dcxk_AGkZDY/",
    "img": "https://scontent-ccu2-2.cdninstagram.com/v/t39.30808-6/790325991_1057749620345773_3453953111510812430_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=kPr9Q6lqCJQQ7kNvwEzAy6k&_nc_oc=AdqM1JsVEVJ-zGdFybuSdlFnz7k_-K64tPqbe3vEW_naHgeuyttufX2-Xnr9xx4i8Kuala9NGlIAuYWiv4ok7ABW&_nc_zt=23&_nc_ht=scontent-ccu2-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQKCOeuZWo2LMtX0-gQm4nyQTBfcP2JrXxZtMxBdgIZROM8Ru3VemTmsZtZxMt-V2GczuNBn88xX&oh=00_AQKkAq-KqtXXWF0RIASkhaWu5X2SC2KKWr-R7Ld3-m-rcw&oe=6AA49425",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/reel/Dcu9kmllQRA/",
    "img": "https://scontent-ccu2-1.cdninstagram.com/v/t51.82787-15/789300764_18033623378814701_2996817077449540002_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=LWrkqaZzkEgQ7kNvwHs32nh&_nc_oc=Adqy8L6OjD4dXd2uVWnnXQLyPTd42au3eUEXW7YFSPKtghw7_5G_GHCqPvqkTG-5uuPtdUlcqnaDCmfBZntOjfHt&_nc_zt=23&_nc_ht=scontent-ccu2-1.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQKellDtuRNAIqtdH9f_detGM5ngeaXKrdFaz5-v5hsxSbyRuOk4acKxW1Fxk54UjyWbf_J5Lf47&oh=00_AQKjzewtuMkYuxdugfFFkBFbSEGKCpro_FZbtjnIL3XUhw&oe=6AA49D63",
    "text": "Instagram Post"
  },
  {
    "href": "https://www.instagram.com/reel/DcsZ3h4AblF/",
    "img": "https://scontent-ccu2-2.cdninstagram.com/v/t51.82787-15/788838952_18033489056814701_3576329263976981523_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=Sf010MefRUwQ7kNvwE2ISip&_nc_oc=Adqanelo6ksJnGEag6djWded5dPObDbrqEmLx6CVMIwQHDqypS8wfwvCSCEtT7W4Xb6RRD8miESW2QFvm8FycuDB&_nc_zt=23&_nc_ht=scontent-ccu2-2.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=w2-VXrvppjEazwkBjQbCaQ&_nc_tpa=Q5bMBQIwrcGyrM6WO5ZpRTXR3Rczk3WZJgVn9ioKDk-jQd7FhBxJX_TwekVTeCsxOjpj9maUXJs0EQmB&oh=00_AQJhMifOlRgz1hbnYPsxTekp1ZO9G9x0Q6tm7kHuEutXFQ&oe=6AA47CF5",
    "text": "Instagram Post"
  }
];

export const HomePage = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clientIndex, setClientIndex] = useState(0);
  const [instaIndex, setInstaIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(5);
  const { featuredProducts: featured, newArrivals, blogs, clients } = homeData;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setVisibleItems(2);
      } else if (window.innerWidth < 992) {
        setVisibleItems(3);
      } else {
        setVisibleItems(5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide for Hero Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide for Clients Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setClientIndex((prev) => (prev >= (clients?.length || 1) - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [clients?.length]);

  // Auto-slide for Insta Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setInstaIndex((prev) => (prev >= INSTA_POSTS.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Duplicate clients array to allow seamless wrapping for the last few dots
  const carouselClients = [...(clients || []), ...(clients || [])];
  
  // Duplicate Insta array to allow scrolling
  const carouselInsta = [...INSTA_POSTS, ...INSTA_POSTS];

  return (
    <div>
      {/* 1. HERO SLIDER */}
      <section className="ob-hero-slider">
        <div style={{ position: 'relative', width: '100%' }}>
          <img
            src={HERO_SLIDES[currentSlide].img}
            alt={HERO_SLIDES[currentSlide].alt}
            className="ob-hero-slide-img"
          />

          {/* Prev Slide Arrow */}
          <button
            className="ob-slider-nav-btn prev"
            onClick={() => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            aria-label="Previous Slide"
          >
            <i className="fa fa-chevron-left"></i>
          </button>

          {/* Next Slide Arrow */}
          <button
            className="ob-slider-nav-btn next"
            onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Next Slide"
          >
            <i className="fa fa-chevron-right"></i>
          </button>

          {/* Floating WhatsApp Button on Right Edge of Banner */}
          <a
            href="https://wa.me/971501234567?text=Hello%20OfficeBase%20UAE"
            target="_blank"
            rel="noreferrer"
            className="ob-hero-whatsapp"
            title="Chat with OfficeBase Specialist"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS SECTION (12 Products matching user screenshot) */}
      <section className="ob-section">
        <div className="container">
          <div className="ob-section-header">
            <h2 className="ob-section-title">Featured Products</h2>
            <p className="ob-section-subtitle">Check out our featured collections</p>
          </div>

          <div className="ob-product-grid">
            {featured.map((p, idx) => (
              <div
                key={p.id || idx}
                className="ob-product-card"
                onClick={() => onNavigate('product', { id: p.id, slug: 'featured-desk' })}
              >
                {/* Top of Card: Title & Price */}
                <div className="ob-card-header">
                  <h3 className="ob-card-title" title={p.title}>
                    {p.title}
                  </h3>
                  <div className="ob-card-price">
                    <span className="uae-symbol">&#x00EA;</span>
                    {parseFloat(p.numericPrice || 1769).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Bottom of Card: Square Image Box */}
                <div className="ob-card-image-wrap">
                  <img src={p.img} alt={p.title} loading="lazy" />

                  {/* Corner triangle appearing on hover */}
                  <div className="ob-card-hover-triangle"></div>
                  <div className="ob-card-eye-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS SECTION (7 Products matching user screenshot) */}
      <section className="ob-section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="ob-section-header">
            <h2 className="ob-section-title">New Arrivals</h2>
            <p className="ob-section-subtitle">Check out our latest collections</p>
          </div>

          <div className="ob-product-grid">
            {newArrivals.map((p, idx) => (
              <div
                key={p.id || idx}
                className="ob-product-card"
                onClick={() => onNavigate('product', { id: p.id, slug: 'new-arrival-chair' })}
              >
                {/* Top of Card: Title & Price */}
                <div className="ob-card-header">
                  <h3 className="ob-card-title" title={p.title}>
                    {p.title}
                  </h3>
                  <div className="ob-card-price">
                    <span className="uae-symbol">&#x00EA;</span>
                    {parseFloat(p.numericPrice || 1009).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Bottom of Card: Square Image Box */}
                <div className="ob-card-image-wrap">
                  <img src={p.img} alt={p.title} loading="lazy" />
                  
                  <div className="ob-card-hover-triangle"></div>
                  <div className="ob-card-eye-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT DESIGN SECTION */}
      <section className="ob-about-design-section">
        <div className="container">
          <div className="ob-about-design-content">
            <h2 className="ob-about-design-title">About Design</h2>
            <p className="ob-about-design-text">
              We believe in creativity as one of the major forces of progress. With this idea, we traveled throughout Italy to find exceptional designers and manufacturers who share our dedication to design and quality for office spaces. We select timeless designs that make workplaces more engaging, ergonomic, and inspiring for businesses across the United Arab Emirates.
            </p>
          </div>
        </div>
      </section>

      {/* 5. OUR BLOGS SECTION (5 cards: 3 on row 1, 2 on row 2) */}
      <section className="ob-blogs-section">
        <div className="container">
          <div className="ob-section-header">
            <h2 className="ob-section-title">Our Blogs</h2>
          </div>

          {/* Blogs Grid (3 Columns) */}
          <div className="ob-blogs-grid">
            {blogs.map((blog, idx) => {
              const dateParts = blog.date ? blog.date.split(' ') : ['May', '13', '2026'];
              return (
                <div key={idx} className="ob-blog-card">
                  <div className="ob-blog-img-wrap">
                    <img src={blog.img} alt={blog.title} loading="lazy" />
                  </div>
                  <div className="ob-blog-body">
                    <div className="ob-blog-date">
                      <span className="ob-date-month">{dateParts[0]}</span>
                      <span className="ob-date-day">{dateParts[1]}</span>
                      <span className="ob-date-year">{dateParts[2]}</span>
                    </div>
                    <div className="ob-blog-info">
                      <h3 className="ob-blog-title">{blog.title}</h3>
                    </div>
                  </div>
                  <div className="ob-blog-read-more">
                    READ MORE
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. OUR CLIENTS SECTION */}
      <section className="ob-clients-section">
        <div className="container">
          <h2 className="ob-section-title">Our Clients</h2>

          <div className="ob-clients-carousel">
            <div 
              className="ob-clients-track"
              style={{
                width: `${(carouselClients.length / visibleItems) * 100}%`,
                transform: `translateX(-${(clientIndex * 100) / carouselClients.length}%)`
              }}
            >
              {carouselClients.map((client, idx) => (
                <div 
                  className="ob-client-slide" 
                  key={idx}
                  style={{ width: `${100 / carouselClients.length}%` }}
                >
                  <div className="ob-client-item">
                    <img src={client.img} alt={client.name} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ob-clients-dots">
            {clients.map((_, idx) => (
              <span 
                key={idx}
                className={`ob-client-dot ${idx === clientIndex ? 'active' : ''}`}
                onClick={() => setClientIndex(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOLLOW US INSTAGRAM SECTION */}
      <section className="ob-insta-section">
        <div className="container">
          <h2 className="ob-insta-title">
            FOLLOW US INSTAGRAM
          </h2>
          <div className="ob-insta-handle">
            <a href="https://www.instagram.com/officebaseuae/" target="_blank" rel="noreferrer">
              @OFFICEBASEUAE
            </a>
          </div>

          <div className="ob-insta-carousel">
            <div 
              className="ob-insta-track"
              style={{
                width: `${(carouselInsta.length / visibleItems) * 100}%`,
                transform: `translateX(-${(instaIndex * 100) / carouselInsta.length}%)`
              }}
            >
              {carouselInsta.map((post, idx) => (
                <div 
                  className="ob-insta-slide" 
                  key={idx}
                  style={{ width: `${100 / carouselInsta.length}%` }}
                >
                  <a href={post.href} target="_blank" rel="noreferrer" className="ob-insta-tile">
                    <img src={post.img} alt={post.text || 'Instagram Post'} loading="lazy" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
