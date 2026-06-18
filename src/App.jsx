import { Terminal }  from "#windows";
import { Navbar, Welcome, Dock, } from "#components";
import { Draggable } from "gsap/Draggable";
import gsap from "gsap";
gsap.registerPlugin(Draggable);


/**
 * Render the main application layout composed of the navigation bar, welcome view, dock, and terminal.
 * @returns {JSX.Element} The root JSX element for the main application layout containing <Navbar />, <Welcome />, <Dock />, and <Terminal />.
 */
function App() {
  
  return (
  <main>
    <Navbar />
    <Welcome />
    <Dock />

    <Terminal />
  </main>
  )
}
export default App
