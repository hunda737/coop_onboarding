/**
 * Utility functions for harmonization modal
 */

/**
 * Validate account number format
 */
export const validateAccountNumber = (accountNumber: string): boolean => {
  // Account number should be numeric and typically 10-16 digits
  const cleaned = accountNumber.trim();
  return /^\d{10,16}$/.test(cleaned);
};

/**
 * Validate OTP code format
 */
export const validateOtpCode = (otpCode: string): boolean => {
  return /^\d{6}$/.test(otpCode);
};

/**
 * Mask phone number for display
 */
export const maskPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber || phoneNumber.length < 4) return phoneNumber;
  const lastFour = phoneNumber.slice(-4);
  const masked = "*".repeat(phoneNumber.length - 4);
  return masked + lastFour;
};

/**
 * Format date string for display
 */
export const formatDateString = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/**
 * Convert base64 to Blob with error handling
 */
export const base64ToBlob = (
  base64: string,
  contentType: string = "image/jpeg"
): Blob | null => {
  try {
    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  } catch (error) {
    console.error("Failed to convert base64 to blob:", error);
    return null;
  }
};

/**
 * Check if popup is blocked
 */
export const isPopupBlocked = (popup: Window | null): boolean => {
  return !popup || popup.closed || typeof popup.closed === "undefined";
};

/**
 * Generate random client ID
 */
export const generateClientId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

