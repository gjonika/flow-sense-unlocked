
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  FileImage,
  Shield,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SurveyAnalyticsProps {
  surveyId: string;
}

interface AnalyticsData {
  survey_id: string;
  ship_name: string;
  survey_location: string;
  status: string;
  total_responses: number;
  issues_found: number;
  compliant_items: number;
  not_applicable: number;
  mandatory_skipped: number;
  total_evidence_files: number;
}

interface CategoryIssue {
  question_category: string;
  issue_count: number;
}

const SurveyAnalytics = ({ surveyId }: SurveyAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [categoryIssues, setCategoryIssues] = useState<CategoryIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch main analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('survey_analytics')
          .select('*')
          .eq('survey_id', surveyId)
          .single();

        if (analyticsError) throw analyticsError;
        setAnalytics(analyticsData);

        // Fetch category breakdown
        const { data: categoryData, error: categoryError } = await supabase
          .from('survey_issues_by_category')
          .select('*')
          .eq('survey_id', surveyId);

        if (categoryError) throw categoryError;
        setCategoryIssues(categoryData || []);

      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) {
      fetchAnalytics();
    }
  }, [surveyId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Clock className="h-6 w-6 animate-spin mr-2" />
            <span>Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Survey Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No analytics data available yet. Complete some checklist questions to see insights.</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const responseDistribution = [
    { name: 'Compliant', value: analytics.compliant_items, color: '#10b981' },
    { name: 'Issues Found', value: analytics.issues_found, color: '#ef4444' },
    { name: 'Not Applicable', value: analytics.not_applicable, color: '#6b7280' },
    { name: 'Skipped', value: analytics.mandatory_skipped, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  const categoryData = categoryIssues.map(item => ({
    category: item.question_category.replace(/\s+/g, '\n'), // Break long category names
    issues: item.issue_count,
  }));

  // Calculate completion rate
  const completionRate = analytics.total_responses > 0 
    ? Math.round(((analytics.total_responses - analytics.mandatory_skipped) / analytics.total_responses) * 100)
    : 0;

  // Calculate compliance score
  const complianceScore = analytics.total_responses > 0
    ? Math.round((analytics.compliant_items / analytics.total_responses) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Survey Analytics - {analytics.ship_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{completionRate}%</div>
              <div className="text-xs text-blue-600">Completion Rate</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{complianceScore}%</div>
              <div className="text-xs text-green-600">Compliance Score</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{analytics.issues_found}</div>
              <div className="text-xs text-red-600">Issues Found</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{analytics.total_evidence_files}</div>
              <div className="text-xs text-purple-600">Evidence Files</div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 mb-6">
            <Badge variant="outline" className="bg-blue-50">
              <Shield className="h-3 w-3 mr-1" />
              SOLAS Compliant Assessment
            </Badge>
            {analytics.mandatory_skipped > 0 && (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {analytics.mandatory_skipped} Mandatory Items Skipped
              </Badge>
            )}
            {analytics.issues_found === 0 && analytics.total_responses > 0 && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                No Issues Found
              </Badge>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Distribution Pie Chart */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Response Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={responseDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {responseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Issues by Category Bar Chart */}
            {categoryData.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Issues by Category</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      fontSize={12}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="issues" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Assessment Summary</h4>
            <ul className="space-y-1 text-sm">
              <li>• Total questions answered: {analytics.total_responses}</li>
              <li>• Compliant items: {analytics.compliant_items}</li>
              <li>• Issues requiring attention: {analytics.issues_found}</li>
              <li>• Items not applicable: {analytics.not_applicable}</li>
              <li>• Evidence files attached: {analytics.total_evidence_files}</li>
              {analytics.mandatory_skipped > 0 && (
                <li className="text-red-600">
                  • ⚠️ Mandatory items skipped: {analytics.mandatory_skipped}
                </li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyAnalytics;
