import { NextResponse } from 'next/server';
import { getAggregatedInsights, getDepartmentStats, getTrendData, getAllSessions, seedMockData } from '@/lib/storage';
import { CATEGORY_LABELS } from '@/lib/storage';

export async function GET() {
  seedMockData();
  
  const insights = getAggregatedInsights();
  const departmentStats = getDepartmentStats();
  const trends = getTrendData();
  const sessions = getAllSessions().filter(s => s.completedAt);

  // High-severity actionable items
  const actionableItems = sessions
    .flatMap(s => s.extractedInsights)
    .filter(i => i.severity === 'high' && i.isActionable)
    .map(i => ({
      ...i,
      categoryLabel: CATEGORY_LABELS[i.category],
    }));

  return NextResponse.json({
    summary: {
      totalInterviews: sessions.length,
      avgInsightsPerSession: Math.round(
        sessions.reduce((sum, s) => sum + s.extractedInsights.length, 0) / sessions.length * 10
      ) / 10,
      topCategory: insights[0]?.category,
      topCategoryLabel: insights[0] ? CATEGORY_LABELS[insights[0].category] : '',
    },
    insights,
    departmentStats,
    trends,
    actionableItems,
    categoryLabels: CATEGORY_LABELS,
  });
}
