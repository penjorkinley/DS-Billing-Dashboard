import { Toast } from "@/lib/toast-context";

export const toastMessages = {
  // Login/Authentication messages
  loginSuccess: (username?: string): Omit<Toast, "id"> => ({
    type: "success",
    title: "Login Successful",
    message: username
      ? `Welcome back, ${username}! Redirecting to your dashboard...`
      : "Welcome back! Redirecting to your dashboard...",
    duration: 2000,
  }),

  loginFailed: (error?: string): Omit<Toast, "id"> => ({
    type: "error",
    title: "Login Failed",
    message:
      error || "Invalid credentials. Please check your Client ID and Secret.",
    duration: 5000,
  }),

  logoutSuccess: (): Omit<Toast, "id"> => ({
    type: "success",
    title: "Logged Out",
    message: "You have been successfully logged out. Redirecting...",
    duration: 2000,
  }),

  logoutError: (): Omit<Toast, "id"> => ({
    type: "error",
    title: "Logout Error",
    message: "Failed to logout properly. Redirecting anyway...",
    duration: 3000,
  }),

  sessionExpired: (): Omit<Toast, "id"> => ({
    type: "warning",
    title: "Session Expired",
    message: "Your session has expired. Please log in again.",
    duration: 4000,
  }),

  // Validation messages
  validationError: (errors: string[]): Omit<Toast, "id"> => ({
    type: "error",
    title: "Validation Error",
    message: errors.join(", "),
    duration: 4000,
  }),

  // Network/Connection messages
  connectionError: (): Omit<Toast, "id"> => ({
    type: "error",
    title: "Connection Error",
    message:
      "Unable to connect to the server. Please check your internet connection.",
    duration: 5000,
  }),

  serverError: (): Omit<Toast, "id"> => ({
    type: "error",
    title: "Server Error",
    message: "An unexpected server error occurred. Please try again later.",
    duration: 5000,
  }),

  // Permission messages
  insufficientPermissions: (): Omit<Toast, "id"> => ({
    type: "error",
    title: "Access Denied",
    message: "You don't have permission to access this resource.",
    duration: 4000,
  }),

  // Generic messages
  success: (message: string, title?: string): Omit<Toast, "id"> => ({
    type: "success",
    title: title || "Success",
    message,
    duration: 3000,
  }),

  error: (message: string, title?: string): Omit<Toast, "id"> => ({
    type: "error",
    title: title || "Error",
    message,
    duration: 4000,
  }),

  warning: (message: string, title?: string): Omit<Toast, "id"> => ({
    type: "warning",
    title: title || "Warning",
    message,
    duration: 4000,
  }),

  info: (message: string, title?: string): Omit<Toast, "id"> => ({
    type: "info",
    title: title || "Information",
    message,
    duration: 3000,
  }),

  // User management messages
  userCreated: (username: string): Omit<Toast, "id"> => ({
    type: "success",
    title: "User Created",
    message: `User ${username} has been successfully created.`,
    duration: 3000,
  }),

  userUpdated: (username: string): Omit<Toast, "id"> => ({
    type: "success",
    title: "User Updated",
    message: `User ${username} has been successfully updated.`,
    duration: 3000,
  }),

  userDeleted: (username: string): Omit<Toast, "id"> => ({
    type: "success",
    title: "User Deleted",
    message: `User ${username} has been successfully removed.`,
    duration: 3000,
  }),

  // Organization messages
  organizationCreated: (orgName: string): Omit<Toast, "id"> => ({
    type: "success",
    title: "Organization Created",
    message: `Organization "${orgName}" has been successfully created.`,
    duration: 3000,
  }),

  // Billing messages
  paymentSuccess: (amount: string): Omit<Toast, "id"> => ({
    type: "success",
    title: "Payment Successful",
    message: `Payment of ${amount} has been processed successfully.`,
    duration: 3000,
  }),

  paymentFailed: (): Omit<Toast, "id"> => ({
    type: "error",
    title: "Payment Failed",
    message:
      "Payment could not be processed. Please try again or contact support.",
    duration: 5000,
  }),
};

// Utility function to create custom toast messages
export const createToast = {
  success: (
    message: string,
    title?: string,
    duration?: number
  ): Omit<Toast, "id"> => ({
    type: "success",
    title: title || "Success",
    message,
    duration: duration || 3000,
  }),

  error: (
    message: string,
    title?: string,
    duration?: number
  ): Omit<Toast, "id"> => ({
    type: "error",
    title: title || "Error",
    message,
    duration: duration || 4000,
  }),

  warning: (
    message: string,
    title?: string,
    duration?: number
  ): Omit<Toast, "id"> => ({
    type: "warning",
    title: title || "Warning",
    message,
    duration: duration || 4000,
  }),

  info: (
    message: string,
    title?: string,
    duration?: number
  ): Omit<Toast, "id"> => ({
    type: "info",
    title: title || "Information",
    message,
    duration: duration || 3000,
  }),
};
