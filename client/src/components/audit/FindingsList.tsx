import { useState, useMemo } from "react";
import type { Finding, DimensionKey, Severity } from "./types";
import { DIMENSION_LABELS, DIMENSION_ORDER, getSeverityColor } from "./constants";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

interface Props {
  findings: Finding[];
}

const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low", "info"];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pass: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  fail: <XCircle className="w-3.5 h-3.5 text-red-500" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  info: <Info className="w-3.5 h-3.5 text-blue-500" />,
  skip: <Info className="w-3.5 h-3.5 text-gray-400" />,
};

export function FindingsList({ findings }: Props) {
  const [dimFilter, setDimFilter] = useState<DimensionKey | "all">("all");
  const [sevFilter, setSevFilter] = useState<Set<Severity>>(
    () => new Set<Severity>(["critical", "high", "medium", "low"]),
  );

  const filtered = useMemo(() => {
    return findings
      .filter((f) => dimFilter === "all" || f.dimension === dimFilter)
      .filter((f) => sevFilter.has(f.severity))
      .sort(
        (a, b) =>
          SEVERITY_ORDER.indexOf(a.severity) -
          SEVERITY_ORDER.indexOf(b.severity),
      );
  }, [findings, dimFilter, sevFilter]);

  const toggleSeverity = (sev: Severity) => {
    setSevFilter((prev) => {
      const next = new Set(prev);
      if (next.has(sev)) next.delete(sev);
      else next.add(sev);
      return next;
    });
  };

  return (
    <div>
      <h3
        className="text-lg font-bold mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        All Findings
      </h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="text-sm border rounded-md px-3 py-1.5 bg-white text-gray-700"
          value={dimFilter}
          onChange={(e) =>
            setDimFilter(e.target.value as DimensionKey | "all")
          }
        >
          <option value="all">All Dimensions</option>
          {DIMENSION_ORDER.map((d) => (
            <option key={d} value={d}>
              {DIMENSION_LABELS[d]}
            </option>
          ))}
        </select>

        <div className="flex gap-1.5">
          {SEVERITY_ORDER.filter((s) => s !== "info").map((sev) => (
            <button
              key={sev}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors capitalize ${
                sevFilter.has(sev)
                  ? "text-white"
                  : "bg-white text-gray-400 border-gray-200"
              }`}
              style={
                sevFilter.has(sev)
                  ? {
                      backgroundColor: getSeverityColor(sev),
                      borderColor: getSeverityColor(sev),
                    }
                  : undefined
              }
              onClick={() => toggleSeverity(sev)}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Showing {filtered.length} of {findings.length} findings
      </p>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-3 py-2 font-medium text-gray-500 w-8" />
              <th className="text-left px-3 py-2 font-medium text-gray-500">
                Finding
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 hidden md:table-cell">
                Dimension
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 w-20">
                Severity
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr
                key={f.checkId}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-3 py-2">
                  {STATUS_ICONS[f.status] || STATUS_ICONS.info}
                </td>
                <td className="px-3 py-2">
                  <span className="font-medium text-gray-900">{f.name}</span>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {f.detail}
                  </p>
                </td>
                <td className="px-3 py-2 text-xs text-gray-500 hidden md:table-cell">
                  {DIMENSION_LABELS[f.dimension]}
                </td>
                <td className="px-3 py-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 capitalize"
                    style={{
                      color: getSeverityColor(f.severity),
                      borderColor: getSeverityColor(f.severity),
                    }}
                  >
                    {f.severity}
                  </Badge>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 text-center text-gray-400"
                >
                  No findings match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
