'use client'

import { useEffect } from "react";
import gsap from "gsap";

type Direction = "top" | "bottom" | "left" | "right";

const useStaggeredFadeIn = (
  selector: string = ".fade-in-child",
  offset: number = 180,
  delayBetween: number = 0.5,
  direction: Direction = "bottom"
) => {
  useEffect(() => {
    const elements = gsap.utils.toArray(selector) as HTMLElement[];

    const initialY = direction === "top" ? -offset : direction === "bottom" ? offset : 0;
    const initialX = direction === "left" ? -offset : direction === "right" ? offset : 0;

    gsap.set(elements, { autoAlpha: 0, y: initialY, x: initialX });

    const animate = () => {
      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: 0.8,
        stagger: delayBetween,
        ease: "power3.out",
      });
    };

    if (document.readyState === "complete") {
      animate();
    } else {
      window.addEventListener("load", animate);
      return () => window.removeEventListener("load", animate);
    }
  }, [selector, offset, delayBetween, direction]);
};

export default useStaggeredFadeIn;
