import { useEffect, useState } from "react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    tag: "PRIVACY",
    title: "Your records. Your rules.",
    desc: "Every medical entry lives in one vault that only you control.",
  },
  {
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
    tag: "CONSENT",
    title: "One scan. 15 minutes.",
    desc: "Grant a doctor temporary access via QR. It expires on its own.",
  },
  {
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&q=80",
    tag: "GUARDRAIL",
    title: "Prescriptions, cross-checked.",
    desc: "We flag duplicate salts even when the brand name changes.",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel__frame">
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.title}
          className="carousel__img"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="carousel__overlay" />
        <div className="carousel__caption">
          <div className="carousel__tag">{slide.tag}</div>
          <h3 className="carousel__title">{slide.title}</h3>
          <p className="carousel__desc">{slide.desc}</p>
        </div>
      </div>

      <div className="carousel__dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`carousel__dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}