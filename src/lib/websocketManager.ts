/**
 * WebSocket Manager for Fayda Authentication
 * Singleton pattern for managing WebSocket connections
 */

export interface WebSocketMessage {
  type: string;
  clientId?: string;
  data?: any;
}

export interface FaydaAuthenticationResult {
  type: "authentication_result";
  clientId: string;
  data: {
    sub: string;
    name: string;
    phone_number: string;
    picture: string;
    birthdate: string;
    gender: string;
    address: {
      street_address?: string;
      locality?: string;
      region: string;
      postal_code?: string;
      country?: string;
    };
    given_name?: string;
    family_name?: string;
    email?: string;
  };
}

type MessageHandler = (message: WebSocketMessage) => void;

export class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private ws: WebSocket | null = null;
  private url: string = "wss://coopengage.coopbankoromiasc.com/ws/fayda";
  // private url: string = "wss://10.16.0.25/ws/fayda";
  private messageHandlers: Set<MessageHandler> = new Set();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private isIntentionallyClosed: boolean = false;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  /**
   * Connect to WebSocket server
   */
  public connect(url?: string, timeout: number = 30000): Promise<void> {
    if (url) {
      this.url = url;
    }

    return new Promise((resolve, reject) => {
      try {
        // Clean up existing connection if any
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }

        this.isIntentionallyClosed = false;
        console.log(`Connecting to WebSocket: ${this.url}`);
        this.ws = new WebSocket(this.url);

        let connectionTimeout: NodeJS.Timeout;
        let isResolved = false;

        // Set up connection timeout
        connectionTimeout = setTimeout(() => {
          if (!isResolved && this.ws) {
            isResolved = true;
            console.error("WebSocket connection timeout");
            this.ws.close();
            this.ws = null;
            reject(new Error(`WebSocket connection timeout after ${timeout}ms`));
          }
        }, timeout);

        this.ws.onopen = () => {
          if (!isResolved) {
            isResolved = true;
            clearTimeout(connectionTimeout);
            console.log("WebSocket connected successfully");
            this.reconnectAttempts = 0;
            resolve();
          }
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log("WebSocket message received:", message);
            
            // Notify all registered handlers
            this.messageHandlers.forEach((handler) => {
              handler(message);
            });
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error event:", error);
          console.error("WebSocket readyState:", this.ws?.readyState);
          if (!isResolved) {
            isResolved = true;
            clearTimeout(connectionTimeout);
            const errorMessage = "WebSocket connection failed. Please check your network connection.";
            reject(new Error(errorMessage));
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log("WebSocket closed", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          
          // Only reject if not already resolved and not intentionally closed
          if (!isResolved && !this.isIntentionallyClosed) {
            isResolved = true;
            reject(new Error(`WebSocket connection closed unexpectedly. Code: ${event.code}, Reason: ${event.reason || 'Unknown'}`));
          }
          
          // Attempt to reconnect if not intentionally closed
          if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
              this.connect(url, timeout).catch(console.error);
            }, this.reconnectDelay);
          }
        };
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    this.isIntentionallyClosed = true;
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.messageHandlers.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Send a message to the WebSocket server
   */
  public send(message: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      throw new Error("WebSocket is not connected");
    }

    try {
      const messageString = JSON.stringify(message);
      this.ws.send(messageString);
      console.log("WebSocket message sent:", message);
    } catch (error) {
      console.error("Failed to send WebSocket message:", error);
      throw error;
    }
  }

  /**
   * Register a message handler
   */
  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /**
   * Register client with WebSocket server
   */
  public registerClient(clientId: string): void {
    this.send({
      type: "register_client",
      clientId,
    });
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection state
   */
  public getReadyState(): number | null {
    return this.ws ? this.ws.readyState : null;
  }
}

// Export singleton instance
export const wsManager = WebSocketManager.getInstance();

