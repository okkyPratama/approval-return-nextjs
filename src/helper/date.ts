export function formatDate(dateString: string): string {
    return new Date(dateString)
      .toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        localeMatcher: 'best fit'
      })
      .replace(/,/g, '')
    .replace(/\s([A-Za-z]{3})\s/, '-$1-')
      .toUpperCase();
  }