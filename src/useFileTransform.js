import { useRef, useState } from "react";

let raf = (callback) => requestAnimationFrame(callback);

const initialTransform = {
  x: 0,
  y: 0,
  scale: 1,
};

const maxScale = 10;
const minScale = 1;

export function useFileTransform({ fileRef }) {
  const frame = useRef(null);
  const queue = useRef([]);
  const [transform, setTransform] = useState(initialTransform);

  const resetTransform = () => {
    setTransform(initialTransform);
  };

  const updateTransform = (newTransform) => {
    if (frame.current === null) {
      queue.current = [];
      frame.current = raf(() => {
        setTransform(preState => {
          let memoState = preState;
          queue.current.forEach(queueState => {
            memoState = { ...memoState, ...queueState };
          });
          frame.current = null;

          return memoState;
        });
      });
    }
    queue.current.push({
      ...transform,
      ...newTransform,
    });
  };

  const dispatchZoomChange = (
    ratio,
    centerX,
    centerY,
  ) => {
    let { offsetWidth: width, offsetHeight: height, offsetLeft, offsetTop } = fileRef.current ?? {};

    // pdf file
    let isPdf = fileRef.current?.classList.contains('react-pdf__Page')

    let newRatio = ratio;
    let newScale = transform.scale * ratio;

    if (newScale > maxScale) {
      newScale = maxScale;
      newRatio = maxScale / transform.scale;
    } else if (newScale < minScale) {
      newScale = minScale;
      newRatio = newScale / transform.scale;
    }

    // console.log('>>>>>>', { isPdf, newScale, newRatio, centerX, centerY, innerWidth, innerHeight })

    /** Default center point scaling */
    const mergedCenterX = centerX ?? innerWidth / 2;
    const mergedCenterY = centerY ?? innerHeight / 2;

    const diffRatio = newRatio - 1;
    /** Deviation calculated from image size */
    const diffImgX = diffRatio * width * 0.5;
    const diffImgY = diffRatio * height * 0.5;
    /** The difference between the click position and the edge of the document */
    const diffOffsetLeft = diffRatio * (mergedCenterX - transform.x - offsetLeft);
    const diffOffsetTop = diffRatio * (mergedCenterY - transform.y - offsetTop);
    /** Final positioning */
    let newX = transform.x - (diffOffsetLeft - diffImgX);
    let newY = transform.y - (diffOffsetTop - diffImgY);

    // console.log('>>>>>>', { isPdf, newX, newY, newScale })

    updateTransform(
      {
        x: newX,
        y: newY,
        scale: newScale,
      }
    )
  }


  return {
    transform,
    dispatchZoomChange,
    updateTransform,
    resetTransform
  }
}
