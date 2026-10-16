export default function Kicker({ label, index, className = "" }) {
  return (
    <div className={`kicker ${className}`}>
      {index ? `${label} // ${index}` : label}
    </div>
  );
}