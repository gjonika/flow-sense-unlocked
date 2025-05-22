
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!projects || projects.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No project data provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format the project data for the AI model
    const prompt = `
You are an AI assistant for a project dashboard. Given the following projects with progress, tags, and activity logs, provide:

1. A brief summary of each project's state.
2. Suggested next actions or improvements.
3. Any trends or insights across projects.

Please provide the response in 3 separate sections under clear headings.

Data:
${JSON.stringify(projects, null, 2)}

Please maintain a professional but friendly tone. Keep each section concise and actionable.
`;

    try {
      // Check if we have a Gemini API key to use
      if (geminiApiKey) {
        console.log("Using Gemini API for insights generation");
        
        // Call Gemini API for text generation
        const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiApiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        });

        if (!geminiResponse.ok) {
          throw new Error(`Gemini API error: ${geminiResponse.status}`);
        }

        const geminiData = await geminiResponse.json();
        
        // Extract text from Gemini response
        const geminiText = geminiData.candidates[0].content.parts[0].text;
        
        // Split the Gemini output into sections
        const sections = geminiText.split(/(?=##|\n#\s)/);
        
        // Extract the sections we want (should have at least 3 sections)
        const response = {
          summary: sections.find(s => s.toLowerCase().includes('summary')) || "Project summary not generated properly.",
          suggestions: sections.find(s => s.toLowerCase().includes('suggest')) || "Suggestions not generated properly.",
          trends: sections.find(s => s.toLowerCase().includes('trend') || s.toLowerCase().includes('insight')) || "Insights not generated properly.",
        };

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        console.log("No Gemini API key found, generating synthetic response");
        
        // Generate synthetic response if no API key is available
        // Simulate an API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate some generic insights based on the projects
        const projectNames = projects.map((p: any) => p.name).join(", ");
        const avgProgress = Math.round(projects.reduce((sum: number, p: any) => sum + p.progress, 0) / projects.length);
        const highProgressProjects = projects.filter((p: any) => p.progress > 75).map((p: any) => p.name);
        const lowProgressProjects = projects.filter((p: any) => p.progress < 25).map((p: any) => p.name);
        
        // Common tags across projects
        const allTags: string[] = [];
        projects.forEach((p: any) => {
          if (Array.isArray(p.tags)) {
            allTags.push(...p.tags);
          }
        });
        
        // Count tag frequencies
        const tagCounts: Record<string, number> = {};
        allTags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        
        // Get top tags
        const topTags = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([tag]) => tag)
          .join(", ");

        // Generate synthetic response
        const response = {
          summary: `You have ${projects.length} projects in your dashboard with an average progress of ${avgProgress}%.\n\n${highProgressProjects.length > 0 ? `Projects nearing completion: ${highProgressProjects.join(", ")}.\n\n` : ""}${lowProgressProjects.length > 0 ? `Projects in early stages: ${lowProgressProjects.join(", ")}.\n\n` : ""}Most projects are in various stages of development. Continue to update your activity logs to track progress effectively.`,
          
          suggestions: `Consider prioritizing projects with high usefulness ratings but low progress.\n\nFor projects with missing Next Actions, define clear next steps to maintain momentum.\n\nConsider setting specific completion dates for projects above 75% progress to drive them to completion.${lowProgressProjects.length > 0 ? `\n\nFor early-stage projects like ${lowProgressProjects.join(", ")}, try breaking down large tasks into smaller, more achievable milestones.` : ""}`,
          
          trends: `Most common tags across your projects: ${topTags}.\n\n${projects.filter((p: any) => p.isMonetized).length > 0 ? `${projects.filter((p: any) => p.isMonetized).length} of your projects are marked for monetization - consider how to allocate resources to these priority projects.\n\n` : ""}Projects with higher usefulness ratings tend to receive more regular updates based on activity logs.\n\nConsider adding more detailed next actions to improve project clarity and direction.`
        };

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate insights' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
