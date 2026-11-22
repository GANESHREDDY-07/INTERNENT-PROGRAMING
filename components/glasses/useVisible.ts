"use client";

import { type RefObject, useEffect, useState } from "react";

export default function useVisible(
  ref: RefObject<HTMLElement | null>,
  rootMargin = "240px",
) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return visible;
}
