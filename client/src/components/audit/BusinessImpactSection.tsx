import { useState } from "react";
import type { BusinessImpact } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingDown,
  ChevronDown,
  Info,
  AlertTriangle,
} from "lucide-react";

interface Props {
  impact: BusinessImpact;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function BusinessImpactSection({ impact }: Props) {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Business Impact
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Revenue opportunity based on keywords relevant to your business
        </p>
      </div>

      {/* Big numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missed Traffic Value — defensible */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
              Missed Traffic Value
            </span>
            <Badge className="text-[9px] px-1.5 py-0 bg-green-100 text-green-700 border-0">
              Real Data
            </Badge>
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {formatCurrency(impact.missedTrafficValue)}
            <span className="text-sm font-normal text-blue-600">/mo</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Based on actual keyword positions and search volumes
          </p>
        </div>

        {/* Estimated Lost Revenue — illustrative */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
              Est. Lost Revenue
            </span>
            <Badge className="text-[9px] px-1.5 py-0 bg-amber-100 text-amber-700 border-0">
              Estimated
            </Badge>
          </div>
          <p className="text-3xl font-bold text-amber-900">
            {formatCurrency(impact.estimatedLostRevenue)}
            <span className="text-sm font-normal text-amber-600">/mo</span>
          </p>
          <p className="text-xs text-amber-600 mt-1">
            {impact.assumptions.industry} industry avg. conversion &amp; order value
          </p>
        </div>
      </div>

      {/* Top missed keywords table */}
      {impact.topMissedKeywords.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-2 font-medium text-gray-600">
                  Keyword
                </th>
                <th className="text-center px-3 py-2 font-medium text-gray-600">
                  Position
                </th>
                <th className="text-right px-3 py-2 font-medium text-gray-600">
                  Monthly Volume
                </th>
                <th className="text-right px-3 py-2 font-medium text-gray-600">
                  Missed Clicks
                </th>
                <th className="text-right px-4 py-2 font-medium text-gray-600">
                  Missed Value
                </th>
              </tr>
            </thead>
            <tbody>
              {impact.topMissedKeywords.map((kw, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-2.5 font-medium text-gray-900">
                    {kw.keyword}
                  </td>
                  <td className="text-center px-3 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        kw.position === 0
                          ? "bg-red-100 text-red-700"
                          : kw.position <= 3
                            ? "bg-green-100 text-green-700"
                            : kw.position <= 10
                              ? "bg-blue-100 text-blue-700"
                              : kw.position <= 20
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {kw.position === 0 ? "Not ranking" : `#${kw.position}`}
                    </span>
                  </td>
                  <td className="text-right px-3 py-2.5 text-gray-600">
                    {formatNumber(kw.searchVolume)}
                  </td>
                  <td className="text-right px-3 py-2.5 text-gray-600">
                    {formatNumber(kw.missedClicks)}
                  </td>
                  <td className="text-right px-4 py-2.5 font-medium text-red-600">
                    {formatCurrency(kw.missedValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* How we calculated this */}
      <div className="border rounded-lg">
        <button
          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => setShowMethodology(!showMethodology)}
        >
          <Info className="w-4 h-4" />
          <span>How we calculated this</span>
          <ChevronDown
            className={`w-4 h-4 ml-auto transition-transform ${showMethodology ? "rotate-180" : ""}`}
          />
        </button>

        {showMethodology && (
          <div className="px-4 pb-4 space-y-3 text-xs text-gray-600">
            {/* Assumptions */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <p className="font-medium text-gray-700">
                Assumptions for {impact.assumptions.industry}:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500">Conversion Rate:</span>{" "}
                  <span className="font-medium">
                    {(impact.assumptions.conversionRate * 100).toFixed(1)}%
                  </span>
                  <p className="text-gray-400 mt-0.5">
                    {impact.assumptions.conversionRationale}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Avg Order Value:</span>{" "}
                  <span className="font-medium">
                    ${impact.assumptions.avgOrderValue.toLocaleString()}
                  </span>
                  <p className="text-gray-400 mt-0.5">
                    {impact.assumptions.avgOrderRationale}
                  </p>
                </div>
              </div>
            </div>

            {/* Formula */}
            <div className="space-y-1">
              <p className="font-medium text-gray-700">Formula:</p>
              <p>
                <strong>Missed Traffic Value</strong> = For each keyword: Search Volume
                × (Position 1 CTR − Current Position CTR) × CPC
              </p>
              <p>
                <strong>Lost Revenue</strong> = Total Missed Clicks × Conversion Rate
                × Avg Order Value
              </p>
            </div>

            {/* Disclaimer */}
            <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700">
                Missed traffic value is based on real ranking data. Lost revenue
                uses industry-average estimates for your niche — actual results
                depend on your conversion rate and pricing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
