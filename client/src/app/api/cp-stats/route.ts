import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ক্যাশ নিষ্ক্রিয় করতে

export async function GET(req: NextRequest) {
  // ১. ডায়নামিক ইউজারনেম রিসিভ করা (ডিফল্ট mashle_hanma)
  const { searchParams } = new URL(req.url);
  const USERNAME = searchParams.get("username") || "mashle_hanma";

  // --- Data Structures ---
  const leetcodeData = {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    languageSolved: [] as { languageName: string; problemsSolved: number }[],
  };

  const codeforcesData = {
    rating: 0,
    rank: "Unrated",
    maxRating: 0,
    maxRank: "Unrated",
    totalSolved: 0,
    contestSolved: 0,
    practiceSolved: 0,
    languageSolved: {} as Record<string, number>,
  };

  let codechefData = {
    rating: 0,
    stars: "0★",
    globalRank: 0,
    codechefSolved: 0,
  };

  let hackerrankSolved = 0;

  // ২. প্যারালালে সব প্ল্যাটফর্ম থেকে ডাটা ফেচ করা
  const [lcRes, lcLangRes, cfUserRes, cfStatusRes, ccRes, hrRes] =
    await Promise.allSettled([
      // LeetCode Solved Stats (Alfa LeetCode Proxy API)
      fetch(`https://alfa-leetcode-api.onrender.com/${USERNAME}/solved`, {
        cache: "no-store",
      }),

      // LeetCode Language Stats
      fetch(
        `https://alfa-leetcode-api.onrender.com/languageStats?username=${USERNAME}`,
        {
          cache: "no-store",
        },
      ),

      // Codeforces User Info
      fetch(`https://codeforces.com/api/user.info?handles=${USERNAME}`, {
        cache: "no-store",
      }),

      // Codeforces Status
      fetch(`https://codeforces.com/api/user.status?handle=${USERNAME}`, {
        cache: "no-store",
      }),

      // CodeChef Direct HTML
      fetch(`https://www.codechef.com/users/${USERNAME}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        cache: "no-store",
      }),

      // HackerRank Badges
      fetch(`https://www.hackerrank.com/rest/hackers/${USERNAME}/badges`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        cache: "no-store",
      }),
    ]);

  // --- Process LeetCode ---
  if (lcRes.status === "fulfilled" && lcRes.value.ok) {
    try {
      const lcData = await lcRes.value.json();

      leetcodeData.totalSolved =
        lcData.solvedProblem || lcData.totalSolved || 0;
      leetcodeData.easySolved = lcData.easySolved || 0;
      leetcodeData.mediumSolved = lcData.mediumSolved || 0;
      leetcodeData.hardSolved = lcData.hardSolved || 0;
    } catch (e) {
      console.error("LeetCode Parse Error:", e);
    }
  }

  // Process LeetCode Languages
  if (lcLangRes.status === "fulfilled" && lcLangRes.value.ok) {
    try {
      const langData = await lcLangRes.value.json();
      if (langData?.matchedUser?.languageProblemSolveCount) {
        leetcodeData.languageSolved =
          langData.matchedUser.languageProblemSolveCount;
      }
    } catch (e) {
      console.error("LeetCode Language Parse Error:", e);
    }
  }

  // --- Process Codeforces User Info ---
  if (cfUserRes.status === "fulfilled" && cfUserRes.value.ok) {
    try {
      const userData = await cfUserRes.value.json();
      if (userData.status === "OK" && userData.result?.[0]) {
        const user = userData.result[0];
        codeforcesData.rating = user.rating || 0;
        codeforcesData.rank = user.rank || "Unrated";
        codeforcesData.maxRating = user.maxRating || 0;
        codeforcesData.maxRank = user.maxRank || "Unrated";
      }
    } catch (e) {
      console.error("Codeforces User Parse Error:", e);
    }
  }

  // --- Process Codeforces Status ---
  if (cfStatusRes.status === "fulfilled" && cfStatusRes.value.ok) {
    try {
      const statusData = await cfStatusRes.value.json();
      if (statusData.status === "OK" && Array.isArray(statusData.result)) {
        const contestSolvedSet = new Set<string>();
        const practiceSolvedSet = new Set<string>();
        const allSolvedSet = new Set<string>();
        const langProblemMap: Record<string, Set<string>> = {};

        statusData.result.forEach((submission: any) => {
          if (submission.verdict === "OK" && submission.problem) {
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            const rawLang = submission.programmingLanguage || "Other";

            let lang = rawLang;
            if (rawLang.includes("C++")) lang = "C++";
            else if (rawLang.includes("Python")) lang = "Python";
            else if (rawLang.includes("Java")) lang = "Java";
            else if (rawLang.includes("C#")) lang = "C#";
            else if (rawLang.includes("JavaScript") || rawLang.includes("Node"))
              lang = "JavaScript";

            allSolvedSet.add(problemId);

            if (!langProblemMap[lang]) {
              langProblemMap[lang] = new Set<string>();
            }
            langProblemMap[lang].add(problemId);

            const isContest =
              submission.author?.participantType === "CONTESTANT" ||
              submission.author?.participantType === "OUT_OF_COMPETITION" ||
              submission.author?.participantType === "VIRTUAL";

            if (isContest) {
              contestSolvedSet.add(problemId);
            } else if (!contestSolvedSet.has(problemId)) {
              practiceSolvedSet.add(problemId);
            }
          }
        });

        const languageCounts: Record<string, number> = {};
        Object.keys(langProblemMap).forEach((lang) => {
          languageCounts[lang] = langProblemMap[lang].size;
        });

        codeforcesData.totalSolved = allSolvedSet.size;
        codeforcesData.contestSolved = contestSolvedSet.size;
        codeforcesData.practiceSolved = practiceSolvedSet.size;
        codeforcesData.languageSolved = languageCounts;
      }
    } catch (e) {
      console.error("Codeforces Status Parse Error:", e);
    }
  }

  // --- Process CodeChef ---
  if (ccRes.status === "fulfilled" && ccRes.value.ok) {
    try {
      const htmlText = await ccRes.value.text();

      const ratingMatch = htmlText.match(
        /<div class="rating-number">(\d+)<\/div>/,
      );
      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

      const solvedMatch =
        htmlText.match(/Total Problems Solved:\s*(\d+)/i) ||
        htmlText.match(/Fully Solved\s*\((\d+)\)/i);
      const solved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

      const starsMatch = htmlText.match(/<span class="rating">([^<]+)<\/span>/);
      const stars = starsMatch ? starsMatch[1].trim() : "0★";

      codechefData = {
        rating: rating,
        stars: stars,
        globalRank: 0,
        codechefSolved: solved,
      };
    } catch (e) {
      console.error("CodeChef Parse Error:", e);
    }
  }

  // --- Process HackerRank ---
  if (hrRes.status === "fulfilled" && hrRes.value.ok) {
    try {
      const hrData = await hrRes.value.json();
      if (hrData?.models && Array.isArray(hrData.models)) {
        hackerrankSolved = hrData.models.reduce(
          (acc: number, item: { solved: number }) => acc + (item.solved || 0),
          0,
        );
      }
    } catch (e) {
      console.error("HackerRank Parse Error:", e);
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      leetcode: leetcodeData,
      codeforces: codeforcesData,
      codechef: codechefData,
      hackerrank: hackerrankSolved,
    },
  });
}
