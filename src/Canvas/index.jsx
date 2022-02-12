import Konva from 'konva';
import { useEffect } from 'preact/compat';

const Canvas = ({ img, background, type, onConfirm }) => {

  const initKonva = () => {
    const stage = new Konva.Stage({
      container: `b-canvas-${type}`,
      width: 380,
      height: 500
    });
    const layer1 = new Konva.Layer();

    const group1 = new Konva.Group();
    const shirtImg = new Image();
    stage.add(layer1);
    shirtImg.onload = () => {
      const backgroundImg = new Konva.Image({
        x: 0,
        y: 0,
        image: shirtImg,
        width: 400,
        height: 500,
      });
      backgroundImg.listening(false);
      group1.add(backgroundImg)
      layer1.add(group1)
    }
    shirtImg.crossOrigin = "Anonymous"
    shirtImg.src = img;

    const group2 = new Konva.Group();
    const backgroundImgObj = new Image();
    backgroundImgObj.onload = () => {
      const backgroundImg = new Konva.Image({
        x: 100,
        y: 100,
        width: 200,
        height: 200 * backgroundImgObj.height / backgroundImgObj.width,
        image: backgroundImgObj,
        draggable: true,
      });
      group2.add(backgroundImg)
      layer1.add(group2);
      group2.setZIndex(0)

      const scaleBy = 1.2;

      const rangeEl = document.querySelector('#b-range');
      rangeEl.oninput = () => {
        const bgWidth = backgroundImg.width();
        const newScale = 1 + rangeEl.value / bgWidth;
        backgroundImg.scale({ x: newScale, y: newScale })
        console.log(1 + rangeEl.value / bgWidth);
      }


      stage.on('wheel', (e) => {
        e.evt.preventDefault();

        const oldScale = backgroundImg.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
          x: (pointer.x - backgroundImg.x()) / oldScale,
          y: (pointer.y - backgroundImg.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
          direction = -direction;
        }

        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        backgroundImg.scale({ x: newScale, y: newScale });

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        backgroundImg.position(newPos);
      })
    }
    backgroundImgObj.crossOrigin = "Anonymous"
    backgroundImgObj.src = background;
  }

  useEffect(() => {
    initKonva();
  }, [img, background])

  // useEffect(() => {
  //   loadBackground()
  // }, [background, img])

  return (
    <>
      <div id={`b-canvas-${type}`} />
      {background && <input type="range" min="-200" max="500" step="5" value="0" id="b-range"/>}
    </>
  )
}

export default Canvas;