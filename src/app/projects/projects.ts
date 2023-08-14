export interface Project {
  title: string;
  summary: string | JSX.Element;
  date: string;
  media: string;
  link: string;
  description: string | JSX.Element;
}

export const projects = [
  {
    title: 'Simulartcra',
    summary: "A Review Aggregation Product to Address Sparse Reviews",
    date: 'August 2023',
    media: '/assets/images/projects/reviewr.jpg',
    link: '',
    description: `A product created to address the problem of sparse reviews, co-founded the company for my capstone class (CS 4883 X).
      Created a backend server in flask to scrape reviews from different websites.
      Launched to project into our company Tabnam.`
  },
  {
    title: 'Reviewr',
    summary: "A Review Aggregation Product to Address Sparse Reviews",
    date: 'October 2021 - March 2022',
    media: '/assets/images/projects/reviewr.jpg',
    link: '',
    description: `A product created to address the problem of sparse reviews, co-founded the company for my capstone class (CS 4883 X).
      Created a backend server in flask to scrape reviews from different websites.
      Launched to project into our company Tabnam.`
    },
    {
      title: 'Lox Interpreter',
      summary: "An interpreter from 'Crafting Interpreters' by Robert Nystrom",
      date: 'October 2021 - January 2022',
      media: '/assets/images/projects/lox.jpg',
      link: '',
      description: `A Hackathon project for Hack-a-lang 2021 (hosted by Georgia Tech's programming languages club, Dependently Typed).
        Implemented the Lox interpreter in Robert Nystrom's book in Python and added additional features such as support for arrays and indexing.`
    },
    {
      title: 'Style Transfer Visualization',
      summary: `Neural Style Transfer Process Implementation and Visualization`,
      date: 'November 2021 - January 2022',
      media: '/assets/images/projects/styletransfer.jpg',
      link: '',
      description: `Implemented the Neural Style Transfer network as described in the 2015 paper by Gatsby et al.
        The application takes in two images, a content and style image and merges them into one image.
        Wrote the neural network in Tensorflow and Keras.
        Working on visualizing the layers of the convolutional network via saliency map and/or GradCAM.`
    },
    {
      title: 'EVA-Feature Matching',
      summary: `Feature Extraction and Matching for the EVA database`,
      date: 'October 2021 - December 2021',
      media: '/assets/images/projects/eva.jpg',
      link: '',
      description: `Exploratory Visual Analytics Database is a visual data focused DBMS maintained by Georgia Tech.
        Pushed features for feature extraction and matching to the EVA repository.
        Used a pretrained VGG-16 model to extract features from frames for a video and used Facebook Research's FAISS library to each frame.`
    },
    {
      title: 'Stock Movement Prediction with Transformers',
      summary: `Transformers and LSTM Performance Comparison for Time Series Data`,
      date: 'November 2021 - Present',
      media: '/assets/images/projects/stocktransformer.jpg',
      link: '',
      description:`Used a Transformer encoder network (similar to BERT) in PyTorch to predict stock movement using historical pricing data from Yahoo Finance.
        Compared performance with the Long Short-Term Memory (LSTM) network as a baseline.
        Now parsing financial statements from companies and collecting fundamentals to test performance benefits on additional data.`
    },
    {
      title: 'Hurricane Prediction',
      summary: `Comparing Machine Learning Methods in Hurricane Prediction`,
      date: 'June 2021 - August 2021',
      media: '/assets/images/projects/hurricane.jpg',
      link: '',
      description: `Created a hurricane prediction model for the graduate machine learning course (CS 7641).
        Compared various traditional machine learning methods such as support vector machines, random forests, k-nearest neighbors and more.
        Built an LSTM based neural network in Tensorflow and Keras to create the final prediction model.`
    },
    {
      title: 'Grocery Delivery',
      summary: `Full Stack Application for Grocery Delivery`,
      date: 'March 2021 - May 2021',
      media: '/assets/images/projects/grocerydrone.jpg',
      link: '',
      description:`Created a full stack application for my Database class (CS 4400) as an optional final assignment.
        Used MySQL for the database, React for the frontend, and Express and Node.js for the backend.`
    },
    {
      title: 'Farming Game',
      summary: `Team Project for Developing a Farming Game`,
      date: 'August 2020 - December 2020',
      media: '/assets/images/projects/farmgame.jpg',
      link: '',
      description:`Created a farming game with a team of 5 for my Objects and Design class (CS 2340).
        Acted as the team lead in overseeing git pull requests and adhering to design principles. 
        Created the project in Java and created the UI in JavaFX.`
    },
    {
      title: '8-bit Computer',
      summary: `Building a Physical 8-Bit Computer`,
      date: 'January 2020 - May 2020',
      media: '/assets/images/projects/8bit.jpg',
      link: '',
      description:`Built a 8-bit computer with various integrated
        circuit chips and breadboards inspired by Ben Eater on YouTube 
        and my Computer Organization and Programming course (CS 2110).
        Implemented various components in the Von Neumann model such 
        as the ALU, memory, control logic, clock, counter, and etc.
        Coded some simple programs in C, such as a counter and the 
        fibonacci sequence and converted to assembly to learn more
        about low level programming.`
    },
  ];