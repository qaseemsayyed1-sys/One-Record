export default function SectionCard({ index, tag, title, desc, onClick }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="row space-between">
        <span className="card__index">
          {tag} // {index}
        </span>
      </div>
      <h3 className="card__title">{title}</h3>
      <p className="card__desc">{desc}</p>
      <div className="card__cta">View Section →</div>
    </div>
  );
}