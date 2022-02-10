import Canvas from './Canvas';
import { useState } from 'preact/compat'
import postCanvasToFile from './helpers/canvasToURL';

export function App({ front, back }) {
  const [tabActive, setTabActive] = useState('front');
  const [isPopup, setIsPopup] = useState(false);
  const [frontBackground, setFrontBackground] = useState('');
  const [backBackground, setBackBackground] = useState('');
  const [canvasFrontImg, setCanvasFrontImg] = useState('');
  const [canvasBackImg, setCanvasBackImg] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);


  const handleUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const imgUpl = URL.createObjectURL(file)
      if (tabActive === 'front') {
        setFrontBackground(imgUpl)
      } else {
        setBackBackground(imgUpl)
      }
    }
  }

  const handleConfirm = () => {
    setIsConfirm(true);

    const canvasFrontEl = document.querySelector('.b-upload-canvas-front canvas');
    const canvasBackEl = document.querySelector('.b-upload-canvas-back canvas');

    setCanvasFrontImg(canvasFrontEl.toDataURL());
    setCanvasBackImg(canvasBackEl.toDataURL());

    const fileFront = new File([postCanvasToFile(canvasFrontEl)], 'front.jpg',{type:"image/jpeg", lastModified:new Date().getTime()}, 'utf-8');
    const fileBack = new File([postCanvasToFile(canvasBackEl)], 'back.jpg',{type:"image/jpeg", lastModified:new Date().getTime()}, 'utf-8');;

    const container1 = new DataTransfer();
    container1.items.add(fileFront);

    const container2 = new DataTransfer();
    container2.items.add(fileBack);
    document.querySelector('input#b-input-front').files = container1.files;
    document.querySelector('input#b-input-back').files = container2.files;

    setIsPopup(false)

  }
  return (
    <>
      <button type="button" class="bannerys-upload__btn b-upload-btn-style" onClick={() => setIsPopup(true)}>Upload</button>
      <div className="b-preview">
        {canvasFrontImg && <img src={canvasFrontImg} alt="Front" />}
        {canvasFrontImg && <img src={canvasBackImg} alt="Back" />}
      </div>
      <input type="file" id="b-input-front" name="properties[Front]" />
      <input type="file" id="b-input-back" name="properties[Back]" />
      {isPopup && <div className="b-upload-container is-active" onClick={() => setIsPopup(false)}>
        <div className="b-upload-wrapper" onClick={(e) => e.stopPropagation()}>
          <div className="b-upload-header">
            <h2>Custom All Over Shirt Unisex</h2>
          </div>
          <div className="b-upload-content">
            <div className="b-upload-tabs">
              <span className={`${tabActive === 'front' ? 'is-active' : ''}`} onClick={() => setTabActive('front')}>Front</span>
              <span className={`${tabActive === 'back' ? 'is-active' : ''}`} onClick={() => setTabActive('back')}>Back</span>
            </div>
            <div className="b-upload-canvas">
              <div className={`b-upload-canvas-front ${tabActive === 'front' ? 'is-active' : ''}`}>
                <Canvas img={front} background={frontBackground} type="front"/>
              </div>
              <div className={`b-upload-canvas-back ${tabActive === 'back' ? 'is-active' : ''}`}>
                <Canvas img={back} background={backBackground} type="back"/>
              </div>
            </div>

            <div className="b-upload-btn">
              <label htmlFor="b-upload" className="b-upload-btn-style">Upload Image</label>
              <input id="b-upload" type="file" name="b-image-upload" onChange={handleUpload} accept="image/png, image/jpeg"/>
            </div>
            <div className="b-upload-confirm">
              <button type="button" className="b-upload-btn-style" onClick={() => handleConfirm()}>Confirm</button>
            </div>
          </div>
        </div>
      </div>}
    </>
  )
}