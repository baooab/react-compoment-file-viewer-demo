/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { pdfjs, Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const PdfViewer = React.forwardRef((props, ref) => {
  const { src, width, height, style, onLoad, ...restProps } = props

  const handleOnLoad = () => {
    onLoad?.()
  }

  return (
    <div width={width} height={height} style={{ ...style }} {...restProps}>
      <Document file={src} loading={null}>
        <Page inputRef={ref} renderTextLayer={false} devicePixelRatio={5} onRenderSuccess={handleOnLoad} pageNumber={1} width={width} height={height} />
      </Document>
    </div >
  )
})
