import content from "@/lib/content";

export function greetingFor(): string {
  // IST = UTC+5:30
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);
  const hour = istTime.getHours();

  if (hour >= 5 && hour < 12) return content.greetings.morning.text;
  if (hour >= 12 && hour < 17) return content.greetings.afternoon.text;
  if (hour >= 17 && hour < 21) return content.greetings.evening.text;
  return content.greetings.night.text;
}

export function randomLine(): string {
  const lines = content.motivationalLines;
  return lines[Math.floor(Math.random() * lines.length)];
}
