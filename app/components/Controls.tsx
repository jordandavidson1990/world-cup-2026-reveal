export default function Controls({
  onPrev,
  onNext,
  onReset,
}: {
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}) {
  return (
    <div className="row" style={{ marginTop: 16 }}>
      <button onClick={onPrev}>◀ Previous</button>
      <button onClick={onNext}>Next ▶</button>
      <button onClick={onReset}>Reset ↺</button>
    </div>
  );
}
