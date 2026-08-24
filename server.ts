import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/parse-task', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Parse the following natural language request into a task object. The user is asking to do something or add something to their Life OS. Convert their natural language into structured data. Return ONLY valid JSON matching the schema. 
Current Date & Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}
Request: "${prompt}"`,
        config: {
          systemInstruction: "You are a highly intelligent task parser for a personal operating system. Interpret user intents (often in Vietnamese or English) into precise task data. Resolve relative dates like 'tomorrow' using the provided Current Date.",
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                description: "The type of item to create: 'task', 'lecture', 'habit', or 'image'",
              },
              title: {
                type: Type.STRING,
                description: "The concise title of the task, habit, or lecture.",
              },
              dueDate: {
                type: Type.STRING,
                description: "The due date in YYYY-MM-DD format if applicable.",
              },
              dueTime: {
                type: Type.STRING,
                description: "The due time in HH:mm format if applicable.",
              },
              estimatedMinutes: {
                type: Type.NUMBER,
                description: "Estimated duration in minutes.",
              },
              project: {
                type: Type.STRING,
                description: "The best fitting project or category name (e.g. 'Health', 'Work', 'Study').",
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of tags relevant to the task.",
              },
              priority: {
                type: Type.STRING,
                description: "Priority of the task: 'low', 'medium', 'high', or 'urgent'. Default is 'medium'.",
              }
            },
            required: ['type', 'title'],
          },
        },
      });

      let jsonOutput = response.text || "{}";
      // Ensure we parse successfully by extracting just the JSON block
      const jsonMatch = jsonOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonOutput = jsonMatch[0];
      }
      const result = JSON.parse(jsonOutput);
      res.json(result);
    } catch (error: any) {
      console.error('Error parsing task:', error);
      res.status(500).json({ error: 'Failed to parse task', details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support for client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
