"use client";

import { useEffect, useState } from "react";

type CPStats = {
  leetcode: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    languageSolved: { languageName: string; problemsSolved: number }[];
  };
  codeforces: {
    rating: number;
    rank: string;
    maxRating: number;
    maxRank: string;
    totalSolved: number;
    contestSolved: number;
    practiceSolved: number;
    // Fix: Updated Codeforces languageSolved type to match the API
    languageSolved: { languageName: string; problemsSolved: number }[];
  };
  codechef: {
    rating: number;
    stars: string;
    globalRank: number;
    codechefSolved: number;
  };
  hackerrank: {
    totalSolved: number;
    badges: {
      name: string;
      category: string;
      stars: number;
      totalStars: number;
      solved: number;
      totalChallenges: number;
    }[];
  };
};

const RegisterForm = () => {
  const [stats, setStats] = useState<CPStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/cp-stats");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch CP stats:", error);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Registration Section */}

      {/* Competitive Programming Stats Section */}
      {loadingStats ? (
        <div className="text-center text-slate-400 py-4">
          Loading CP Statistics...
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* LeetCode Card */}
            <div className="p-6 bg-slate-800 text-white rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-amber-400">LeetCode</h3>
                  <span className="text-xl font-extrabold">
                    {stats.leetcode?.totalSolved || 0} Solved
                  </span>
                </div>
                <div className="flex justify-between text-xs bg-slate-900 p-3 rounded-lg mb-4">
                  <span className="text-emerald-400">
                    Easy: {stats.leetcode?.easySolved || 0}
                  </span>
                  <span className="text-yellow-400">
                    Medium: {stats.leetcode?.mediumSolved || 0}
                  </span>
                  <span className="text-red-400">
                    Hard: {stats.leetcode?.hardSolved || 0}
                  </span>
                </div>
              </div>

              {(stats.leetcode?.languageSolved?.length ?? 0) > 0 && (
                <div className="p-3 bg-slate-900 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2 font-semibold">
                    Solved by Language:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.leetcode?.languageSolved?.map((lang) => (
                      <span
                        key={lang.languageName}
                        className="text-[11px] px-2 py-0.5 bg-slate-800 text-amber-300 rounded-full border border-slate-700 capitalize"
                      >
                        {lang.languageName}:{" "}
                        <strong className="text-white">
                          {lang.problemsSolved}
                        </strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Codeforces Card */}
            <div className="p-6 bg-slate-800 text-white rounded-xl shadow-lg border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-blue-400">
                      Codeforces
                    </h3>
                    <p className="text-xs text-slate-400 capitalize">
                      Rank:{" "}
                      <span className="text-emerald-400 font-semibold">
                        {stats.codeforces?.rank || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">
                      {stats.codeforces?.rating || 0}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Max: {stats.codeforces?.maxRating || 0} (
                      {stats.codeforces?.maxRank || "N/A"})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-center bg-slate-900 p-2.5 rounded-lg mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400">Total</p>
                    <p className="text-sm font-bold text-white">
                      {stats.codeforces?.totalSolved || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Contest</p>
                    <p className="text-sm font-bold text-emerald-400">
                      {stats.codeforces?.contestSolved || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Practice</p>
                    <p className="text-sm font-bold text-amber-400">
                      {stats.codeforces?.practiceSolved || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fix: Handled array mapping correctly for Codeforces */}
              {(stats.codeforces?.languageSolved?.length ?? 0) > 0 && (
                <div className="p-3 bg-slate-900 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2 font-semibold">
                    Solved by Language:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.codeforces?.languageSolved?.map((lang) => (
                      <span
                        key={lang.languageName}
                        className="text-[11px] px-2 py-0.5 bg-slate-800 text-blue-300 rounded-full border border-slate-700"
                      >
                        {lang.languageName}:{" "}
                        <strong className="text-white">
                          {lang.problemsSolved}
                        </strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CodeChef Card */}
            <div className="p-6 bg-slate-800 text-white rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-yellow-500">
                    CodeChef
                  </h3>
                  <span className="text-xl font-bold">
                    {stats.codechef?.stars || "Unrated"}
                  </span>
                </div>
                <p className="text-3xl font-extrabold">
                  {stats.codechef?.rating || 0}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    Rating
                  </span>
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  Global Rank: #{stats.codechef?.globalRank || "N/A"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Total Solved: {stats.codechef?.codechefSolved || 0}
                </p>
              </div>
            </div>

            {/* HackerRank Card */}
            {/* HackerRank Card */}
            {/* HackerRank Card */}
            {/* HackerRank Card */}
            <div className="p-6 bg-slate-800 text-white rounded-xl flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-emerald-400">
                    HackerRank
                  </h3>
                  <span className="text-xl font-extrabold">
                    {stats.hackerrank?.totalSolved || 0} Solved
                  </span>
                </div>

                {/* Language-wise solved (from Language Proficiency badges) */}
                {(() => {
                  const langBadges =
                    stats.hackerrank?.badges?.filter(
                      (b) => b.category === "Language Proficiency",
                    ) || [];
                  return (
                    langBadges.length > 0 && (
                      <div className="p-3 bg-slate-900 rounded-lg mb-3">
                        <p className="text-xs text-slate-400 mb-2 font-semibold">
                          Solved by Language:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {langBadges.map((badge) => (
                            <span
                              key={badge.name}
                              className="text-[11px] px-2 py-0.5 bg-slate-800 text-emerald-300 rounded-full border border-slate-700 capitalize"
                            >
                              {badge.name}:{" "}
                              <strong className="text-white">
                                {badge.solved}
                              </strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })()}

                {/* All badges */}
                {(stats.hackerrank?.badges?.length ?? 0) > 0 && (
                  <div className="p-3 bg-slate-900 rounded-lg space-y-2">
                    <p className="text-xs text-slate-400 mb-1 font-semibold">
                      All Badges:
                    </p>
                    {stats.hackerrank?.badges?.map((badge) => (
                      <div
                        key={badge.name}
                        className="flex justify-between items-center text-[11px] px-2 py-1 bg-slate-800 rounded-full border border-slate-700"
                      >
                        <span className="text-emerald-300">
                          {badge.name}{" "}
                          <span className="text-slate-500">
                            ({badge.category})
                          </span>
                        </span>
                        <span className="text-white font-semibold">
                          {"★".repeat(badge.stars)}
                          {"☆".repeat(
                            Math.max(badge.totalStars - badge.stars, 0),
                          )}{" "}
                          {badge.solved}/{badge.totalChallenges}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RegisterForm;
