function getNthWorkingDate(
  n: number,
  startDate: Date = new Date(),
  holidays: string[] = []
): Date {
  // Helper: format a date as YYYY-MM-DD in local time
  const formatDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const holidaySet = new Set(holidays.map(h => h.trim()));

  const isWorkingDay = (d: Date): boolean => {
    const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
    if (dayOfWeek === 0 || dayOfWeek === 6) return false; // weekend
    if (holidaySet.has(formatDate(d))) return false;      // holiday
    return true;
  };

  let count = 0;
  const current = new Date(startDate);

  while (count < n) {
    // move to next calendar day (startDate is not counted)
    current.setDate(current.getDate() + 1);

    if (isWorkingDay(current)) {
      count++;
    }
  }

  return current;
}

// --------------------- TESTS ---------------------

type TestCase = {
  label: string;
  n: number;
  start: string;      // YYYY-MM-DD
  holidays?: string[];
  expectError?: boolean;
};

const tests: TestCase[] = [
  // 1. Simple: no holidays, weekday start
  {
    label: "Simple weekday start, no holidays (n=1)",
    n: 1,
    start: "2026-03-09", // Monday
  },
  {
    label: "Simple weekday start, no holidays (n=4)",
    n: 4,
    start: "2026-03-09", // Monday
  },

  // 2. Your given example
  {
    label: "Given example: holidays on 11 and 13, n=4",
    n: 4,
    start: "2026-03-09",
    holidays: ["2026-03-11", "2026-03-13"],
  },

  // 3. Start date is weekend
  {
    label: "Start date is Saturday, n=1, no holidays",
    n: 1,
    start: "2026-03-14", // Saturday
  },
  {
    label: "Start date is Sunday, n=3, no holidays",
    n: 3,
    start: "2026-03-15", // Sunday
  },

  // 4. Start date is a holiday (but we don't count start anyway)
  {
    label: "Start date is holiday, n=1",
    n: 1,
    start: "2026-03-11",
    holidays: ["2026-03-11"],
  },

  // 5. Consecutive holidays midweek
  {
    label: "Consecutive holidays Tue–Thu, n=5",
    n: 5,
    start: "2026-05-04", // Monday
    holidays: ["2026-05-05", "2026-05-06", "2026-05-07"],
  },

  // 6. Holidays falling on weekend (should have no extra effect)
  {
    label: "Holidays on weekend, n=5",
    n: 5,
    start: "2026-06-01",
    holidays: ["2026-06-06", "2026-06-07"], // Sat/Sun
  },

  // 7. Large holiday list
  {
    label: "Large holiday list (1000 days), n=3",
    n: 3,
    start: "2026-01-01",
    holidays: Array.from({ length: 1000 }, (_, i) => {
      const d = new Date("2026-01-01");
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }),
  },

  // 8. Crossing month boundary
  {
    label: "End of month crossing (no holidays), n=3",
    n: 3,
    start: "2026-01-30",
  },

  // 9. Crossing year boundary
  {
    label: "Crossing year boundary, n=7, some holidays",
    n: 7,
    start: "2026-12-28",
    holidays: ["2026-12-31", "2027-01-01"],
  },

  // 10. Very large n
  {
    label: "Large n=100, sparse holidays",
    n: 100,
    start: "2026-01-01",
    holidays: ["2026-01-26", "2026-08-15", "2026-10-02"],
  },

  // 11. Edge cases for n
  {
    label: "n = 0 (should error)",
    n: 0,
    start: "2026-03-09",
    expectError: true,
  },
  {
    label: "n = -5 (should error)",
    n: -5,
    start: "2026-03-09",
    expectError: true,
  },
];

function runTests() {
  for (const t of tests) {
    const { label, n, start, holidays = [], expectError } = t;
    const startDate = new Date(start);

    try {
      const result = getNthWorkingDate(n, startDate, holidays);
      if (expectError) {
        console.error(`[FAIL] ${label} → expected error, got ${result.toISOString()}`);
      } else {
        console.log(
          `[PASS] ${label}\n` +
          `       start: ${startDate.toDateString()}, n=${n}\n` +
          `       result: ${result.toDateString()} (${result.toISOString().slice(0, 10)})\n`
        );
      }
    } catch (e: any) {
      if (expectError) {
        console.log(`[PASS] ${label} → threw error as expected: ${e.message}`);
      } else {
        console.error(`[FAIL] ${label} → unexpected error: ${e.message}`);
      }
    }
  }
}

runTests();
