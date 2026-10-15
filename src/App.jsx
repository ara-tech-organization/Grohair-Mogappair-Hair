import { lazy, Suspense, useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
import heroBg from "./assets/hero-bg.jpg";
import prpImg from "./assets/prp.jpg";
import gfcImg from "./assets/gfc.jpg";
import mesoImg from "./assets/mesotheraphy.jpg";
import dandruffImg from "./assets/dandruff.jpg";

const ResultsSection = lazy(() => import("./components/ResultsSection.jsx"));
const ThankYouPage = lazy(() => import("./components/ThankYouPage.jsx"));

// Inline SVG icons to avoid external dependencies
const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#D42A2A" opacity="0.12" />
    <path
      d="M9 12l2 2 4-4"
      stroke="#D42A2A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const ClockCheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const trustChecklist = [
  {
    icon: ClipboardCheckIcon,
    text: "Scalp analysis before any treatment is recommended",
  },
  { icon: ClockCheckIcon, text: "Consultation with a certified trichologist" },
  { icon: LockIcon, text: "Your details are never shared or sold" },
];

const PHONE_NUMBER = "tel:+918270956789";
const BASE_PATH = "/hair-growth-solutions";

const problems = [
  {
    title: "Hair Fall?",
    lines: [
      "Losing more hair than usual?",
      "Don't ignore early signs of hair fall.",
      "Get expert care before it worsens.",
    ],
  },
  {
    title: "Bald Patches?",
    lines: [
      "Noticing visible gaps or patchy hair loss?",
      "It could be a serious scalp condition.",
      "Consult a specialist before it spreads.",
    ],
  },
  {
    title: "Slow Hair Growth?",
    lines: [
      "Hair not growing even after treatments?",
      "Weak roots and poor scalp health may be the reason.",
      "Restore natural growth with the right care.",
    ],
  },
  {
    title: "Dandruff?",
    lines: [
      "Constant itching and flakes on your scalp?",
      "Dandruff can damage hair roots if untreated.",
      "Get proper scalp treatment for lasting relief.",
    ],
  },
];

