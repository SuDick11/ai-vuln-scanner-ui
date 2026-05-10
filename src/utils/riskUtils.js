export const getRiskLabel = (score) => {
  if (score === null || score === undefined) return 'STANDBY';
  if (score >= 70) return 'CRITICAL RISK';
  if (score >= 40) return 'MODERATE RISK';
  return 'LOW RISK';
};

export const getRiskColor = (score) => {
  if (score === null || score === undefined) return '#767684';
  if (score >= 70) return '#ba1a1a';
  if (score >= 40) return '#767684';
  return '#006600';
};
