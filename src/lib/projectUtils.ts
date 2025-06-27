
import { Project } from '@/lib/supabase';

// Function to get progress-based background color
export function getProgressColor(progress: number) {
  if (progress >= 75) return "border-l-baltic-sea";
  if (progress >= 25) return "border-l-baltic-pine";
  return "border-l-baltic-sand";
}

// Function to get status-based colors
export function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': return "bg-green-500/20 text-green-700";
    case 'In Progress': return "bg-blue-500/20 text-blue-700";
    case 'Planning': return "bg-yellow-500/20 text-yellow-700";
    case 'Idea': return "bg-purple-500/20 text-purple-700";
    case 'Build': return "bg-indigo-500/20 text-indigo-700";
    case 'Launch': return "bg-red-500/20 text-red-700";
    case 'Abandoned': return "bg-gray-500/20 text-gray-700";
    default: return "bg-slate-500/20 text-slate-700";
  }
}

// Function to get category-based colors
export function getCategoryColor(category?: string) {
  if (!category) return "bg-baltic-sea text-baltic-fog";
  
  const categoryColors: Record<string, string> = {
    'AI Tools': "bg-blue-400/80 text-white",
    'Web Development': "bg-teal-500/80 text-white",
    'Mobile Apps': "bg-violet-500/80 text-white",
    'Data Science': "bg-amber-500/80 text-white",
    'Design': "bg-rose-400/80 text-white",
    'Blockchain': "bg-indigo-500/80 text-white",
    'IoT': "bg-emerald-500/80 text-white",
    'Gaming': "bg-fuchsia-500/80 text-white"
  };
  
  return categoryColors[category] || "bg-baltic-pine text-baltic-fog";
}

// Calculate expected completion date based on creation date and progress
export function getExpectedCompletionDate(createdAt: string, progress: number) {
  const startDate = new Date(createdAt);
  
  // Different estimated durations based on progress
  let totalDurationDays = 90; // Default for new projects
  
  if (progress >= 75) {
    totalDurationDays = 30; // Almost done
  } else if (progress >= 50) {
    totalDurationDays = 60; // Halfway there
  } else if (progress >= 25) {
    totalDurationDays = 75; // Started but lots to do
  }
  
  // Calculate remaining days
  const remainingDays = Math.ceil(totalDurationDays * (1 - progress / 100));
  
  // Add remaining days to current date
  const expectedDate = new Date();
  expectedDate.setDate(expectedDate.getDate() + remainingDays);
  
  return expectedDate;
}

// Calculate project freshness score based on last updated date
export function calculateProjectFreshness(lastUpdated: string): number {
  const now = new Date();
  const updatedDate = new Date(lastUpdated);
  const daysDifference = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Score from 0-100 based on recency
  // 0 days = 100, 30+ days = 0
  return Math.max(0, 100 - (daysDifference * 3.33));
}
