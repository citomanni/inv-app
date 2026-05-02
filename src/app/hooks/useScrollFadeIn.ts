import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right";

export const useScrollFadeIn = (direction: Direction = "up", duration = 1, delay = 0) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    let x = 0;
    let y = 0;

    switch (direction) {
      case "up":
        y = 180;
        break;
      case "down":
        y = -180;
        break;
      case "left":
        x = 180;
        break;
      case "right":
        x = -180;
        break;
    }

    const anim = gsap.fromTo(
      elementRef.current,
      { opacity: 0, x, y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top 95%",
          toggleActions: "restart none restart none",
        },
      }
    );

    return () => {
        if (elementRef.current) {
            anim.scrollTrigger?.kill(); 
            anim.kill();
          }
      };
  }, [direction, duration, delay]);

  return elementRef;
};
