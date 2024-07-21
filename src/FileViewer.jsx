/* eslint-disable react/prop-types */
import './FileViewer.css'

import { useMouseEvent } from './useMouseEvent'
import { useFileTransform } from './useFileTransform.js'
import { useEffect, useMemo, useRef, useState } from 'react'

const BASE_SCALE_RATIO = 1
const scaleStep = 0.5
const minScale = 1

import { PdfViewer } from './PdfViewer'
import { ImgViewer } from './ImgViewer'
import { useTouchEvent } from './useTouchEvent.ts'


export const FileViewer = ({ src, width, height }) => {
  const viewerRef = useRef(null)
  const fileRef = useRef(null)
  const fileViewerWrapperRef = useRef(null)
  const [dragWrapperSize, setDragWrapperSize] = useState(() => ({ width: 0, height: 0 }))
  const [fileSize, setFileSize] = useState(() => ({ width, height }))

  const isPdf = useMemo(() => {
    return src.endsWith('.pdf')
  }, [src])

  const [isReady, setIsReady] = useState(false)

  const [, setRefresh] = useState(0)

  const { updateTransform, resetTransform, transform, dispatchZoomChange } = useFileTransform({ fileRef })

  const { isMoving, onWheel, onMouseDown, onMouseMove } = useMouseEvent({
    containerRef: fileViewerWrapperRef,
    dispatchZoomChange,
    transform,
    updateTransform
  })


  const { isTouching, onTouchStart, onTouchMove, onTouchEnd } = useTouchEvent({
    transform,
    updateTransform,
    dispatchZoomChange,
  });


  // calc file size after file load
  useEffect(() => {
    const fitWidth = viewerRef.current?.offsetWidth - 40

    if (viewerRef.current && (!fileSize.width || fileSize.width > fitWidth)) {
      setFileSize({
        width: fitWidth,
        height: undefined
      })
    }
  }, [viewerRef.current])

  // calc drag wrapper size after file load
  useEffect(() => {
    if (fileRef.current) {
      setDragWrapperSize({
        width: fileRef.current.offsetWidth,
        height: fileRef.current.offsetHeight,
      })
    }
  }, [fileRef.current])


  // reset transform
  const onDoubleClick = () => {
    updateTransform({ x: 0, y: 0, scale: minScale });
  }

  // zoom in
  const onZoomIn = () => {
    dispatchZoomChange(BASE_SCALE_RATIO + scaleStep);
  };
  // zoom out
  const onZoomOut = () => {
    dispatchZoomChange(BASE_SCALE_RATIO / (BASE_SCALE_RATIO + scaleStep));
  };

  const handleOnLoad = () => {
    // force render
    setRefresh(prevRefresh => prevRefresh + 1)
    // source is ready
    setIsReady(true)
  }

  return (
    <div className="xt-file-viewer-wrapper" ref={viewerRef}>
      <div className="xt-file-viewer-wrapper-inner"
        ref={fileViewerWrapperRef}
        onDoubleClick={onDoubleClick}
      >
        {
          isPdf
            ? <PdfViewer
              ref={fileRef}
              className="xt-file-viewer-file"
              src={src}
              width={fileSize.width}
              height={fileSize.height}
              style={{
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale3d(${transform.scale}, ${transform.scale}, 1)`,
                transitionDuration: (isMoving || isTouching) && '0s',
              }}
              onLoad={handleOnLoad}
            />
            : <ImgViewer
              ref={fileRef}
              className="xt-file-viewer-file"
              src={src}
              width={fileSize.width}
              height={fileSize.height}
              style={{
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale3d(${transform.scale}, ${transform.scale}, 1)`,
                transitionDuration: (isMoving || isTouching) && '0s',
              }}
              onLoad={handleOnLoad}
            />
        }
        <div className='xt-file-viewer-file-drag-wrapper'
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            width: dragWrapperSize.width,
            height: dragWrapperSize.height,
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale3d(${transform.scale}, ${transform.scale}, 1)`,
            transitionDuration: (isMoving || isTouching) && '0s',
          }}>
          {
            isReady && (
              <button
                className='xt-file-viewer-file-annotation'
                style={{
                  transform: 'translate3d(75px, 75px, 0)',
                }}>
                1
              </button>
            )
          }

        </div>

        <div style={{ display: 'flex', gap: 12, position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
          <button onClick={onZoomIn}>+</button>
          <button onClick={onZoomOut}>-</button>
          <button onClick={resetTransform}>1:1</button>
        </div>
      </div>
    </div >
  )
}
