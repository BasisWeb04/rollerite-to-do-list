import { format, formatDistanceToNow } from "date-fns";

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function formatAbsolute(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy h:mm a");
}
