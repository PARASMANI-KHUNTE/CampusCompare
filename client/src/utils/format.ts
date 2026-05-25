export const formatCurrency = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)} K`;
  }
  return `₹${amount}`;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

export const getCollegeTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    GOVERNMENT: 'Government',
    PRIVATE: 'Private',
    DEEMED: 'Deemed',
    AUTONOMOUS: 'Autonomous',
  };
  return map[type] || type;
};

export const getCollegeTypeColor = (type: string): 'success' | 'primary' | 'warning' | 'danger' | 'gray' => {
  const map: Record<string, 'success' | 'primary' | 'warning' | 'gray'> = {
    GOVERNMENT: 'success',
    PRIVATE: 'primary',
    DEEMED: 'warning',
    AUTONOMOUS: 'gray',
  };
  return map[type] || 'gray';
};
