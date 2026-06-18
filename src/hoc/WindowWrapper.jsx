import { useWindowStore } from "#store/window"
import { useLayoutEffect, useRef } from "react";  
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";


/**
 * Create a higher-order component that renders a component inside a keyed "window" container.
 *
 * The returned component is identified by `windowKey` (used as the element id and for store lookups)
 * and synchronizes its visibility and stacking order with the window store.
 *
 * @param {import('react').ComponentType<any>} Component - The React component to render inside the window container.
 * @param {string} windowKey - Unique key identifying the window in the window store and as the container id.
 * @returns {import('react').FC<any>} A React component that wraps the provided Component in a positioned, key-identified container whose visibility and z-index are driven by the window store.
 */
export default function WindowWrapper (Component, windowKey) {
  const Wrapped = (props) => {
   const { focusWindow, windows} = useWindowStore();
   const {isOpen, zIndex} = windows[windowKey];
   const ref = useRef(null)

   useGSAP(() => {
    const el = ref.current;
    if(!el || !isOpen) return;

    el.style.display = 'block';

    gsap.fromTo(el, {scale: 0.8, opacity: 0, y:40}, {scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out"});
   }, [isOpen]);

   useGSAP(() => {
    const el = ref.current;
    if(!el) return;

    const [instance] = Draggable.create(el, {onPress: () => focusWindow(windowKey) });

    return () => instance.kill();
   }, [])

   useLayoutEffect(() => {
     const el = ref.current;
     if(!el) return;
     el.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

   return <section id={windowKey} ref={ref} style={{zIndex}} className="absolute">
    <Component {...props} />
   </section>
  };
  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`

  return Wrapped;
}; 
