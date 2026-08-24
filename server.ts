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
      const { prompt, history, schedule } = req.body;
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
User History (Patterns): ${JSON.stringify(history || [])}
Current Schedule (Today's timeblocks): ${JSON.stringify(schedule || [])}

Instructions:
1. Intent & Project: Extract the core intent. If a project is mentioned (e.g. "BPO"), extract it as 'project'. Assign priority based on task weight (e.g. presentations are 'high').
2. Estimation: Predict 'estimatedMinutes'. Use User History if similar tasks exist. If not, use sensible defaults (Gym=45, Email=15, Presentation=90, Grocery=30).
3. Smart Scheduling: If the user implies they need to do it at a specific day but no time is given (or if a time is missing), set 'needsSlot' to true. Look at the 'Current Schedule' gaps and suggest a free time slot in 'suggestedTime' (HH:mm format).
4. Provide an 'explanation' string (e.g. "I found a 90-minute slot at 09:00 based on your schedule. Schedule it?").
5. Set 'inferredFromHistory' if you used history to estimate the duration.
Request: "${prompt}"`,
        config: {
          systemInstruction: "You are a highly intelligent AI assistant for a personal operating system. You don't just parse text; you understand intent, estimate task duration, and suggest optimal scheduling. Resolve relative dates like 'tomorrow' using the provided Current Date.",
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
                description: "The due time in HH:mm format if the user explicitly provided it.",
              },
              estimatedMinutes: {
                type: Type.NUMBER,
                description: "Estimated duration in minutes.",
              },
              project: {
                type: Type.STRING,
                description: "The best fitting project or category name (e.g. 'Health', 'Work', 'BPO').",
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of tags relevant to the task.",
              },
              priority: {
                type: Type.STRING,
                description: "Priority of the task: 'low', 'medium', 'high', or 'urgent'. Infer this intelligently.",
              },
              needsSlot: {
                type: Type.BOOLEAN,
                description: "Set to true if the task needs to be scheduled but no specific time was explicitly provided by the user."
              },
              suggestedTime: {
                type: Type.STRING,
                description: "A suggested time in HH:mm format, found by looking at Current Schedule gaps, if needsSlot is true."
              },
              explanation: {
                type: Type.STRING,
                description: "A conversational, brief assistant message explaining the estimation and suggested time. E.g. 'I estimated 90 mins for the presentation and found a slot at 09:00 AM. Schedule it?'"
              },
              inferredFromHistory: {
                type: Type.BOOLEAN,
                description: "Set to true if time or duration was inferred from User History instead of explicitly stated in the prompt."
              }
            },
            required: ['type', 'title'],
          }
        }
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
