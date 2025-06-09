export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
    
    return persianDate;
}; 