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

  app.post('/api/ai-planner', async (req, res) => {
    try {
      const {
        tasks = [],
        habits = [],
        lectures = [],
        currentTime,
        currentDate,
        energyProfile,
        recalibrationPrompt,
        currentBlocks = [],
      } = req.body;

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

      const profile = {
        workStart: energyProfile?.workStart || '08:30',
        workEnd: energyProfile?.workEnd || '18:00',
        lunchStart: energyProfile?.lunchStart || '12:00',
        lunchDurationMinutes: energyProfile?.lunchDurationMinutes || 60,
        peakFocusPeriod: energyProfile?.peakFocusPeriod || 'morning',
        bufferMinutes: energyProfile?.bufferMinutes || 10,
      };

      const promptContent = `You are the Master Executive Copilot & Daily Planning Engine for LifeOS Studio.
Generate an optimal, realistic, and energizing daily schedule from the user's tasks, habits, and study items.

CURRENT CONTEXT:
- Date: ${currentDate || new Date().toDateString()}
- Current Time: ${currentTime || '08:30'}
- Workday Window: ${profile.workStart} to ${profile.workEnd}
- Lunch: ${profile.lunchStart} (${profile.lunchDurationMinutes} mins)
- Peak Focus Period: ${profile.peakFocusPeriod} (Place deep work, high priority tasks here)
- Buffer Between Intense Blocks: ${profile.bufferMinutes} mins

INPUT DATA:
- Active Tasks to schedule: ${JSON.stringify(tasks)}
- Daily Habits to weave in: ${JSON.stringify(habits)}
- Lectures/Study items: ${JSON.stringify(lectures)}
- Existing/Current Blocks: ${JSON.stringify(currentBlocks)}
${recalibrationPrompt ? `- User's Specific Custom Instruction / Recalibration Request: "${recalibrationPrompt}"` : ''}

SCHEDULING RULES:
1. Priority & Energy Alignment: Schedule 'urgent' and 'high' priority tasks first during peak focus periods (${profile.peakFocusPeriod}).
2. Realistic Time Slots: Form formatted slots like "08:30 - 09:30", "09:40 - 10:40" (respecting buffer gaps).
3. Wellness & Habits: Weave in relevant daily habits (e.g. workout, meditation, reading) and protect the lunch slot at ${profile.lunchStart}.
4. Burnout Prevention: If total deep work exceeds 5 hours, flag burnoutRiskScore as 'moderate' or 'high', and defer lower-priority tasks to 'unplacedTasks'.
5. Clear Rationale: Provide a brief 1-sentence 'rationale' for each timeblock explaining why it was placed there.
6. Link IDs: If a timeblock corresponds to an input task, habit, or lecture, include its 'taskId', 'habitId', or 'lectureId'.

Return valid JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptContent,
        config: {
          systemInstruction: "You are an elite productivity strategist and executive life copilot. You optimize daily schedules balancing peak cognitive performance, deep work, essential habits, and rest.",
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strategySummary: {
                type: Type.STRING,
                description: "Executive briefing of the day's strategic plan and focus emphasis."
              },
              totalDeepWorkMinutes: {
                type: Type.NUMBER,
                description: "Total scheduled deep work duration in minutes."
              },
              burnoutRiskScore: {
                type: Type.STRING,
                description: "Risk of cognitive exhaustion: 'low', 'moderate', or 'high'."
              },
              coachAdvice: {
                type: Type.STRING,
                description: "Actionable, motivating coaching tip for maximum focus and flow today."
              },
              timeBlocks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timeSlot: { type: Type.STRING, description: "Formatted slot (e.g. '08:30 - 09:30')" },
                    title: { type: Type.STRING, description: "Concise title of the activity" },
                    category: { 
                      type: Type.STRING, 
                      description: "Category: 'deep_work', 'meeting', 'admin', 'break', or 'personal'" 
                    },
                    taskId: { type: Type.STRING, description: "ID of associated task if applicable" },
                    habitId: { type: Type.STRING, description: "ID of associated habit if applicable" },
                    lectureId: { type: Type.STRING, description: "ID of associated lecture if applicable" },
                    rationale: { type: Type.STRING, description: "Why this was scheduled here" }
                  },
                  required: ['timeSlot', 'title', 'category', 'rationale']
                }
              },
              unplacedTasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['title', 'reason']
                }
              }
            },
            required: ['strategySummary', 'totalDeepWorkMinutes', 'burnoutRiskScore', 'coachAdvice', 'timeBlocks']
          }
        }
      });

      let jsonOutput = response.text || "{}";
      const jsonMatch = jsonOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonOutput = jsonMatch[0];
      }
      const planResult = JSON.parse(jsonOutput);
      res.json(planResult);
    } catch (error: any) {
      console.error('Error generating AI schedule plan:', error);
      res.status(500).json({ error: 'Failed to generate AI schedule plan', details: error.message });
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
