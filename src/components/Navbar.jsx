import dayjs from "dayjs";
import { navLinks, navIcons } from "#constants";
import { useWindowStore } from "#store/window";

export default function Navbar() {
  const { openWindow } = useWindowStore();

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="Logo" />
        <p className="font-bold">Andre's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => openWindow(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
       <ul>
        {navIcons.map(({ id, img}) => (
          <li key={id}>
            <img src={img} alt={`icon-${id}`} className="icon-hover" />
          </li>
        ))}
       </ul>

       <time>{dayjs().format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>

  )
}