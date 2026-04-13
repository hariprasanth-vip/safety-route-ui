export const getSafeRoute = (routes) => {
  // Mock implementation - finds route with highest safety score
  if (!routes || routes.length === 0) return null;
  
  return routes.reduce((prev, current) => 
    (prev.safetyScore > current.safetyScore) ? prev : current
  );
};