export const isAuthenticated = req => {
  if (!req.user) {
    throw new Error('Not authenticated');
  }
};
