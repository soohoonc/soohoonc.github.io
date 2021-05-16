import React from 'react'
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
// import { pdfjs } from 'react-pdf';

// import resume from '../../assets/documents/resume.pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Resume = () => {
  return (
    // <div style={{
    //   display: 'flex', justifyContent: 'center'
    // }}>
    //   <Document
    //     file={resume}
    //     onLoadError={console.error}
    //   >
    //     <Page pageNumber={1} />
    //   </Document>
    // </div>
    <div>
      <div>
        <h1>Education</h1>
        <div>
          <h3>Georgia Institute of Technology</h3>
          Masters of Science in Computer Science
          Specialization in Machine Learning
          Enrolled in the BS/MS track
          Expected Graduation Date: May 2024
        </div>
        <div>
          <h3>Georgia Institute of Technology</h3>
          <p>
            Bachelor of Science in Computer Science and Mathematics

            GPA 4.0/4.0
            Expected Graduation Date: May 2023
          </p>
        </div>
      </div>
      <div>
        <h1>Work Experience</h1>
        <div>
          <h3>Software Development Engineering Intern</h3>
          <p>
            Incoming SDE intern at AWS team at Amazon
          </p>
        </div>
        <div>
          <h3>Undergraduate Research Assistant</h3>
          <p>
            Research assistant at the Systems Neural Engineering Lab at Emory University.
          </p>
        </div>
      </div>
      <div>
        <h1>Projects</h1>
        <div>
        <h3>Grocery Delivery</h3>
        <p>
          Created a full stack application for my Database class (CS 4400) as an optional final assignment. Used MySQL, Express, React, and Node.js 
          to create. 
        </p>
      </div>
      <div>
        <h3>Farming Simulator</h3>
        <p>
          Created a farming game with a team of 5 for my Objects and Design class (CS 2340). Acted as the team lead in overseeing git pull requests
          and adhering to design principles. Created the project in Java and created the UI in JavaFX. 
        </p>
      </div>
      <div>
        <h3>8-bit Breadboard Computer</h3>
        <p>
          Built a 8-bit computer with various integrated circuit chips and breadboards inspired by Ben Eater on YouTube and
          my Computer Organization and Programming course (CS 2110). Implemented various components in the Von Neumann model such as the
          ALU, memory, control logic, clock, counter, and etc. Coded some simple programs in C, such as a counter and the fibonacci sequence
          and converted to assembly to learn more about low level programming.
        </p>
      </div>
    </div>
      <div>
        <h1>Skills</h1>
        <div>
          <h3>Programming Languages</h3>
          <p> Java, JavaScript, Python, C, C++, SQL, MATLAB</p>
        </div>
        <div>
          <h3>Technologies and Frameworks</h3>
          <p>
            React, Node, Express, MongoDB, Git, Bash, Latex
          </p>
        </div>
      </div>
      <div>
        <h1>Extracurriculars and Awards</h1>
        <div>

        </div>
      </div>
    </div>
  )
}

export default Resume;
