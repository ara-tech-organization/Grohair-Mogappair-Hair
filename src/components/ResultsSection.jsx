import { useState, useEffect, useCallback, useRef } from "react";
import ba1 from "../assets/before&after/b1.png";
import ba2 from "../assets/before&after/b2.png";
import ba3 from "../assets/before&after/b3.png";
import ba4 from "../assets/before&after/b4.png";

const baSlides = [ba1, ba2, ba3, ba4];

function ResultsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const totalSlides = baSlides.length;

  const goTo = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const i = (index + totalSlides) % totalSlides;
    const card = track.children[i];
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, [totalSlides]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.children[0].offsetWidth + 12;
    setCurrentSlide(
      Math.min(totalSlides - 1, Math.max(0, Math.round(track.scrollLeft / cardWidth))),
    );
  };

  // Auto-advance unless the user is touching/hovering the strip
  useEffect(() => {
    const timer = setInterval(() => {
      if (!pausedRef.current) goTo(currentSlide + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide, goTo]);

  return (
    <section id="results" className="results-section">
      <h2 className="section-title">
        Success Stories <span className="text-red">from Patients </span>
      </h2>
      <p className="section-subtitle">
        Visible transformations of our patients
      </p>

      <div className="ba-carousel">
        <div
          className="ba-scroll"
          ref={trackRef}
          onScroll={handleScroll}
          onTouchStart={() => (pausedRef.current = true)}
          onTouchEnd={() => (pausedRef.current = false)}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          {baSlides.map((src, i) => (
            <div className="ba-slide" key={i}>
              <span className="ba-tag before">Before</span>
              <span className="ba-tag after">After</span>
              <img
                src={src}
                alt={`Before and after treatment result ${i + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="ba-controls">
          <button className="ba-arrow" onClick={() => goTo(currentSlide - 1)} aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="ba-dots">
            {baSlides.map((_, i) => (
              <button
                key={i}
                className={`ba-dot ${i === currentSlide ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button className="ba-arrow" onClick={() => goTo(currentSlide + 1)} aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ResultsSection;
