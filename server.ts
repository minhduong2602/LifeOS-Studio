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

  // Universal Multi-Provider AI Completion Helper
  async function executeAICompletion(options: {
    config?: {
      provider?: 'gemini' | 'openrouter' | 'openai' | 'custom';
      apiKey?: string;
      model?: string;
      baseUrl?: string;
      temperature?: number;
    };
    prompt: string;
    systemInstruction: string;
    jsonSchema?: any;
  }): Promise<any> {
    const { config, prompt, systemInstruction, jsonSchema } = options;
    const provider = config?.provider || 'gemini';
    const envKey = (
      provider === 'gemini' ? (process.env.GEMINI_API_KEY || '') :
      provider === 'openrouter' ? (process.env.OPENROUTER_API_KEY || '') :
      provider === 'openai' ? (process.env.OPENAI_API_KEY || '') :
      (process.env.CUSTOM_AI_API_KEY || '')
    );
    const apiKey = config?.apiKey || envKey;
    const model = config?.model || (
      provider === 'openrouter' ? 'google/gemini-2.5-flash' :
      provider === 'openai' ? 'gpt-4o-mini' :
      provider === 'custom' ? 'llama3.3' :
      'gemini-2.5-flash'
    );

    // 1. Google Gemini Provider
    if (provider === 'gemini') {
      const activeKey = apiKey || process.env.GEMINI_API_KEY;
      if (!activeKey) {
        throw new Error('Gemini API key is not configured. Please set it in Settings or GEMINI_API_KEY.');
      }
      const ai = new GoogleGenAI({
        apiKey: activeKey,
        httpOptions: { headers: { 'User-Agent': 'lifeos-build' } },
      });

      const response = await ai.models.generateContent({
        model: model.replace(/^google\//, ''),
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: jsonSchema ? 'application/json' : undefined,
          responseSchema: jsonSchema,
          temperature: config?.temperature ?? 0.2,
        },
      });

      const raw = response.text || '{}';
      if (jsonSchema) {
        const jsonMatch = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      }
      return raw;
    }

    // 2. OpenRouter, OpenAI, and Custom OpenAI-Compatible Providers
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey || 'no-key'}`,
    };

    if (provider === 'openrouter') {
      endpoint = config?.baseUrl || 'https://openrouter.ai/api/v1/chat/completions';
      headers['HTTP-Referer'] = 'http://localhost:3000';
      headers['X-Title'] = 'LifeOS Studio';
    } else if (provider === 'custom') {
      const base = (config?.baseUrl || 'http://localhost:11434/v1').replace(/\/+$/, '');
      endpoint = `${base}/chat/completions`;
    }

    const messages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ];

    const bodyPayload: any = {
      model,
      messages,
      temperature: config?.temperature ?? 0.2,
    };

    if (jsonSchema) {
      bodyPayload.response_format = { type: 'json_object' };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      let parsedErr = errText;
      try {
        const errObj = JSON.parse(errText);
        parsedErr = errObj.error?.message || errObj.message || errText;
      } catch (e) {}
      throw new Error(`${provider.toUpperCase()} API error (${res.status}): ${parsedErr}`);
    }

    const data: any = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';

    if (jsonSchema) {
      const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : content);
    }
    return content;
  }

  // Test Connection Route
  app.post('/api/ai-test-connection', async (req, res) => {
    const startTime = Date.now();
    try {
      const { provider, apiKey, model, baseUrl } = req.body;
      const testPrompt = 'Respond with a brief valid JSON object: {"status":"connected","message":"Service is online."}';
      const systemInstruction = 'You are a service connectivity ping probe. Always reply in valid JSON format only.';

      const result = await executeAICompletion({
        config: { provider, apiKey, model, baseUrl },
        prompt: testPrompt,
        systemInstruction,
        jsonSchema: true,
      });

      const latencyMs = Date.now() - startTime;
      res.json({
        success: true,
        latencyMs,
        provider: provider || 'gemini',
        model: model || 'default',
        result,
      });
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      res.status(500).json({
        success: false,
        latencyMs,
        error: error.message || 'Connection failed',
      });
    }
  });

  // Check which keys are present in .env
  app.get('/api/ai-env-status', (req, res) => {
    res.json({
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      custom: Boolean(process.env.CUSTOM_AI_API_KEY),
    });
  });

  // Task parser route with multi-provider support
  app.post('/api/parse-task', async (req, res) => {
    try {
      const { prompt, history, schedule, aiConfig } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const promptContent = `Parse the following natural language request into a task object. The user is asking to do something or add something to their Life OS. Convert their natural language into structured data. Return ONLY valid JSON matching the schema. 
