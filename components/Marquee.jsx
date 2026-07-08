/* Infinite marquee band. Items are rendered twice so -50% translate loops clean. */
export default function Marquee({ items, speed = 28 }) {
  return (
    <div className="marquee" style={{ "--marquee-speed": `${speed}s` }}>
      <div className="marquee__track">
        {[0, 1].map((dup) =>
          items.map((item, i) => (
            <span className="marquee__item" key={`${dup}-${i}`} aria-hidden={dup === 1}>
              {item}
              <span className="marquee__dot" />
            </span>
          ))
        )}
      </div>
    </div>
  );
}
