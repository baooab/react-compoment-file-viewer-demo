import { useEffect, useRef, useState } from "react";

const WHEEL_MAX_SCALE_RATIO = 1
const BASE_SCALE_RATIO = 1
const scaleStep = 0.5

export function useMouseEvent({
  containerRef,
  dispatchZoomChange,
  transform,
  updateTransform
}) {

  const { x, y } = transform;

  const [isMoving, setIsMoving] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);

  const startPositionInfo = useRef({
    diffX: 0,
    diffY: 0,
    transformX: 0,
    transformY: 0,
  });

  const onMouseDown = event => {
    // console.log('>>>>>> [useMouseEvent] onMouseDown', event)

    // Only allow main button
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    startPositionInfo.current = {
      diffX: event.pageX - x,
      diffY: event.pageY - y,
      transformX: x,
      transformY: y,
    };

    setIsMoving(true);
  };

  const onMouseMove = event => {
    if (isMoving) {
      updateTransform(
        {
          x: event.pageX - startPositionInfo.current.diffX,
          y: event.pageY - startPositionInfo.current.diffY,
        }
      );
    }
  }

  const onMouseUp = () => {
    setIsMoving(false);
  }

  const onWheel = (event) => {
    if (event.deltaY == 0) return;

    setIsWheeling(true);
    clearTimeout(isWheeling);
    setIsWheeling(+setTimeout(() => {
      setIsWheeling(false);
    }, 500))

    // Scale ratio depends on the deltaY size
    const scaleRatio = Math.abs(event.deltaY / 100);
    // Limit the maximum scale ratio
    const mergedScaleRatio = Math.min(scaleRatio, WHEEL_MAX_SCALE_RATIO);
    // Scale the ratio each time
    let ratio = BASE_SCALE_RATIO + mergedScaleRatio * scaleStep;
    if (event.deltaY > 0) {
      ratio = BASE_SCALE_RATIO / ratio;
    }

    const { top, left } = containerRef.current.getBoundingClientRect();

    // console.log('>>>>>> [useMouseEvent] onWheel', {
    //   event,
    //   containerRef: containerRef.current,
    //   ratio,
    //   top,
    //   left
    // })

    dispatchZoomChange(ratio, event.clientX - left, event.clientY - top);
  };


  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [x, y, isMoving])


  // deal with scrollbar problem when zooming
  useEffect(() => {
    const originalOverfoww = document.body.style.overflow
    if (isWheeling) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = originalOverfoww
    }
  }, [isWheeling])

  return {
    isMoving,
    onWheel,
    onMouseDown,
    onMouseMove,
  }
}