function ProblemsCarousel() {
  const [current, setCurrent] = useState(0);
  const total = problems.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = () => {
    setCurrent((p) => (p - 1 + total) % total);
  };

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  const item = problems[current];

  return (
    <section id="problems" className="problems-section">
      <p className="section-label">Are you facing Hair Problems?</p>
      <div className="problem-carousel">
        <button className="problem-arrow" onClick={prev} aria-label="Previous">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="problem-card">
          <h3 className="problem-card-title">{item.title}</h3>
          {item.lines.map((line, i) => (
            <p key={i} className="problem-card-line">
              {line}
            </p>
          ))}
        </div>

        <button className="problem-arrow" onClick={next} aria-label="Next">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="problem-dots">
        {problems.map((_, i) => (
          <button
            key={i}
            className={`problem-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Card ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

const reviews = [
  {
    name: "Sai Sathish Rosh",
    time: "GloSkin client",
    text: "I'm absolutely delighted with the Glutathione treatment I received at the Mogappair branch! I wholeheartedly recommend this place for their exceptional service and outstanding results.",
  },
  {
    name: "Jaya Kummar",
    time: "HydraFacial client",
    text: "Treatments are good, 100% safe, I had hydra facial and got stunned with the result. Staffs and doctors are very respectful.",
  },
  {
    name: "Sumanth Ravi",
    time: "GroHair client",
    text: "I have visited Adv GroHair Mogappair for hair fall problem and consulted Dr Nikitha. This is my 4th session, I have visible results and I'm really happy with it. Much recommended.",
  },
  {
    name: "Arun Viran",
    time: "Clinic visitor",
    text: "Very hygienic and well maintained. Good to visit again for the treatment.",
  },
];

function ReviewsCarousel() {
  const [paused, setPaused] = useState(false);
  // Duplicate reviews for seamless infinite scroll
  const doubledReviews = [...reviews, ...reviews];

  return (
    <div
      className="reviews-carousel-wrapper"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className={`reviews-track ${paused ? "paused" : ""}`}>
        {doubledReviews.map((review, i) => (
          <div className="review-card" key={i}>
            <div className="review-header">
              <div className="review-avatar">{review.name.charAt(0)}</div>
              <div className="review-info">
                <p className="review-name">{review.name}</p>
              </div>
            </div>
            <div className="review-stars">
              {[...Array(5)].map((_, j) => (
                <StarIcon key={j} />
              ))}
              <span className="review-time">{review.time}</span>
            </div>
            <p className="review-text">{review.text}</p>
            <div className="review-google">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Client Review</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CUSTOM_DROPDOWN_LIST_MAX_HEIGHT = 224; // px, rough estimate used only to decide flip direction

function CustomDropdown({
  name,
  placeholder,
  options,
  value,
  onChange,
  required,
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    if (!open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(
        spaceBelow < CUSTOM_DROPDOWN_LIST_MAX_HEIGHT && spaceAbove > spaceBelow,
      );
    }
    setOpen((prev) => !prev);
  };

  const selectOption = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setOpen(false);
  };

  return (
    <div className="custom-dropdown" ref={wrapperRef}>
      <button
        type="button"
        className={`custom-dropdown-trigger ${open ? "open" : ""} ${!value ? "placeholder" : ""}`}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <svg
          className="custom-dropdown-arrow"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          className={`custom-dropdown-list ${openUp ? "open-up" : ""}`}
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={value === option}
              className={`custom-dropdown-option ${value === option ? "selected" : ""}`}
              onClick={() => selectOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {/* Hidden input keeps native required/validation semantics for the surrounding form */}
      <input
        type="text"
        name={name}
        value={value}
        onChange={() => {}}
        required={required}
        tabIndex={-1}
        className="custom-dropdown-native"
        aria-hidden="true"
      />
    </div>
  );
}

function BookingForm({ formId = "book-form", popup = false }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    treatment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const apiData = {
      name: formData.name || "N/A",
      email: "N/A",
      phone: formData.phone || "N/A",
      date: now.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      treatment: formData.treatment || "N/A",
      message: formData.city ? "City: " + formData.city : "N/A",
      source: "Grohair Mogappair Landing Page",
    };

    try {
      const response = await fetch(
        "https://adgrohairgloskinkaraikal.com/api/email.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        },
      );

      const result = await response.json();

      if (result.success) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "lead_form_submitted" });

        setFormData({
          name: "",
          city: "",
          phone: "",
          treatment: "",
        });
        navigate("/thank-you");
      } else {
        alert("Submission failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="booking-form" id={formId} onSubmit={handleSubmit}>
      {popup && <h3>Book Your Consultation</h3>}
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="city"
          placeholder="Enter your city"
          required
          value={formData.city}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="Enter your 10-digit mobile number"
          required
          pattern="[0-9]{10}"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <CustomDropdown
          name="treatment"
          placeholder="Select Your Treatment"
          options={[
            "Hair Transplant",
            "Hair Fall Treatment",
            "Hair Regrowth Treatment",
            "Other",
          ]}
          value={formData.treatment}
          onChange={handleChange}
          required
        />
      </div>
      <p className="confidential-note">
        <span className="confidential-note-icon">
          <LockIcon />
        </span>
        100% confidential — no spam calls, ever.
      </p>
      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Book Your Consultation"}
      </button>
    </form>
  );
}

function BookingPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={() => setIsOpen(false)}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="popup-close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <BookingForm formId="popup-book-form" popup />
      </div>
    </div>
  );
}

function CallPopup({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      window.location.href = PHONE_NUMBER;
    }, 2000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="call-popup-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="popup-close-btn dark"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="call-popup-icon-ring">
          <PhoneIcon />
        </div>

        <p className="call-popup-label">Calling</p>
        <h3 className="call-popup-name">
          Advanced GroHair
          <br />
          &amp; GloSkin
        </h3>
        <p className="call-popup-location">Mogappair</p>
        <p className="call-popup-number">+91 82709 56789</p>

        <a href={PHONE_NUMBER} className="call-popup-btn">
          <PhoneIcon />
          Call Now
        </a>

        <div className="call-popup-progress">
          <div className="call-popup-progress-bar" key={isOpen} />
        </div>
      </div>
    </div>
  );
}

const menuLinks = [
  { id: "hero", label: "Home" },
  { id: "problems", label: "Hair Problems" },
  { id: "treatments", label: "Treatments" },
  { id: "results", label: "Results" },
  { id: "why-us", label: "Why Trust Us" },
  { id: "book-form", label: "Book Consultation" },
  { id: "contact", label: "Contact" },
];

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [callPopupOpen, setCallPopupOpen] = useState(false);
  const navigate = useNavigate();
  const { section } = useParams();

  useEffect(() => {
    if (!section) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  }, [section]);

  // Keep the URL in sync with whichever section is on screen while scrolling,
  // without pushing new history entries or fighting the click-triggered scroll above.
  useEffect(() => {
    const sections = menuLinks
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        const id = topMost.target.id;
        const path = `${BASE_PATH}${id === "hero" ? "/" : `/${id}`}`;
        if (window.location.pathname !== path) {
          window.history.replaceState(null, "", path);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goToSection = (id) => {
    setMenuOpen(false);
    navigate(id === "hero" ? "/" : `/${id}`);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <img src={logo} alt="Grohair" className="header-logo" />
        <nav className="header-nav">
          <button
            type="button"
            onClick={() => setCallPopupOpen(true)}
            className="header-phone"
            aria-label="Call us"
          >
            <PhoneIcon />
          </button>
          <button
            className={`hamburger-btn ${menuOpen ? "open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        {menuOpen && (
          <>
            <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
            <div className="header-dropdown">
              {menuLinks.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className="header-dropdown-link"
                  onClick={() => goToSection(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Best <span className="hero-highlight">Hair Clinic</span> in
                Mogappair
              </h1>

              <div className="hero-trust-row">
                <div className="hero-trust-item">
                  <span>Expert Hair Specialist</span>
                </div>
                <div className="hero-trust-item">
                  <span>
                    <strong>200+</strong> Clinics
                  </span>
                </div>
                <div className="hero-trust-item">
                  <span>
                    <strong>4.8</strong> Google Rated
                  </span>
                </div>
              </div>

              <h2 className="hero-subtitle">
                Personalized hair treatments in Mogappair with expert hair
                doctors, offering professional solutions for hair loss, hair
                fall, hair thinning, and other hair and scalp concerns
              </h2>

              <button
                type="button"
                className="cta-button hero-cta-btn"
                onClick={() => goToSection("book-form")}
              >
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="book-form-section">
        <div className="book-form-heading">
          <h2>
            Book a Consultation in <span className="text-red">Mogappair</span>
          </h2>

          <ul className="trust-checklist">
            {trustChecklist.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text}>
                  <span className="trust-checklist-icon">
                    <Icon />
                  </span>
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <BookingForm />
      </section>

      {/* Real Results Section */}
      <Suspense fallback={<div className="results-section" style={{ minHeight: 400 }} />}>
        <ResultsSection />
      </Suspense>

      {/* Reviews Section */}
      <section className="standalone-reviews">
        <h2 className="section-title">
          Real Stories, <span className="text-red">Real Results</span>
        </h2>
        <ReviewsCarousel />
      </section>

      {/* Trust Badges - Google Rating + Guarantee Stamp */}
      <section className="badges-section">
        <div className="google-rating">
          <div className="g-icon">
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <div className="g-content">
            <p className="g-label">
              Google Rating <strong>4.8/5</strong>
            </p>
            <div className="g-stars">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="guarantee-stamp">
          <div className="stamp-ring">
            <svg className="stamp-text-svg" viewBox="0 0 200 200">
              <defs>
                <path id="topArc" d="M 30,100 a 70,70 0 0,1 140,0" />
                <path id="bottomArc" d="M 170,100 a 70,70 0 0,1 -140,0" />
              </defs>
              <text className="stamp-curved-text">
                <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                  QUICK RESULTS
                </textPath>
              </text>
              <text className="stamp-curved-text">
                <textPath
                  href="#bottomArc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  VISIBLE RESULTS
                </textPath>
              </text>
            </svg>
            <div className="stamp-center">
              <div className="stamp-stars-top">&#9733; &#9733; &#9733;</div>
              <div className="stamp-main-text">GUARANTEE</div>
              <div className="stamp-stars-bottom">&#9733; &#9733; &#9733;</div>
            </div>
          </div>
        </div>
      </section>

      {/* Are You Facing Section */}
      <ProblemsCarousel />

      {/* Treatments Section */}
      <section id="treatments" className="treatments-section">
        <h2 className="section-title">
          Our Advanced <span className="text-red">Hair Solutions</span>
        </h2>

        <div className="treatment-card">
          <div className="treatment-image-wrapper">
            <img src={prpImg} alt="Hair Fall Treatment" loading="lazy" />
          </div>
          <div className="treatment-content">
            <h3>
              <span className="treatment-emoji"></span> Hair Fall Treatment
            </h3>
            <p>Boost natural hair growth using your own growth factors.</p>
            <p>Strengthens hair roots and reduces hair fall effectively.</p>
          </div>
        </div>

        <div className="treatment-card">
          <div className="treatment-image-wrapper">
            <img src={gfcImg} alt="GFC Treatment" loading="lazy" />
          </div>
          <div className="treatment-content">
            <h3>
              <span className="treatment-emoji"></span> GFC Treatment
            </h3>
            <p>
              Advanced growth factor therapy for faster and stronger results.
            </p>
            <p>Improves hair density and promotes healthy regrowth.</p>
          </div>
        </div>

        <div className="treatment-card">
          <div className="treatment-image-wrapper">
            <img src={mesoImg} alt="Mesotherapy" loading="lazy" />
          </div>
          <div className="treatment-content">
            <h3>
              <span className="treatment-emoji"></span> Mesotherapy
            </h3>
            <p>Nutrient-rich injections to nourish hair follicles.</p>
            <p>Helps improve hair thickness and overall scalp condition.</p>
          </div>
        </div>

        <div className="treatment-card">
          <div className="treatment-image-wrapper">
            <img
              src={dandruffImg}
              alt="Dandruff & Scalp Treatments"
              loading="lazy"
            />
          </div>
          <div className="treatment-content">
            <h3>
              <span className="treatment-emoji"></span> Dandruff &amp; Scalp
              Treatments
            </h3>
            <p>Target the root cause of dandruff and scalp issues.</p>
            <p>Reduces itching, flakes, and restores scalp health.</p>
          </div>
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section id="why-us" className="trust-section">
        <h2 className="section-title">
          Why <span className="text-red">Trust Us?</span>
        </h2>

        <div className="trust-items">
          <div className="trust-item">
            <div className="trust-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D42A2A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h4>Doctor Experience</h4>
              <p>
                Over 15+ years of specialized experience in trichology and
                advanced hair restoration procedures.
              </p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D42A2A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4>Certifications</h4>
              <p>
                Certified by international hair restoration boards and leading
                medical associations.
              </p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D42A2A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h4>5000+ Happy Patients</h4>
              <p>
                Proven track record with thousands of successful transformations
                and patient satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-top">
          <img
            src={logo}
            alt="Grohair"
            className="footer-logo-img"
            loading="lazy"
          />
          <p className="footer-tagline">
            Restore your confidence today with our expert hair restoration
            solutions.
            <br />
            Book your consultation now!
          </p>
        </div>

        <div className="footer-row">
          <div className="footer-services">
            <h4>Our Services</h4>
            <ul>
              <li>Hair Fall Treatment</li>
              <li>GFC Therapy</li>
              <li>Mesotherapy</li>
              <li>Dandruff & Scalp Treatment</li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <a
              href="mailto:mogappair@adgrohair.com"
              className="contact-item"
            >
              <MailIcon />
              <span className="contact-email">
                mogappair@adgrohair.com
              </span>
            </a>
            <a href={PHONE_NUMBER} className="contact-item">
              <PhoneIcon />
              <span>82709 56789</span>
            </a>
          </div>
        </div>

        <div id="locations" className="footer-locations">
          <h4>Our Clinics</h4>

          <div className="location-cards">
            <div className="location-card">
              <h5>Mogappair</h5>
              <div className="location-map">
                <iframe
                  src="https://maps.google.com/maps?q=Advanced%20GroHair%20%26%20GloSkin%20Clinic%20-%20Mogappair&t=m&z=15&output=embed&iwloc=near"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Grohair Mogappair Location"
                />
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Advanced+GroHair+%26+GloSkin+Clinic+-+Mogappair"
                target="_blank"
                rel="noopener noreferrer"
                className="location-address"
              >
                <LocationIcon />
                <span>
                  No.8, 2nd floor, Bharathi Salai, above Polar Bear ice cream, Mogappair West, Ambattur Industrial Estate, Chennai, Tamil Nadu 600037
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; Grohair. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky Bottom CTA */}
      <div className="sticky-cta">
        <a href={PHONE_NUMBER} className="cta-button sticky">
          <PhoneIcon />
          BOOK INSTANT CONSULTATION - 82709 56789
        </a>
      </div>

      <BookingPopup />
      <CallPopup
        isOpen={callPopupOpen}
        onClose={() => setCallPopupOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/:section" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
