import HeroCarousel from "../components/HeroCarousel";
import AuthCard from "../components/AuthCard";
import Marquee from "../components/Marquee";
import SectionCard from "../components/SectionCard";

export default function Landing() {
  const features = [
    {
      tag: "IDENTITY",
      title: "Patient Profile",
      desc: "Blood group, allergies, chronic conditions, emergency contact — stored once.",
    },
    {
      tag: "ARCHIVE",
      title: "Medical Records",
      desc: "Every prescription, lab report and visit note in one chronological stream.",
    },
    {
      tag: "CONSENT",
      title: "QR Share",
      desc: "Grant a doctor 15-minute access. Revoke anytime with a tap.",
    },
  ];

  const aboutPoints = [
    "Every access is logged — you see exactly who viewed your record and when.",
    "Doctors never see your name, phone or email — only the medical data that matters.",
    "Duplicate prescriptions are flagged automatically, even when brand names change.",
  ];

  return (
    <>
      <section className="container hero-split">
        <div>
          <div className="hero__kicker">HEALTHVAULT // EDITION 2026</div>
          <h1 className="display h1 hero__title">
            One Record.<br />
            <em>Every</em> Chapter.
          </h1>
          <p className="hero__desc" style={{ marginBottom: 32 }}>
            A consent-based health locker. Share your medical history with any
            doctor in seconds — via a QR code that expires in 15 minutes.
          </p>
          <HeroCarousel />
        </div>

        <div className="hero-split__aside">
          <AuthCard />
          <div className="hero-split__note">
            <div className="mono">NO CREDIT CARD · NO SPAM</div>
            <div className="mono muted mt-24" style={{ lineHeight: 2 }}>
              PATIENT · DOCTOR<br />
              QR-CONSENT · AUDIT-LOGGED
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "PRIVACY FIRST",
          "QR-CONSENT ACCESS",
          "DUPLICATE DETECTION",
          "FULL AUDIT TRAIL",
          "INDIAN BRAND SALT MAP",
          "NO NAMES TO DOCTORS",
        ]}
      />

      <section className="container section">
        <div className="about-split">
          <div>
            <div className="kicker">ABOUT US // PURPOSE</div>
            <h2 className="display h2 mt-24">
              Built for patients. <em className="crimson">Trusted</em> by doctors.
            </h2>
            <ul className="about-points mt-48">
              {aboutPoints.map((p, i) => (
                <li key={i}>
                  <span className="about-points__num">0{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="about-highlight">
            <div className="kicker" style={{ color: "var(--terracotta)" }}>
              KEY FEATURES
            </div>
            <p className="about-highlight__text">
              One-Record gives patients <strong>full control</strong> over a
              medical history that currently lives in scattered paper files
              and lost reports. Doctors get instant,{" "}
              <strong>privacy-safe access</strong> with just a QR scan.
            </p>
            <div className="about-highlight__stats">
              <div>
                <div className="about-highlight__num">15<span>min</span></div>
                <div className="mono muted">Token lifetime</div>
              </div>
              <div>
                <div className="about-highlight__num">100<span>%</span></div>
                <div className="mono muted">Audited access</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container section">
        <div className="kicker">SYSTEM // 03 PILLARS</div>
        <h2 className="display h2 mt-24">How it holds together.</h2>

        <div className="grid grid--3 mt-48">
          {features.map((f, i) => (
            <SectionCard
              key={f.title}
              index={String(i + 1).padStart(2, "0")}
              tag={f.tag}
              title={f.title}
              desc={f.desc}
            />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="kicker">MOMENTS // 2026</div>
        <h2 className="display h2 mt-24">Care, captured.</h2>

        <div className="image-grid mt-48">
          <div className="image-grid__cell">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80"
              alt="Consultation"
              onError={(e) => { e.target.parentElement.classList.add("image-grid__cell--fallback-1"); e.target.style.display = "none"; }}
            />
            <div className="image-grid__label">
              <div className="mono">SCAN // 01</div>
              <div className="image-grid__title">Scan in seconds</div>
            </div>
          </div>
          <div className="image-grid__cell">
            <img
              src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80"
              alt="Treatment"
              onError={(e) => { e.target.parentElement.classList.add("image-grid__cell--fallback-2"); e.target.style.display = "none"; }}
            />
            <div className="image-grid__label">
              <div className="mono">SHARE // 02</div>
              <div className="image-grid__title">Share with consent</div>
            </div>
          </div>
          <div className="image-grid__cell">
            <img
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80"
              alt="Records"
              onError={(e) => { e.target.parentElement.classList.add("image-grid__cell--fallback-3"); e.target.style.display = "none"; }}
            />
            <div className="image-grid__label">
              <div className="mono">STORE // 03</div>
              <div className="image-grid__title">Yours, forever</div>
            </div>
          </div>
        </div>
      </section>

      <section className="wordmark">
        <div className="wordmark__inner">
          <div className="wordmark__text">ONE RECORD</div>
          <div className="wordmark__meta">
            <div className="mono">HEALTHVAULT · © 2026</div>
            <div className="mono">BUILT WITH FIRESTORE · EXPRESS · REACT</div>
          </div>
        </div>
      </section>
    </>
  );
}