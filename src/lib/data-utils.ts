
// Filter data by year
export const filterDataByYear = <T extends { date?: string, readingdate?: string, month?: string }>(
  data: T[],
  year?: number
): T[] => {
  if (!year || !data?.length) return data || [];
  
  return data.filter((item) => {
    const dateStr = item.date || item.readingdate;
    if (!dateStr) {
      // For mock data with just month fields, we'll assume it's in the selected year
      return !!item.month;
    }
    
    try {
      const itemYear = new Date(dateStr).getFullYear();
      return itemYear === year;
    } catch (e) {
      console.error("Error parsing date:", e);
      return false;
    }
  });
};

// Generate year options from current year back to 2020
export const getYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  
  for (let year = currentYear; year >= 2020; year--) {
    years.push(year);
  }
  
  return years;
};

// Check if data exists
export const hasData = <T>(data: T[] | null | undefined): boolean => {
  return Boolean(data && data.length > 0);
};
