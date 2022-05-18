import Canvas from "./Canvas";
import { useState } from "preact/compat";
import postCanvasToFile from "./helpers/canvasToURL";

export function App({ front, back }) {
  const [tabActive, setTabActive] = useState("front");
  const [isPopup, setIsPopup] = useState(false);
  const [frontBackground, setFrontBackground] = useState("");
  const [backBackground, setBackBackground] = useState("");
  const [canvasFrontImg, setCanvasFrontImg] = useState("");
  const [canvasBackImg, setCanvasBackImg] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [frontFileOriginal, setFrontFileOriginal] = useState();
  const [backFileOriginal, setBackFileOriginal] = useState();
  const title = window.productTitle ||  '';

  const handleUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const imgUpl = URL.createObjectURL(file);
      if (tabActive === "front") {
        setFrontBackground(imgUpl);
        setFrontFileOriginal(e.target.files);
      } else {
        setBackFileOriginal(e.target.files);
        setBackBackground(imgUpl);
      }
    }
  };

  const handleConfirm = () => {
    setIsConfirm(true);

    const canvasFrontEl = document.querySelector(
      ".b-upload-canvas-front canvas"
    );
    const canvasBackEl = document.querySelector(".b-upload-canvas-back canvas");

    setCanvasFrontImg(canvasFrontEl.toDataURL());
    setCanvasBackImg(canvasBackEl.toDataURL());

    const fileFront = new File(
      [postCanvasToFile(canvasFrontEl)],
      "front.jpg",
      { type: "image/jpeg", lastModified: new Date().getTime() },
      "utf-8"
    );
    const fileBack = new File(
      [postCanvasToFile(canvasBackEl)],
      "back.jpg",
      { type: "image/jpeg", lastModified: new Date().getTime() },
      "utf-8"
    );

    const container1 = new DataTransfer();
    container1.items.add(fileFront);

    const container2 = new DataTransfer();
    container2.items.add(fileBack);

    frontBackground &&
      handleCreateElement(
        "properties[Front]",
        "b-input-front",
        container1.files
      );
    backBackground &&
      handleCreateElement("properties[Back]", "b-input-back", container2.files);

    frontFileOriginal &&
      handleCreateElement(
        "properties[Front Original]",
        "b-input-front-original",
        frontFileOriginal
      );
    backFileOriginal &&
      handleCreateElement(
        "properties[Back Original]",
        "b-input-back-original",
        backFileOriginal
      );

    setIsPopup(false);
  };

  const handleCreateElement = (name, id, files) => {
    const propertiesWrapperEl = document.querySelector(".b-properties");
    const inputEl = document.createElement("input");
    inputEl.name = name;
    inputEl.type = "file";
    inputEl.id = id;
    inputEl.files = files;

    propertiesWrapperEl.appendChild(inputEl);
  };
  return (
    <>
      <button
        type="button"
        class="bannerys-upload__btn b-upload-btn-style"
        onClick={() => setIsPopup(true)}
      >
        Upload
      </button>
      <div className="b-preview">
        {canvasFrontImg && frontBackground && (
          <img src={canvasFrontImg} alt="Front" />
        )}
        {canvasFrontImg && backBackground && (
          <img src={canvasBackImg} alt="Back" />
        )}
      </div>
      <div className="b-properties"></div>
      {isPopup && (
        <div
          className="b-upload-container is-active"
          onClick={() => setIsPopup(false)}
        >
          <div
            className="b-upload-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="b-upload-header">
              <h2>{ title }</h2>
            </div>
            <div className="b-upload-content">
            <div>
              {/* Front button  */}
              {
                tabActive === "front" && (
                  <div className="b-upload-btn">
                  <label
                    htmlFor="b-upload-front"
                    className="b-upload-btn-style"
                  >
                    Upload Front Image
                  </label>
                  <input
                    id="b-upload-front"
                    type="file"
                    name="b-image-upload-front"
                    onChange={handleUpload}
                    accept="image/png, image/jpeg"
                  />
                </div>
                )
              }
              

                {/* Back button  */}
                {
                  tabActive === "back" && (
                    <div className="b-upload-btn">
                    <label
                      htmlFor="b-upload-back"
                      className="b-upload-btn-style"
                    >
                      Upload Back Image
                    </label>
                    <input
                      id="b-upload-back"
                      type="file"
                      name="b-image-upload-back"
                      onChange={handleUpload}
                      accept="image/png, image/jpeg"
                    />
                  </div>
                  )
                }
                
            </div>
            <div className="b-upload-tabs">
                <span
                  className={`${tabActive === "front" ? "is-active" : ""}`}
                  onClick={() => setTabActive("front")}
                >
                  Front
                </span>
                <span
                  className={`${tabActive === "back" ? "is-active" : ""}`}
                  onClick={() => setTabActive("back")}
                >
                  Back
                </span>
              </div>
              <div className="b-upload-canvas">
                <div
                  className={`b-upload-canvas-front ${
                    tabActive === "front" ? "is-active" : ""
                  }`}
                >
                  
                  <Canvas
                    img={front}
                    background={frontBackground}
                    type="front"
                  />
                </div>
                <div
                  className={`b-upload-canvas-back ${
                    tabActive === "back" ? "is-active" : ""
                  }`}
                >
                  
                  <Canvas img={back} background={backBackground} type="back" />
                </div>
              </div>
              
              <div className="b-upload-confirm">
                <button
                  type="button"
                  className="b-upload-btn-style is-blue"
                  onClick={() => handleConfirm()}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
