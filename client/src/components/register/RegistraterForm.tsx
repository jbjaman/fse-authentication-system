"use client";

import { registerSchema } from "@/lib/validations/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

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
    languageSolved: Record<string, number>;
  };
  codechef: {
    rating: number;
    stars: string;
    globalRank: number;
    codechefSolved: number;
  };
  hackerrank: number;
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Registration Response:", result);
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Registration Section */}
      <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-1">Create Your Account</h1>
        <p className="text-sm text-slate-400 mb-6">
          Welcome! Please create your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              {...register("name")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              {...register("password")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-lg transition"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      {/* Competitive Programming Stats Section */}
      {loadingStats ? (
        <div className="text-center text-slate-400 py-4">
          Loading CP Statistics...
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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

              {stats.leetcode?.languageSolved?.length > 0 && (
                <div className="p-3 bg-slate-900 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2 font-semibold">
                    Solved by Language:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.leetcode.languageSolved.map((lang) => (
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
                        {stats.codeforces?.rank}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">
                      {stats.codeforces?.rating}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Max: {stats.codeforces?.maxRating} (
                      {stats.codeforces?.maxRank})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-center bg-slate-900 p-2.5 rounded-lg mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400">Total</p>
                    <p className="text-sm font-bold text-white">
                      {stats.codeforces?.totalSolved}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Contest</p>
                    <p className="text-sm font-bold text-emerald-400">
                      {stats.codeforces?.contestSolved}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Practice</p>
                    <p className="text-sm font-bold text-amber-400">
                      {stats.codeforces?.practiceSolved}
                    </p>
                  </div>
                </div>
              </div>

              {stats.codeforces?.languageSolved && (
                <div className="p-3 bg-slate-900 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2 font-semibold">
                    Solved by Language:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(stats.codeforces.languageSolved).map(
                      ([lang, count]) => (
                        <span
                          key={lang}
                          className="text-[11px] px-2 py-0.5 bg-slate-800 text-blue-300 rounded-full border border-slate-700"
                        >
                          {lang}:{" "}
                          <strong className="text-white">{count}</strong>
                        </span>
                      ),
                    )}
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
                    {stats.codechef?.stars}
                  </span>
                </div>
                <p className="text-3xl font-extrabold">
                  {stats.codechef?.rating}{" "}
                  <span className="text-sm font-normal text-slate-400">
                    Rating
                  </span>
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  Global Rank: #{stats.codechef?.globalRank}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Total Solved: {stats.codechef?.codechefSolved}
                </p>
              </div>
            </div>

            {/* HackerRank Card */}
            <div className="p-6 bg-slate-800 text-white rounded-xl text-center flex flex-col justify-center items-center">
              <p className="text-sm text-emerald-400 font-semibold mb-1">
                HackerRank
              </p>
              <p className="text-4xl font-extrabold">{stats.hackerrank}</p>
              <span className="text-xs text-slate-400 mt-1">
                Problems Solved
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RegisterForm;
