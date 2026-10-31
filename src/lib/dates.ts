const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10" → "Oct 2026". Anything else is shown as written. */
export function formatMonth(value: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!m) return value;
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : value;
}

/** "2026" → "2026", "2026-10" → "Oct 2026", "2026-10-12" → "12 Oct 2026". Anything else is shown as written. */
export function formatDate(value: string): string {
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value.trim());
  if (!m) return value;
  if (!m[2]) return m[1];
  const month = MONTHS[Number(m[2]) - 1];
  if (!month) return value;
  return m[3] ? `${Number(m[3])} ${month} ${m[1]}` : `${month} ${m[1]}`;
}
