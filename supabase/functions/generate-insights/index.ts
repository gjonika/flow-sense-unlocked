
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const { projects } = await req.json();
    
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      throw new Error('No valid projects provided');
    }

    // Create prompt for Gemini API
    const prompt = `
    You are an AI assistant for a project dashboard. Given the following projects with progress, tags, and activity logs, provide:

    1. A brief summary of each project's state.
    2. Suggested next actions or improvements.
    3. Any trends or insights across projects.

    Data:
    ${JSON.stringify(projects, null, 2)}

    Format your response with three separate sections:
    - SUMMARY: (project summary information)
    - SUGGESTIONS: (actionable suggestions for projects)
    - TRENDS: (cross-project insights and patterns)

    Keep each section concise and focused on actionable insights.
    `;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the text from Gemini's response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the sections from the text
    const summaryMatch = text.match(/SUMMARY:([\s\S]*?)(?=SUGGESTIONS:|$)/i);
    const suggestionsMatch = text.match(/SUGGESTIONS:([\s\S]*?)(?=TRENDS:|$)/i);
    const trendsMatch = text.match(/TRENDS:([\s\S]*?)$/i);
    
    const result = {
      summary: summaryMatch ? summaryMatch[1].trim() : 'No summary generated',
      suggestions: suggestionsMatch ? suggestionsMatch[1].trim() : 'No suggestions generated',
      trends: trendsMatch ? trendsMatch[1].trim() : 'No trends generated',
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-insights function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
