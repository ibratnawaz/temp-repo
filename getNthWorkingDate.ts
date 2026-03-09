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

const start = new Date("2026-03-09"); // 9th March (Monday)
const result = getNthWorkingDate(4, start, []);
console.log(result.toDateString()); // Tue Mar 17 2026
