
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface ProjectData {
  name: string;
  progress: number;
  status: string;
  type: string;
  usefulness: number;
  tags: string[];
  nextAction?: string;
  activityLog?: string[];
}

interface RequestData {
  projects: ProjectData[];
}

interface AIResponse {
  summary: string;
  suggestions: string;
  trends: string;
}

serve(async (req) => {
  try {
    // Parse request data
    const requestData: RequestData = await req.json();
    const { projects } = requestData;
    
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return new Response(
        JSON.stringify({ 
          summary: "No projects found for analysis.",
          suggestions: "Add projects to get personalized suggestions.",
          trends: "Project trends will appear here once you add more projects."
        }),
        { 
          headers: { "Content-Type": "application/json" },
          status: 200 
        }
      );
    }
    
    // Generate basic insights without AI for reliability
    const projectCount = projects.length;
    
    // Count projects by status
    const statusCounts: Record<string, number> = {};
    projects.forEach(project => {
      statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
    });
    
    // Count projects by type
    const typeCounts: Record<string, number> = {};
    projects.forEach(project => {
      typeCounts[project.type] = (typeCounts[project.type] || 0) + 1;
    });
    
    // Calculate average usefulness and progress
    const avgUsefulness = projects.reduce((sum, p) => sum + p.usefulness, 0) / projectCount;
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projectCount;
    
    // Find the most common tags
    const tagCounts: Record<string, number> = {};
    projects.forEach(project => {
      if (project.tags) {
        project.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    // Create insights
    const response: AIResponse = {
      summary: `You have ${projectCount} projects tracked. ${
        statusCounts["Completed"] || 0
      } projects are completed, ${
        statusCounts["In Progress"] || 0
      } are in progress. The average project usefulness rating is ${avgUsefulness.toFixed(1)}/5 and average progress is at ${avgProgress.toFixed(0)}%.`,
      
      suggestions: `Focus on your highest usefulness projects first to maximize impact. ${
        avgProgress < 50 
          ? "Many of your projects are in early stages - consider prioritizing 2-3 to advance." 
          : "Several projects are well underway - consider setting completion dates for motivation."
      }${
        sortedTags.length > 0 
          ? ` Your most common project tags are ${sortedTags.join(", ")}.` 
          : ""
      }`,
      
      trends: `${
        projectCount > 5 
          ? "You're managing a diverse portfolio of projects." 
          : "You're focused on a smaller set of projects."
      } ${
        avgProgress > 70 
          ? "You're making excellent progress across your projects." 
          : avgProgress > 40 
            ? "Your projects are advancing at a moderate pace." 
            : "Many projects are in early stages of development."
      }${
        Object.keys(typeCounts).length > 1 
          ? ` Your project types are diverse across ${Object.keys(typeCounts).join(", ")}.` 
          : ""
      }`
    };
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error("Error generating insights:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate insights",
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
