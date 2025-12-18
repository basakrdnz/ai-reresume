import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const UsageIndicator = () => {
  const { auth } = usePuterStore();
  const [usage, setUsage] = useState<{
    percentage: number;
    remaining: number;
    used: number;
    total: number;
    avgPerUpload: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const usageData = await auth.getMonthlyUsage();
        if (usageData) {
          const { allowanceInfo, usage: apiUsage } = usageData;
          const used = allowanceInfo.monthUsageAllowance - allowanceInfo.remaining;
          const percentage = allowanceInfo.monthUsageAllowance > 0
            ? (used / allowanceInfo.monthUsageAllowance) * 100
            : 0;

          // Calculate average usage per upload
          const aiCallCount = apiUsage?.ai?.count || 0;
          const avgPerUpload = aiCallCount > 0 && allowanceInfo.monthUsageAllowance > 0
            ? (used / aiCallCount / allowanceInfo.monthUsageAllowance) * 100
            : 0;

          setUsage({
            percentage: Math.min(percentage, 100),
            remaining: allowanceInfo.remaining,
            used,
            total: allowanceInfo.monthUsageAllowance,
            avgPerUpload: Math.min(avgPerUpload, 100),
          });
        }
      } catch (err) {
        // Silently handle usage fetch errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, [auth]);

  if (isLoading || !usage) return null;

  const size = 120;
  const radius = size * 0.35;
  const stroke = size * 0.08;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = usage.percentage / 100;
  const strokeDashoffset = circumference * (1 - progress);
  const fontSize = size * 0.18;

  // Color based on usage percentage
  const getColor = () => {
    if (usage.percentage >= 90) return "#ef4444"; // red
    if (usage.percentage >= 70) return "#f59e0b"; // amber
    return "#10b981"; // green
  };

  return (
    <>
      <style>{`
        @keyframes slow-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .slow-bounce {
          animation: slow-bounce 3s ease-in-out infinite;
        }
      `}</style>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="p-4 flex flex-col items-center gap-2 slow-bounce">
          <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
            <svg
              height="100%"
              width="100%"
              viewBox="0 0 100 100"
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={normalizedRadius}
                stroke="#e5e7eb"
                strokeWidth={stroke}
                fill="transparent"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="usageGradient" x1="1" y1="0" x2="0" y2="1">
                  {usage.percentage >= 90 ? (
                    <>
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </>
                  ) : usage.percentage >= 70 ? (
                    <>
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </>
                  ) : (
                    <>
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </>
                  )}
                </linearGradient>
              </defs>
              {/* Progress circle with gradient */}
              <circle
                cx="50"
                cy="50"
                r={normalizedRadius}
                stroke="url(#usageGradient)"
                strokeWidth={stroke}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

          {/* Percentage text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-semibold"
              style={{ fontSize: `${fontSize}px`, color: getColor() }}
            >
              {Math.round(usage.percentage)}%
            </span>
          </div>
        </div>

        {/* Remaining text */}
        <div className="text-center">
          <p className="text-xs text-gray-600 font-medium">
            {usage.remaining > 0 ? (
              <>
                <span className="font-semibold text-gray-900">Analysis Usage</span>
              </>
            ) : (
              <span className="text-red-600 font-semibold">Limit Reached</span>
            )}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">This month</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default UsageIndicator;
