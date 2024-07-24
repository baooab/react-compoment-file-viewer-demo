import { FileViewer } from './FileViewer'
import './App.css'
import pdfFileUrl from './assets/sample.pdf'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 375 }}>
      <FileViewer src={pdfFileUrl} points={[{x: 75, y: 50}, {x: 100, y: 100}]} />
      <FileViewer src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" points={[{x: 75, y: 50}, {x: 100, y: 100}]} />
    </div >
  )
}

export default App
