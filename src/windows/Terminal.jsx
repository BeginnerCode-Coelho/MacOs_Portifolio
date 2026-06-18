import WindowControls from "#components/WindowControls";
import { techStack } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import { Check, Flag } from "lucide-react";

 /**
 * Render a terminal-style "Tech Stack" view listing categories and technologies with window controls and a footer.
 *
 * Renders a header with window controls and title, a prompt line, a labeled list of categories (each prefixed with a check icon) and their technologies (comma-separated), and a footer showing load status and render time.
 * @returns {JSX.Element} The rendered Terminal UI.
 */
export function Terminal() {
  return ( <>
  <div id="window-header">
    <WindowControls target="terminal" />
    <h2>Tech Stack</h2>
  </div>

  <div className="techstack">
    <p>
      <span className="font-bold">@andre % </span>
      show tech stack
    </p>

    <div className="label">
      <p className="w-32">Category</p>
      <p>Technologies</p>
    </div>

      <ul className="content">
        {techStack.map(({category, items}) => (
          <li key={category} className="flex items-center">
           <Check className="check" size={20} /> 
           <h3>{category}</h3>
           <ul>
            {items.map((item, i ) => (
              <li key={i}>
               {item}{i < items.length - 1 ? ',' : ""}
              </li>
            ))}
           </ul>
          </li>
        ))}
      </ul>

      <div className="footnote">
        <p>
          <Check size={20} /> {techStack.length} of {techStack.length} stacks loaded successfully (100%)
        </p>

        <p className="text-black">
          <Flag size={15} fill="black" />
          Render time: 6ms
        </p>
      </div>
  </div>
  </>
  );
};

 const TerminalWindow = WindowWrapper(Terminal, 'terminal');

 export default TerminalWindow;


