import { differenceInDays, formatDistanceToNow, format } from "date-fns";

export function getDisplayDate(createdAt?: string | number | Date): string {
    const createdDate = new Date(createdAt ?? Date.now());
    const daysAgo = differenceInDays(new Date(), createdDate);

    return daysAgo < 7
        ? formatDistanceToNow(createdDate, { addSuffix: true })
        : format(createdDate, "MMM dd, yyyy");
}