Current Date & Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}
User History (Patterns): ${JSON.stringify(history || [])}
Current Schedule (Today's timeblocks): ${JSON.stringify(schedule || [])}

Instructions:
1. Intent & Project: Extract the core intent. If a project is mentioned (e.g. "BPO"), extract it as 'project'. Assign priority based on task weight (e.g. presentations are 'high').
2. Estimation: Predict 'estimatedMinutes'. Use User History if similar tasks exist. If not, use sensible defaults (Gym=45, Email=15, Presentation=90, Grocery=30).
3. Smart Scheduling: If the user implies they need to do it at a specific day but no time is given (or if a time is missing), set 'needsSlot' to true. Look at the 'Current Schedule' gaps and suggest a free time slot in 'suggestedTime' (HH:mm format).
4. Provide an 'explanation' string (e.g. "I found a 90-minute slot at 09:00 based on your schedule. Schedule it?").
5. Set 'inferredFromHistory' if you used history to estimate the duration.
Request: "${prompt}"`;

      const result = await executeAICompletion({
        config: aiConfig,
        prompt: promptContent,
        systemInstruction: "You are a highly intelligent AI assistant for a personal operating system. You don't just parse text; you understand intent, estimate task duration, and suggest optimal scheduling. Resolve relative dates like 'tomorrow' using the provided Current Date. Output JSON strictly.",
        jsonSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Item type: 'task', 'lecture', 'habit', or 'image'" },
            title: { type: Type.STRING, description: "Title of the item" },
            dueDate: { type: Type.STRING, description: "YYYY-MM-DD" },
            dueTime: { type: Type.STRING, description: "HH:mm" },
            estimatedMinutes: { type: Type.NUMBER, description: "Duration in minutes" },
            project: { type: Type.STRING, description: "Project category name" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            priority: { type: Type.STRING, description: "low, medium, high, urgent" },
            needsSlot: { type: Type.BOOLEAN },
            suggestedTime: { type: Type.STRING },
            explanation: { type: Type.STRING },
            inferredFromHistory: { type: Type.BOOLEAN },
          },
          required: ['type', 'title'],
        },
      });

      res.json(result);
    } catch (error: any) {
      console.error('Error parsing task:', error);
      res.status(500).json({ error: 'Failed to parse task', details: error.message });
    }
  });

  // Daily AI Planner Route with multi-provider support
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
        aiConfig,
      } = req.body;

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
1. Language: Output all titles, summaries, coach advice, and rationales in natural Vietnamese (Tiếng Việt).
2. Priority & Energy Alignment: Schedule 'urgent' and 'high' priority tasks first during peak focus periods (${profile.peakFocusPeriod}).
3. Realistic Time Slots: Form formatted slots like "08:30 - 09:30", "09:40 - 10:40" (respecting buffer gaps).
4. Wellness & Habits: Weave in relevant daily habits (e.g. workout, meditation, reading) and protect the lunch slot at ${profile.lunchStart}.
5. Burnout Prevention: If total deep work exceeds 5 hours, flag burnoutRiskScore as 'moderate' or 'high', and defer lower-priority tasks to 'unplacedTasks'.
6. Clear Rationale: Provide a brief 1-sentence 'rationale' in Vietnamese for each timeblock explaining why it was placed there.
7. Link IDs: If a timeblock corresponds to an input task, habit, or lecture, include its 'taskId', 'habitId', or 'lectureId'.

Return valid JSON matching the schema.`;

      const result = await executeAICompletion({
        config: aiConfig,
        prompt: promptContent,
        systemInstruction: "You are an elite productivity strategist and executive life copilot. You optimize daily schedules balancing peak cognitive performance, deep work, essential habits, and rest. Always generate response texts (titles, summaries, coach advice, rationales) in fluent Vietnamese (Tiếng Việt). Output valid JSON strictly.",
        jsonSchema: {
          type: Type.OBJECT,
          properties: {
            strategySummary: { type: Type.STRING },
            totalDeepWorkMinutes: { type: Type.NUMBER },
            burnoutRiskScore: { type: Type.STRING },
            coachAdvice: { type: Type.STRING },
            timeBlocks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeSlot: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  taskId: { type: Type.STRING },
                  habitId: { type: Type.STRING },
                  lectureId: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                },
                required: ['timeSlot', 'title', 'category', 'rationale'],
              },
            },
            unplacedTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['title', 'reason'],
              },
            },
          },
          required: ['strategySummary', 'totalDeepWorkMinutes', 'burnoutRiskScore', 'coachAdvice', 'timeBlocks'],
        },
      });

      res.json(result);
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
