const items = [
  "Prescription ready",
  "Japanese titanium",
  "Hand-polished acetate",
  "30-day fittings",
  "Lifetime adjustments",
  "Independent opticians",
];

export default function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((set) => (
          <div className="ticker-set" key={set}>
            {items.map((item) => (
              <span className="ticker-item" key={item}>
                {item}
                <span className="ticker-diamond">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
