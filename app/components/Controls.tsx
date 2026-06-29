import { useEffect } from "react";

export default function Controls({
  onPrev,
  onNext,
  onReset,
}: {
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 1. Safeguard: Don't trigger shortcuts if the user is actively typing in a text field
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      // 2. Right Arrow Key Listener
      if (event.key === "ArrowRight" || event.code === "ArrowRight") {
        event.preventDefault(); // Stop default browser window shifts
        if (onNext) {
          onNext();
        }
      }

      // 3. Left Arrow Key Listener
      if (event.key === "ArrowLeft" || event.code === "ArrowLeft") {
        event.preventDefault(); // Stop default browser window shifts
        if (onPrev) {
          onPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrev]); // Depend on both tracking functions so they always capture fresh layout state

  return (
    <div className="row" style={{ marginTop: 16 }}>
      {onPrev && <button onClick={onPrev}>◀ Previous</button>}
      {onNext && <button onClick={onNext}>Next ▶</button>}
      <button onClick={onReset}>Reset ↺</button>
    </div>
  );
}
