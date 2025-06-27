
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { projects } = await req.json();
    
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      throw new Error('Valid projects array is required');
    }

    // Log the processed data for debugging
    console.log('Analyzing projects for priorities:', projects.length);

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Construct the prompt and messages for OpenAI
    const systemPrompt = `You are a project prioritization AI assistant. 
Analyze the provided projects and identify two categories:

1. HIGH PRIORITY PROJECTS: Projects that are closest to launch, with high progress, recent activity, or milestones due soon.
2. NEGLECTED PROJECTS: Projects that haven't been updated in a long time or need attention.

Return ONLY a valid JSON object with no additional text or explanation, formatted as:
{
  "highPriority": [
    {
      "name": "Project Name",
      "reason": "Short one-line reason why this project is high priority",
      "priority": "high" or "medium"
    },
    ...
  ],
  "neglected": [
    {
      "name": "Project Name",
      "reason": "Short one-line reason why this project is neglected",
      "priority": "low"
    },
    ...
  ]
}

For each category, return at most 3 projects. For neglected projects, include how many days have passed since the last update in the reason.`;

    const userPrompt = `Projects:\n${JSON.stringify(projects, null, 2)}`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using newer model that's available
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    
    // Enhanced error handling for the OpenAI response
    if (!response.ok) {
      console.error('OpenAI API error:', JSON.stringify(data));
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI API response format:', JSON.stringify(data));
      throw new Error('Invalid response format from OpenAI API');
    }
    
    // Extract the text response from OpenAI
    let aiPriorities;
    try {
      const rawText = data.choices[0].message.content;
      console.log('Raw OpenAI prioritization response:', rawText);
      
      // Clean the response and parse as JSON
      const cleanText = rawText.trim().replace(/```json|```/g, '');
      aiPriorities = JSON.parse(cleanText);
      
      // Validate that the parsed result has the expected structure
      if (!aiPriorities.highPriority || !aiPriorities.neglected) {
        throw new Error('OpenAI did not return the expected JSON structure');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response was:', data.choices?.[0]?.message?.content);
      throw new Error('Failed to parse AI response: ' + parseError.message);
    }

    return new Response(JSON.stringify({ priorities: aiPriorities }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in generate-ai-priorities function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "Project priorities could not be generated at the moment. Please try again later." 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
