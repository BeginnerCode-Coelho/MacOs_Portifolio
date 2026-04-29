import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import { useWindowStore } from "#store/window";

export function Text() {
  const { windows } = useWindowStore();
  const data = windows.txtfile.data;

  if (!data) return null;

  return <>
    <div id="window-header">
      <WindowControls target="txtfile" />
      <h2>{data.name}</h2>
    </div>

    <div className="bg-white p-5 space-y-6">
      {data.image && (
        <img src={data.image} alt={data.name} className="w-full h-auto rounded" />
      )}

      {data.subtitle && (
        <p className="text-lg text-gray-600 mb-4">{data.subtitle}</p>
      )}

      {data.description && Array.isArray(data.description) && (
        <div className="space-y-3">
          {data.description.map((paragraph, index) => (
            <p key={index} className="text-gray-800 leading-relaxed text-base">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  </>
}

const TextWindow = WindowWrapper(Text, 'txtfile');
export default TextWindow;
