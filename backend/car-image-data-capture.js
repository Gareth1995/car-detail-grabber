require('dotenv').config();

const cors = require('cors'); // Import the cors package
const express = require('express');

const app = express();
app.use(cors()); // Use the cors middleware
app.use(express.json());

app.post('/invoke-llm', async (req, res) => {
    try {
        console.log('llm invoked');
        // Perform any LLM invocation logic here.
        res.status(200).send('LLM invocation successful');
      } catch (err) {
        console.error('Error invoking LLM:', err);
        res.status(500).send('Internal Server Error');
      }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});