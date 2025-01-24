export function scrapeTime(mongoTime: string): string {
    const currentTime = new Date();
    const givenTime = new Date(mongoTime);

    const diffInMilliseconds = currentTime.getTime() - givenTime.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s`
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m`
    } else if (diffInHours < 24) {
        return `${diffInHours}h`
    } else if (diffInDays < 7) {
        return `${diffInDays}d`
    } else if (diffInWeeks < 4) {
        return `${diffInWeeks}w`
    } else if (diffInMonths < 12) {
        return `${diffInMonths}m`
    } else {
        return `${diffInYears}y`
    }
}
