export const handleApiError = (error: any): string => {
  if (!error.response) {
    // Network error
    return "Network error. Please check your internet connection and try again.";
  }

  const status = error.response.status;
  const message = error.response.data?.error || error.message;

  switch (status) {
    case 401:
      return "Authentication required. Please log in again.";
    case 403:
      return "Access denied. You don't have permission for this action.";
    case 404:
      return "The requested resource was not found.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return message || `An error occurred (${status}).`;
  }
};

export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};
