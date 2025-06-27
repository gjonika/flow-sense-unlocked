
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

    const prompt = `Act as a project task breakdown assistant.

Given this project analysis text:

${analysisText}

Return a JSON array of actionable tasks. Each task should be practical, assigned to the overall project, and avoid repetition.

Format each task as:
{
  "title": "Clear, actionable task title",
  "description": "Brief description of what needs to be done",
  "priority": "high" | "medium" | "low",
  "category": "Setup" | "Design" | "Development" | "Testing" | "Deployment" | "Research" | "Planning"
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
            content: 'You are a project management assistant that breaks down project analysis into actionable tasks. Always respond with valid JSON arrays only, no markdown formatting.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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
      // Fallback: create basic tasks
      tasks = [
        {
          title: "Review project requirements",
          description: "Analyze the provided project analysis text",
          priority: "high",
          category: "Planning"
        },
        {
          title: "Create project structure",
          description: "Set up the basic project structure and files",
          priority: "medium",
          category: "Setup"
        },
        {
          title: "Implement core functionality",
          description: "Build the main features based on analysis",
          priority: "high",
          category: "Development"
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
    console.error('Error in generate-tasks function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
