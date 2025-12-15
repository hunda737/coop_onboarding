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
 * Convert base64 to File with proper MIME type and extension
 * Allowed types: jpg, jpeg, png, gif
 * Automatically converts unsupported formats to JPEG
 */
export const base64ToBlob = async (
  base64: string,
  filename: string = "image.jpg"
): Promise<File | null> => {
  try {
    let mimeType = "image/jpeg"; // Default to JPEG
    let base64Data = base64;
    let extension = "jpg";
    let needsConversion = false;

    // Extract MIME type from data URL if present
    const dataUrlMatch = base64.match(/^data:image\/(\w+);base64,/);
    if (dataUrlMatch) {
      const extractedType = dataUrlMatch[1].toLowerCase();
      base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      
      // Map to allowed MIME types
      switch (extractedType) {
        case "jpeg":
        case "jpg":
          mimeType = "image/jpeg";
          extension = "jpg";
          break;
        case "png":
          mimeType = "image/png";
          extension = "png";
          break;
        case "gif":
          mimeType = "image/gif";
          extension = "gif";
          break;
        default:
          // For any other type, we need to convert to JPEG
          needsConversion = true;
          mimeType = "image/jpeg";
          extension = "jpg";
          console.warn(`Unsupported image type: ${extractedType}, will convert to JPEG`);
      }
    } else {
      // If no MIME type in base64, assume JPEG
      base64Data = base64;
    }

    // If we need to convert unsupported formats, use canvas
    if (needsConversion) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(null);
              return;
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const file = new File([blob], filename.replace(/\.[^/.]+$/, "") + `.${extension}`, {
                    type: mimeType,
                    lastModified: Date.now(),
                  });
                  resolve(file);
                } else {
                  resolve(null);
                }
              },
              "image/jpeg",
              0.9 // JPEG quality
            );
          } catch (error) {
            console.error("Failed to convert image:", error);
            resolve(null);
          }
        };
        img.onerror = () => {
          console.error("Failed to load image for conversion");
          resolve(null);
        };
        img.src = base64; // Use original base64 with data URL
      });
    }

    // Decode base64 for supported formats
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Convert Blob to File with proper filename and extension
    const file = new File([blob], filename.replace(/\.[^/.]+$/, "") + `.${extension}`, {
      type: mimeType,
      lastModified: Date.now(),
    });

    return file;
  } catch (error) {
    console.error("Failed to convert base64 to file:", error);
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

