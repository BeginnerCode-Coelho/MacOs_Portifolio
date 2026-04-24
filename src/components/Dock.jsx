import { useRef } from "react";
import { dockApps } from "#constants";

export default function Dock() {
  const dockRef = useRef(null);

  return (
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button></button>
          </div>
        ))}
      </div>
    </section>
  )
}