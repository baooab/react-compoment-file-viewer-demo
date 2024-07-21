import { useEffect, useRef, useState } from "react";


function getDistance(a, b) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.hypot(x, y);
}

function getCenter(oldPoint1, oldPoint2, newPoint1, newPoint2) {
  // Calculate the distance each point has moved
  const distance1 = getDistance(oldPoint1, newPoint1);
  const distance2 = getDistance(oldPoint2, newPoint2);

  // If both distances are 0, return the original points
  if (distance1 === 0 && distance2 === 0) {
    return [oldPoint1.x, oldPoint1.y];
  }

  // Calculate the ratio of the distances
  const ratio = distance1 / (distance1 + distance2);

  // Calculate the new center point based on the ratio
  const x = oldPoint1.x + ratio * (oldPoint2.x - oldPoint1.x);
  const y = oldPoint1.y + ratio * (oldPoint2.y - oldPoint1.y);

  return [x, y];
}

const minScale = 1


export function useTouchEvent({
  transform,
  updateTransform,
  dispatchZoomChange,
}) {
  const { scale, x, y } = transform;

  const [isTouching, setIsTouching] = useState(false);
  const touchPointInfo = useRef({
    point1: { x: 0, y: 0 },
    point2: { x: 0, y: 0 },
    eventType: 'none',
  });

  const updateTouchPointInfo = (values) => {
    touchPointInfo.current = {
      ...touchPointInfo.current,
      ...values,
    };
  };


  const onTouchStart = (event) => {
    event.stopPropagation();
    setIsTouching(true);

    const { touches = [] } = event;
    if (touches.length > 1) {
      // touch zoom
      updateTouchPointInfo({
        point1: { x: touches[0].clientX, y: touches[0].clientY },
        point2: { x: touches[1].clientX, y: touches[1].clientY },
        eventType: 'touchZoom',
      });
    } else {
      // touch move
      updateTouchPointInfo({
        point1: {
          x: touches[0].clientX - x,
          y: touches[0].clientY - y,
        },
        eventType: 'move',
      });
    }
  };


  const onTouchMove = (event) => {
    const { touches = [] } = event;
    const { point1, point2, eventType } = touchPointInfo.current;

    if (touches.length > 1 && eventType === 'touchZoom') {
      // touch zoom
      const newPoint1 = {
        x: touches[0].clientX,
        y: touches[0].clientY,
      };
      const newPoint2 = {
        x: touches[1].clientX,
        y: touches[1].clientY,
      };
      const [centerX, centerY] = getCenter(point1, point2, newPoint1, newPoint2);
      const ratio = getDistance(newPoint1, newPoint2) / getDistance(point1, point2);

      dispatchZoomChange(ratio, 'touchZoom', centerX, centerY, true);
      updateTouchPointInfo({
        point1: newPoint1,
        point2: newPoint2,
        eventType: 'touchZoom',
      });
    } else if (eventType === 'move') {
      // touch move
      updateTransform(
        {
          x: touches[0].clientX - point1.x,
          y: touches[0].clientY - point1.y,
        },
        'move',
      );
      updateTouchPointInfo({ eventType: 'move' });
    }
  };

  const onTouchEnd = () => {
    if (isTouching) {
      setIsTouching(false);
    }

    updateTouchPointInfo({ eventType: 'none' });

    if (minScale > scale) {
      /** When the scaling ratio is less than the minimum scaling ratio, reset the scaling ratio */
      return updateTransform({ x: 0, y: 0, scale: minScale }, 'touchZoom');
    }

  };


  useEffect(() => {
    const handler = e => e.preventDefault()

    window.addEventListener('touchmove', handler, { passive: false });

    return () => {
      window.removeEventListener('touchmove', handler, { passive: false });
    };
  }, []);

  return {
    isTouching,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }

}
