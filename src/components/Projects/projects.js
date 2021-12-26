
export const projects = [
  {title: 'Reviewr',
  description:
  <p>
    A product created to address the problem of sparse reviews, co-founded the company for my capstone class (CS 4883 X).
    Created a backend server in flask to scrape reviews from different websites.
    In the process of deploying to AWS and integrating a database solution for review caching.
  </p>},
  {title: 'Style Transfer Visualization',
  description:
  <p>
    Implemented the Neural Style Transfer network as described in the 2015 paper by Gatsby et al.
    The application takes in two images, a content and style image and merges them into one image.
    Wrote the neural network in Tensorflow and Keras.
    Working on visualizing the layers of the convolutional network via saliency map and/or GradCAM.
  </p>},
  {title: 'EVA-Feature Matching',
  description:
  <p>
    Exploratory Visual Analytics Database is a visual data focused DBMS maintained by Georgia Tech.
    Pushed features for feature extraction and matching to the EVA repository.
    Used a pretrained VGG-16 model to extract features from frames for a video and used Facebook Research's FAISS library to each frame.
  </p>},
  {title: 'Stock Movement Prediction with Transformers',
  description:
  <p>
    Used a Transformer encoder network (similar to BERT) in PyTorch to predict stock movement using historical pricing data from Yahoo Finance.
    Compared performance with the Long Short-Term Memory (LSTM) network as a baseline.
    Now parsing financial statements from companies and collecting fundamentals to test performance benefits on additional data.
  </p>},
  {title: 'Hurricane Prediction',
  description:
  <p>
    Created a hurricane prediction model for the graduate machine learning course (CS 7641).
    Compared various traditional machine learning methods such as support vector machines, random forests, k-nearest neighbors and more.
    Built an LSTM based neural network in Tensorflow and Keras to create the final prediction model.
  </p>},
  {title: 'Grocery Delivery',
  description:<p>
    Created a full stack application for my Database class (CS 4400) as an optional final assignment.
    Used MySQL for the database, React for the frontend, and Express and Node.js for the backend.
  </p>},
  {title: 'Farming Game', 
  description:<p>
    Created a farming game with a team of 5 for my Objects and Design class (CS 2340).
    Acted as the team lead in overseeing git pull requests and adhering to design principles. 
    Created the project in Java and created the UI in JavaFX. 
  </p>},
  {title: '8-bit Computer',
  description:<p>
    Built a 8-bit computer with various integrated
    circuit chips and breadboards inspired by Ben Eater on YouTube 
    and my Computer Organization and Programming course (CS 2110).
    Implemented various components in the Von Neumann model such 
    as the ALU, memory, control logic, clock, counter, and etc.
    Coded some simple programs in C, such as a counter and the 
    fibonacci sequence and converted to assembly to learn more
    about low level programming.
  </p>},
];