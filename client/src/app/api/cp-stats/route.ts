import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const USERNAME = searchParams.get("username") || "mashle_hanma";
    // const USERNAME = searchParams.get("username") || "gennady.korotkevich";

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
      languageSolved: [] as { languageName: string; problemsSolved: number }[],
    };

    const codechefData = {
      rating: 0,
      stars: "0★",
      globalRank: 0,
      codechefSolved: 0,
    };

    const hackerrankData = {
      totalSolved: 0,
      badges: [] as {
        name: string;
        category: string;
        stars: number;
        totalStars: number;
        solved: number;
        totalChallenges: number;
      }[],
    };

    const formatLangName = (lang: string) => {
      if (!lang) return "Unknown";
      const l = lang.toLowerCase();
      if (l === "cpp" || l === "c++") return "C++";
      if (l === "c") return "C";
      if (l.includes("python")) return "Python";
      if (l === "javascript" || l === "js") return "JavaScript";
      if (l === "typescript" || l === "ts") return "TypeScript";
      if (l === "java") return "Java";
      return lang.charAt(0).toUpperCase() + lang.slice(1);
    };

    // --- LEETCODE FETCH ---
    // --- LEETCODE FETCH ---
    // --- LEETCODE FETCH ---
    const fetchLeetCodeData = async () => {
      try {
        const res = await fetch(
          `https://alfa-leetcode-api.onrender.com/userProfile/${USERNAME}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = await res.json();
          leetcodeData.totalSolved = data.totalSolved || 0;
          leetcodeData.easySolved = data.easySolved || 0;
          leetcodeData.mediumSolved = data.mediumSolved || 0;
          leetcodeData.hardSolved = data.hardSolved || 0;
        }
      } catch (e) {
        console.log("LeetCode userProfile fetch failed:", e);
      }

      // Language stats — correct endpoint is /:username/language
      try {
        const res = await fetch(
          `https://alfa-leetcode-api.onrender.com/${USERNAME}/language`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const lData = await res.json();
          console.log(
            "LeetCode language raw response:",
            JSON.stringify(lData, null, 2),
          );

          const list =
            lData.languageProblemCount ||
            lData.matchedUser?.languageProblemCount ||
            lData.languageStats ||
            [];

          if (Array.isArray(list) && list.length > 0) {
            leetcodeData.languageSolved = list.map((item: any) => ({
              languageName: formatLangName(item.languageName || item.language),
              problemsSolved:
                item.problemsSolved || item.problemsSolvedCount || 0,
            }));
          } else {
            console.log(
              "LeetCode language: no language field found, keys were:",
              Object.keys(lData),
            );
          }
        } else {
          console.log(
            "LeetCode language endpoint returned status:",
            res.status,
          );
        }
      } catch (e) {
        console.log("LeetCode language fetch failed:", e);
      }
    };

    // --- CODECHEF FETCH (unofficial API) ---
    // --- CODECHEF FETCH (direct scrape) ---
    // Helper: CodeChef star bands (based on rating)
    const getCodeChefStars = (rating: number) => {
      if (rating >= 2500) return "7★";
      if (rating >= 2200) return "6★";
      if (rating >= 2000) return "5★";
      if (rating >= 1800) return "4★";
      if (rating >= 1600) return "3★";
      if (rating >= 1400) return "2★";
      if (rating > 0) return "1★";
      return "Unrated";
    };

    // Helper: extract a balanced [...] array starting after a marker key
    const extractBalancedArray = (html: string, marker: string) => {
      const idx = html.indexOf(marker);
      if (idx === -1) return null;
      const start = html.indexOf("[", idx);
      if (start === -1) return null;
      let depth = 0;
      for (let i = start; i < html.length; i++) {
        if (html[i] === "[") depth++;
        else if (html[i] === "]") {
          depth--;
          if (depth === 0) return html.slice(start, i + 1);
        }
      }
      return null;
    };

    // --- CODECHEF FETCH (direct scrape) ---
    const fetchCodeChefData = async () => {
      try {
        const res = await fetch(`https://www.codechef.com/users/${USERNAME}`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          console.log("CodeChef page fetch failed with status:", res.status);
          return;
        }

        const html = await res.text();

        // Total problems solved
        const solvedMatch =
          html.match(/Total Problems Solved:\s*<\/h3>\s*<h3[^>]*>\s*(\d+)/i) ||
          html.match(/Total Problems Solved:\s*(\d+)/i);
        if (solvedMatch) {
          codechefData.codechefSolved = parseInt(solvedMatch[1], 10);
        }

        // Rating — from embedded date_versus_rating JSON, take the latest contest entry
        const allArrayStr = extractBalancedArray(html, '"date_versus_rating"');
        if (allArrayStr) {
          try {
            const allArray = JSON.parse(allArrayStr);
            if (Array.isArray(allArray) && allArray.length > 0) {
              const last = allArray[allArray.length - 1];
              codechefData.rating = parseInt(last.rating, 10) || 0;
            }
          } catch (e) {
            console.log("CodeChef rating JSON parse failed:", e);
          }
        }

        // Stars — computed from rating (CodeChef doesn't expose it as plain text)
        codechefData.stars = getCodeChefStars(codechefData.rating);

        // Global rank — hidden inside the og:description meta tag
        const ogDescMatch = html.match(
          /<meta property="og:description" content="([^"]+)"/i,
        );
        if (ogDescMatch) {
          const rankMatch = ogDescMatch[1].match(/global rank (\d+)/i);
          if (rankMatch) codechefData.globalRank = parseInt(rankMatch[1], 10);
        }

        console.log("CodeChef parsed result:", codechefData);
      } catch (e) {
        console.log("CodeChef scrape error:", e);
      }
    };

    // --- HACKERRANK FETCH ---
    // --- HACKERRANK FETCH ---
    // --- HACKERRANK FETCH ---
    const fetchHackerRankData = async () => {
      try {
        const res = await fetch(
          `https://www.hackerrank.com/rest/hackers/${USERNAME}/badges`,
          {
            headers: { "User-Agent": "Mozilla/5.0" },
            cache: "no-store",
          },
        );
        if (res.ok) {
          const data = await res.json();
          const badges = data.models || [];

          hackerrankData.badges = badges.map((b: any) => ({
            name: b.badge_name || "Unknown",
            category: b.category_name || "General",
            stars: b.stars || 0,
            totalStars: b.total_stars || 0,
            solved: b.solved || 0,
            totalChallenges: b.total_challenges || 0,
          }));

          hackerrankData.totalSolved = badges.reduce(
            (sum: number, b: any) => sum + (b.solved || 0),
            0,
          );
        } else {
          console.log(
            "HackerRank badges fetch failed with status:",
            res.status,
          );
        }
      } catch (e) {
        console.log("HackerRank fetch error:", e);
      }
    };

    // --- ALL CALLS ---
    const [, cfUserRes, cfStatusRes] = await Promise.allSettled([
      fetchLeetCodeData(),
      fetch(`https://codeforces.com/api/user.info?handles=${USERNAME}`, {
        cache: "no-store",
      }),
      fetch(`https://codeforces.com/api/user.status?handle=${USERNAME}`, {
        cache: "no-store",
      }),
      fetchCodeChefData(),
      fetchHackerRankData(),
    ]);

    // Codeforces user.info process (rating/rank)
    if (cfUserRes.status === "fulfilled" && cfUserRes.value.ok) {
      try {
        const userData = await cfUserRes.value.json();
        if (userData.status === "OK" && userData.result?.[0]) {
          const u = userData.result[0];
          codeforcesData.rating = u.rating || 0;
          codeforcesData.rank = u.rank || "Unrated";
          codeforcesData.maxRating = u.maxRating || 0;
          codeforcesData.maxRank = u.maxRank || "Unrated";
        }
      } catch (e) {}
    }

    // Codeforces status process (solved + contest/practice split)
    if (cfStatusRes.status === "fulfilled" && cfStatusRes.value.ok) {
      try {
        const statusData = await cfStatusRes.value.json();
        if (statusData.status === "OK" && Array.isArray(statusData.result)) {
          const langProblemMap: Record<string, Set<string>> = {};
          const allSolvedSet = new Set<string>();
          const contestSolvedSet = new Set<string>();
          const practiceSolvedSet = new Set<string>();

          statusData.result.forEach((submission: any) => {
            if (submission.verdict === "OK" && submission.problem) {
              const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
              const lang = formatLangName(
                submission.programmingLanguage || "Other",
              );

              allSolvedSet.add(problemId);

              if (
                submission.author?.participantType === "PRACTICE" ||
                submission.author?.participantType === "VIRTUAL"
              ) {
                practiceSolvedSet.add(problemId);
              } else {
                contestSolvedSet.add(problemId);
              }

              if (!langProblemMap[lang])
                langProblemMap[lang] = new Set<string>();
              langProblemMap[lang].add(problemId);
            }
          });

          codeforcesData.totalSolved = allSolvedSet.size;
          codeforcesData.contestSolved = contestSolvedSet.size;
          codeforcesData.practiceSolved = practiceSolvedSet.size;
          codeforcesData.languageSolved = Object.keys(langProblemMap).map(
            (lang) => ({
              languageName: lang,
              problemsSolved: langProblemMap[lang].size,
            }),
          );
        }
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      data: {
        leetcode: leetcodeData,
        codeforces: codeforcesData,
        codechef: codechefData,
        hackerrank: hackerrankData,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 },
    );
  }
}

// // LeetCode userProfile: no language field found, keys were: [
//   'totalSolved',        'totalSubmissions',
//   'totalQuestions',     'easySolved',
//   'totalEasy',          'mediumSolved',
//   'totalMedium',        'hardSolved',
//   'totalHard',          'ranking',
//   'contributionPoint',  'reputation',
//   'submissionCalendar', 'recentSubmissions',
//   'matchedUserStats'
// // ]
