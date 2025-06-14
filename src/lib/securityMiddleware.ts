/**
 * Security middleware for the application
 * This file contains security-related functions and utilities
 */

// Content Security Policy setup
export const setupCSP = () => {
  if (typeof window === "undefined") return;

  // Create a meta tag for CSP
  const cspMeta = document.createElement("meta");
  cspMeta.httpEquiv = "Content-Security-Policy";
  cspMeta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://storage.googleapis.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.unsplash.com https://api.dicebear.com",
    `connect-src 'self' ${import.meta.env.VITE_SUPABASE_URL} https://api.openai.com`,
    "font-src 'self'",
    "frame-src 'self'",
    "object-src 'none'",
  ].join("; ");

  document.head.appendChild(cspMeta);
};

// Error boundary for catching and handling runtime errors
export class ErrorBoundary {
  static setup() {
    if (typeof window === "undefined") return;

    // Global error handler
    window.addEventListener("error", (event) => {
      console.error("Global error caught:", event.error);
      // Prevent the app from crashing completely
      event.preventDefault();

      // Display a user-friendly error message
      const errorContainer = document.createElement("div");
      errorContainer.style.position = "fixed";
      errorContainer.style.bottom = "20px";
      errorContainer.style.right = "20px";
      errorContainer.style.backgroundColor = "#f8d7da";
      errorContainer.style.color = "#721c24";
      errorContainer.style.padding = "10px 15px";
      errorContainer.style.borderRadius = "4px";
      errorContainer.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      errorContainer.style.zIndex = "9999";
      errorContainer.style.maxWidth = "300px";
      errorContainer.textContent =
        "An error occurred. The application will continue running.";

      document.body.appendChild(errorContainer);

      // Remove the error message after 5 seconds
      setTimeout(() => {
        if (document.body.contains(errorContainer)) {
          document.body.removeChild(errorContainer);
        }
      }, 5000);

      return true;
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      event.preventDefault();
    });
  }
}

// Rate limiting for API calls
export class RateLimiter {
  private static requests: Record<string, number[]> = {};
  private static maxRequests = 50;
  private static timeWindow = 60000; // 1 minute

  static canMakeRequest(endpoint: string): boolean {
    const now = Date.now();

    // Initialize endpoint if it doesn't exist
    if (!this.requests[endpoint]) {
      this.requests[endpoint] = [];
    }

    // Filter out old requests
    this.requests[endpoint] = this.requests[endpoint].filter(
      (time) => now - time < this.timeWindow,
    );

    // Check if we're over the limit
    if (this.requests[endpoint].length >= this.maxRequests) {
      console.warn(`Rate limit exceeded for ${endpoint}`);
      return false;
    }

    // Add current request
    this.requests[endpoint].push(now);
    return true;
  }
}

// Initialize security features
export const initSecurity = () => {
  setupCSP();
  ErrorBoundary.setup();
};
