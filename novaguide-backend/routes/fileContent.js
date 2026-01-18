var express = require("express"); // Import Express framework
var router = express.Router(); // Create an Express Router
var axios = require("axios"); // Import Axios for making HTTP requests

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource"); // Basic GET route response
});

// POST endpoint to handle AI question-answering based on uploaded file content
router.post("/ask", async (req, res) => {
  const { fileContent, question } = req.body; // Extract file content and question from the request body

  try {
    // Build the prompt by combining system instruction + file content + user question
    const prompt = `
You are a helpful assistant who answers questions based on uploaded file content.

File content:
${fileContent}

Question:
${question}
  `;

    // Send POST request to ApiFreeLLM chat endpoint
    const response = await axios.post(
      "https://apifreellm.com/api/v1/chat",
      {
        message: prompt, // The full prompt sent to the LLM
      },
      {
        headers: {
          "Content-Type": "application/json", // Specify JSON request format
          Authorization: `Bearer ${process.env.APIFREELLM_KEY}`, // API key from environment variables
        },
      },
    );

    // Send only the AI-generated answer back to the client
    res.json({
      answer: response.data?.response || "No response received.",
    });
  } catch (error) {
    // Log the API error details for debugging
    console.error("ApiFreeLLM error:", error.response?.data || error.message);

    // Return a generic error message to the client
    res.status(500).json({ error: "Failed to get response from ApiFreeLLM" });
  }
});

module.exports = router; // Export the router for use in app.js
