import React from 'react'
import { Document } from 'react-pdf';


const Resume = () => {
  return (
    <div>
      <Document
        file="..\..\assets\documents\SooHoon_Choi_2021_Resume.pdf"
      >

      </Document>
    </div>
  )
}

export default Resume;
