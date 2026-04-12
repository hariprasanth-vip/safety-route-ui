export function getSafeRoute(routes) {
  // Find route with lowest risk
  return routes.sort((a, b) => a.risk - b.risk)[0];
}