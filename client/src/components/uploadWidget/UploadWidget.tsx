import { createContext, useEffect, useState } from "react";

// Define types for props
interface UploadWidgetProps {
  uwConfig: object; // Define the shape of uwConfig if you know it for better typing
  setPublicId: (id: string) => void;
  setState: React.Dispatch<React.SetStateAction<string[]>>; // Assuming setState adds URLs to an array
}

// Define context type
interface CloudinaryContextType {
  loaded: boolean;
}

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext<
  CloudinaryContextType | undefined
>(undefined);

const UploadWidget: React.FC<UploadWidgetProps> = ({
  uwConfig,
  setPublicId,
  setState,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  // Declare the cloudinary widget as part of the window object
  const initializeCloudinaryWidget = () => {
    if (loaded && (window as any).cloudinary) {
      const myWidget = (window as any).cloudinary.createUploadWidget(
        uwConfig,
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setPublicId(result.info.public_id); // Set the public_id
            setState((prev) => [...prev, result.info.secure_url]);
          }
        }
      );

      document.getElementById("upload_widget")?.addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
};

export default UploadWidget;
export { CloudinaryScriptContext };
