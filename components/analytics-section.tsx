import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AnalyticsSectionProps {
  analytics: {
    views: number
    clicks: number
    conversions: number
    earnings: number
  }
  dateRange: string
}

export default function AnalyticsSection({ analytics, dateRange }: AnalyticsSectionProps) {
  return (
    <div className="px-6 py-2 border-t">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-sm">Analytics</h2>
        <div className="text-xs text-gray-500">{dateRange}</div>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex-1 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-full p-1">
              <span className="text-xs text-blue-500">👁️</span>
            </div>
            <span className="text-xs text-gray-500">Views</span>
          </div>
          <p className="font-semibold mt-1">{analytics.views}</p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-full p-1">
              <span className="text-xs text-blue-500">👆</span>
            </div>
            <span className="text-xs text-gray-500">Clicks</span>
          </div>
          <p className="font-semibold mt-1">{analytics.clicks}</p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-full p-1">
              <span className="text-xs text-blue-500">🔄</span>
            </div>
            <span className="text-xs text-gray-500">Conversions</span>
          </div>
          <p className="font-semibold mt-1">{analytics.conversions}</p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-full p-1">
              <span className="text-xs text-blue-500">💰</span>
            </div>
            <span className="text-xs text-gray-500">Earnings</span>
          </div>
          <p className="font-semibold mt-1 flex items-center">
            ${analytics.earnings.toFixed(2)}
            <Badge variant="outline" className="ml-1 h-4 px-1">
              <span className="text-[10px]">?</span>
            </Badge>
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="text-xs h-8 px-3 rounded-md bg-gray-50 border-gray-200">
            All Time
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
