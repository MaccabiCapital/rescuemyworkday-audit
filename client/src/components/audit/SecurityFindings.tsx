import type { Finding } from "./types";
import { Badge } from "@/components/ui/badge";
import { getSeverityColor } from "./constants";
import { Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Props {
  findings: Finding[];
}

export function SecurityFindings({ findings }: Props) {
  const securityFindings = findings.filter(
    (f) => f.engine === "seomator" && f.checkId.includes("security"),
  );

  if (securityFindings.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-gray-600" />
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Security
        </h3>
        <Badge variant="outline" className="text-xs text-gray-500">
          Not part of the 100pt score
        </Badge>
      </div>

      <div className="space-y-2">
        {securityFindings.map((f) => {
          const icon =
            f.status === "pass" ? (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : f.status === "fail" ? (
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            );

          return (
            <div
              key={f.checkId}
              className="flex items-start gap-2 text-sm p-2 rounded hover:bg-gray-50"
            >
              <div className="mt-0.5">{icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{f.name}</span>
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
                </div>
                <p className="text-gray-600 mt-0.5">{f.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
