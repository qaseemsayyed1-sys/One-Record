export default function Marquee({ items }) {
  const chunk = items.join("  ◆  ");
  return (
    <div className="marquee">
      <div className="marquee__track">
        <span>{chunk}</span>
        <span>{chunk}</span>
      </div>
    </div>
  );
}