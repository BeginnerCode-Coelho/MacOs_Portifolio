import { useWindowStore } from "#store/window";

/**
 * Render window control buttons for a given target window.
 *
 * @param {{ target: any }} props - Component props.
 * @param {any} props.target - Identifier of the window controlled by these buttons.
 * @returns {JSX.Element} A React element containing close, minimize, and maximize controls; clicking the close control closes the window identified by `target`.
 */
export default function WindowControlls ({ target }) {
  const { closeWindow } = useWindowStore(); 
  
  return <div id="window-controls" >
    <div className="close" onClick={() => closeWindow(target)} />
    <div className="minimize" />
    <div className="maximize" />
  </div>
}