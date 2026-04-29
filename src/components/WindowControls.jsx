import { useWindowStore } from "#store/window";

export default function WindowControls ({ target }) {
  const { closeWindow } = useWindowStore(); 
  
  return <div id="window-controls" >
    <div className="close" onClick={() => closeWindow(target)} />
    <div className="minimize" />
    <div className="maximize" />
  </div>
}