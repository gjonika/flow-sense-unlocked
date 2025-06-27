
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

    // Format the project data for the prompt, mapping DB column names to more readable formats
    const projectData = projects.map(project => ({
      name: project.name,
      progress: project.progress,
      // Map DB column names to camelCase for the prompt
      nextAction: project.nextaction || "No next action specified",
      lastUpdated: project.lastupdated,
      tags: project.tags || []
    }));

    // Log the processed data for debugging
    console.log(`Processing ${projectData.length} projects for AI insights`);

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Construct the prompt and messages for OpenAI
    const systemPrompt = `You are a productivity AI assistant. For each project, return:
1. A one-line project status summary
2. A suggested next action
3. A motivational message to encourage progress

Return ONLY a valid JSON array with no additional text or explanation, where each object contains:
- summary: A concise 1-sentence summary of the project status
- suggestion: A specific, actionable next step suggestion
- motivation: A short, personalized motivational message`;

    const userPrompt = `Projects:\n${JSON.stringify(projectData, null, 2)}`;

    // Implement retry logic for API calls
    const maxRetries = 2;
    let retries = 0;
    let response;
    let data;

    while (retries <= maxRetries) {
      try {
        // Call OpenAI API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            temperature: 0.5, // Lower temperature for more deterministic output
            max_tokens: 1024,
            response_format: { type: "json_object" }, // Explicitly request JSON format
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // Check for HTTP errors
        if (!response.ok) {
          const errorData = await response.json();
          console.error('OpenAI API error:', JSON.stringify(errorData));
          throw new Error(`OpenAI API error: ${errorData.error?.message || JSON.stringify(errorData)}`);
        }
        
        data = await response.json();
        break; // Success, exit the retry loop
      } catch (apiError) {
        retries++;
        console.error(`API call attempt ${retries} failed:`, apiError);
        
        if (apiError.name === 'AbortError') {
          console.error('Request timed out');
          if (retries > maxRetries) {
            throw new Error('OpenAI API request timed out after multiple attempts');
          }
        } else if (retries > maxRetries) {
          throw apiError;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      }
    }
    
    // Validate API response structure
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI API response format:', JSON.stringify(data));
      throw new Error('Invalid response format from OpenAI API');
    }
    
    // Extract the text response from OpenAI and parse as JSON
    let aiInsights;
    try {
      const rawText = data.choices[0].message.content;
      console.log('Raw OpenAI response length:', rawText.length);
      
      // Extract JSON from the response, handling various formats
      let jsonText = rawText;
      
      // Remove code block markers if present
      if (rawText.includes('```json')) {
        jsonText = rawText.replace(/```json|```/g, '').trim();
      }
      
      // If the content has a wrapping object, extract just the insights array
      let parsedContent = JSON.parse(jsonText);
      
      // Check if we have a nested structure or an array directly
      if (parsedContent.insights && Array.isArray(parsedContent.insights)) {
        aiInsights = parsedContent.insights;
      } else if (Array.isArray(parsedContent)) {
        aiInsights = parsedContent;
      } else {
        // Try to find an array in the response
        const possibleArrayKeys = Object.keys(parsedContent).filter(
          key => Array.isArray(parsedContent[key])
        );
        
        if (possibleArrayKeys.length > 0) {
          aiInsights = parsedContent[possibleArrayKeys[0]];
        } else {
          throw new Error('Could not find an insights array in the response');
        }
      }
      
      // Validate that the parsed result is an array with required fields
      if (!Array.isArray(aiInsights) || aiInsights.length === 0) {
        throw new Error('OpenAI did not return a valid insights array');
      }
      
      // Validate each insight has the required fields
      const validInsights = aiInsights.filter(insight => 
        insight && typeof insight.summary === 'string' && 
        typeof insight.suggestion === 'string' && 
        typeof insight.motivation === 'string'
      );
      
      if (validInsights.length < aiInsights.length) {
        console.warn(`Some insights (${aiInsights.length - validInsights.length}) were invalid and filtered out`);
      }
      
      if (validInsights.length === 0) {
        throw new Error('No valid insights found in the AI response');
      }
      
      aiInsights = validInsights;
      
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response was:', data.choices?.[0]?.message?.content);
      throw new Error('Failed to parse AI response: ' + parseError.message);
    }

    return new Response(JSON.stringify({ insights: aiInsights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in generate-ai-insights function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "AI insights could not be generated at the moment. Please try again later.",
      details: error.stack, // Include stack trace for debugging
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
