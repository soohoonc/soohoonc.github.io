import React from 'react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import {pdfjs} from 'react-pdf';

import resume from '../../assets/documents/resume.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Resume = () => {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center'
    }}>
      <Document
        file={resume}
        onLoadError={console.error}
      >
        <Page pageNumber={1} />
      </Document>
    </div>
  )
}

export default Resume;
