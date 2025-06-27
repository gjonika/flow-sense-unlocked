
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { analysisText } = await req.json();

    if (!analysisText?.trim()) {
      throw new Error('Analysis text is required');
    }

    const prompt = `Act as a production readiness task breakdown assistant.

Given this diagnostic analysis text:

${analysisText}

Return a structured list of tasks. For each task, include:

* **Title**: short, clear, actionable task title
* **Description**: concise clarification if needed (optional)
* **Category**: one of Security, UX, Design, Performance, Integrations, i18n, Testing, Documentation, Deployment, Planning, Setup, Development, Research, or General
* **Priority**: High, Medium, or Low

Focus on breaking down complex diagnostic information into specific, actionable tasks that can be assigned and tracked. Prioritize based on impact and urgency for production readiness.

Format each task as:
{
  "title": "Clear, actionable task title",
  "description": "Brief description of what needs to be done (optional)",
  "priority": "High" | "Medium" | "Low",
  "category": "Security" | "UX" | "Design" | "Performance" | "Integrations" | "i18n" | "Testing" | "Documentation" | "Deployment" | "Planning" | "Setup" | "Development" | "Research" | "General"
}

Return ONLY the JSON array, no markdown formatting, no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a production readiness task breakdown assistant that specializes in converting diagnostic analysis and audit reports into structured, actionable tasks. Always respond with valid JSON arrays only, no markdown formatting.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let generatedContent = data.choices[0].message.content;

    // Clean up the response - remove markdown formatting if present
    generatedContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON response
    let tasks;
    try {
      tasks = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', generatedContent);
      // Fallback: create structured tasks
      tasks = [
        {
          title: "Review diagnostic analysis requirements",
          description: "Analyze the provided diagnostic text for key action items",
          priority: "High",
          category: "Planning"
        },
        {
          title: "Identify security vulnerabilities",
          description: "Address any security issues found in the analysis",
          priority: "High",
          category: "Security"
        },
        {
          title: "Optimize performance bottlenecks",
          description: "Implement performance improvements based on analysis",
          priority: "Medium",
          category: "Performance"
        }
      ];
    }

    // Ensure tasks is an array
    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }

    return new Response(JSON.stringify({ tasks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-structured-tasks function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
