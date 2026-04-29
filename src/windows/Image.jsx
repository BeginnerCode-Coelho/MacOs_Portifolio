import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import { useWindowStore } from "#store/window";

export function Image() {
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;

  if (!data) return null;

  return <>
    <div id="window-header">
      <WindowControls target="imgfile" />
      <h2>{data.title || data.name}</h2>
    </div>

    <div className="bg-white p-5 flex justify-center items-center h-full">
      <img src={data.imageUrl} alt={data.title || data.name} className="max-w-full max-h-full rounded" />
    </div>
  </>
}

const ImageWindow = WindowWrapper(Image, 'imgfile');
export default ImageWindow;
