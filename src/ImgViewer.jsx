/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { pdfjs, } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const ImgViewer = React.forwardRef((props, ref) => {
  const { src, width, height, style, onLoad, ...restProps } = props

  const handleOnLoad = () => {
    onLoad?.()
  }

  return (
    <img
      ref={ref}
      width={width}
      height={height}
      src={src}
      style={{ ...style }}
      {...restProps}
      onLoad={handleOnLoad}
    />
  )
})
