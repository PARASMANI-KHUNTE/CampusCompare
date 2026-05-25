export const COLLEGE_COURSES = ['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'BCA', 'MCA', 'B.Des', 'B.Sc', 'BA', 'B.Com', 'LLB', 'BBA'];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi',
];

export const COLLEGE_TYPES = [
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'PRIVATE', label: 'Private' },
  { value: 'DEEMED', label: 'Deemed to be University' },
  { value: 'AUTONOMOUS', label: 'Autonomous' },
] as const;

export const SORT_OPTIONS = [
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'fees_asc', label: 'Lowest Fees' },
  { value: 'fees_desc', label: 'Highest Fees' },
  { value: 'placement_desc', label: 'Best Placement' },
] as const;
