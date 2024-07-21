import { FileViewer } from './FileViewer'
import './App.css'
import pdfFileUrl from './assets/sample.pdf'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 375 }}>
      <FileViewer src={pdfFileUrl} />
      <FileViewer src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
    </div >
  )
}

export default App
