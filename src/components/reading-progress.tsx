"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const article = document.querySelector<HTMLElement>("[data-article]");
      if (!article) return;
      const start = article.offsetTop;
      const available = Math.max(1, article.offsetHeight - window.innerHeight);
      const current = Math.min(Math.max(window.scrollY - start, 0), available);
      setProgress((current / available) * 100);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="Progresso da leitura"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <span style={{ width: `${progress}%` }} />
    </div>
  );
}
