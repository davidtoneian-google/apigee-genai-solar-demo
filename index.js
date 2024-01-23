const express = require('express');
const {VertexAI} = require('@google-cloud/vertexai');
const app = express();
const port = 8080;

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: process.env.PROJECT, location: process.env.AI_REGION});
const model = 'gemini-pro';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    "max_output_tokens": 2048,
    "temperature": 0.9,
    "top_p": 1
  },
});

const chat = generativeModel.startChat({});

app.use(express.static('public'));

app.get('/chat', (req, res) => {

  let question = req.query.question;
  console.log(question);

  generativeModel.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: question
          }
        ]
      }
    ]
  }).then((response) => {
    console.log(response.response.candidates[0].content.parts[0].text);
    res.send(response.response.candidates[0].content.parts[0].text);
  });

  // chat.sendMessage("What's new in the world?").then((response) => {
  //   console.log(response.response.candidates[0].content.parts[0].text);
  //   res.send(response.response.candidates[0].content.parts[0].text);
  // });
});

app.get('/solar', (req, res) => {

  let address = req.query.address;
  console.log(address);
  fetch(process.env.API_PATH, {
    body: JSON.stringify({
      "address": address
    }),
    method: "POST",
    headers: {
      Accept: "application/json"
    },
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    res.send(data);
  });
});
  
app.listen(port, () => {
  console.log(`Vertex chat applistening on port ${port}`);
})
