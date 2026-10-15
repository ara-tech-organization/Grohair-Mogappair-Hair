import { useNavigate } from "react-router-dom";

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

function ThankYouPage() {
  const navigate = useNavigate();
  return (
    <div className="thankyou-page">
      <div className="thankyou-card">
        {/* Animated checkmark */}
        <div className="thankyou-icon-wrapper">
          <svg className="thankyou-check" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40"
              cy="40"
              r="38"
              stroke="#D42A2A"
              strokeWidth="3"
              fill="rgba(212,42,42,0.06)"
            />
            <path
              className="check-path"
              d="M22 41 L34 53 L58 28"
              stroke="#D42A2A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <h1 className="thankyou-title">Thank You!</h1>
        <p className="thankyou-subtitle">
          Your callback request has been received.
        </p>
        <p className="thankyou-body">
          Our hair care expert will get in touch with you shortly to confirm
          your appointment.
        </p>

        <div className="thankyou-divider" />

        <div className="thankyou-contact">
          <span>Need urgent help?</span>
          <a href="tel:+918270956789" className="thankyou-phone">
            <PhoneIcon /> +91 82709 56789
          </a>
        </div>

        <button
          className="thankyou-back-btn"
          onClick={() => navigate("/")}
          id="back-to-home-btn"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default ThankYouPage;
