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
  public connect(url?: string): Promise<void> {
    if (url) {
      this.url = url;
    }

    return new Promise((resolve, reject) => {
      try {
        this.isIntentionallyClosed = false;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          resolve();
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
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket closed");
          
          // Attempt to reconnect if not intentionally closed
          if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
              this.connect().catch(console.error);
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

