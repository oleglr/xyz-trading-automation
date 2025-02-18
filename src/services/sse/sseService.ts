import { SSEOptions, SSEService } from '../../types/sse';

class CustomEventSource {
  private abortController: AbortController | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private connected: boolean = false;
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private decoder = new TextDecoder();
  private buffer = '';

  constructor(
    private url: string,
    private headers: Record<string, string>,
    private withCredentials: boolean = false
  ) {}

  async connect(): Promise<void> {
    // Don't create new connection if already connected
    if (this.connected) {
      console.log('Already connected, skipping new connection');
      return;
    }

    // Reset state
    if (this.abortController) {
      if (!this.abortController.signal.aborted) {
        this.abortController.abort();
      }
      this.abortController = null;
    }
    this.connected = false;
    this.buffer = '';
    
    // Create new controller
    this.abortController = new AbortController();

    try {
      console.log('Initiating SSE connection to:', this.url);
      const response = await fetch(this.url, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          ...this.headers
        },
        mode: 'cors',
        credentials: this.withCredentials ? 'include' : 'omit',
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.connected = true;
      console.log('SSE Connection established:', {
        status: response.status,
        statusText: response.statusText
      });

      // Process the stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }
      this.reader = reader;

      try {
        while (true) {
          if (!this.reader) {
            console.log('Reader was closed');
            break;
          }
          const { value, done } = await this.reader.read();
          
          if (done) {
            console.log('Stream complete');
            break;
          }

          this.buffer += this.decoder.decode(value, { stream: true });
          const lines = this.buffer.split('\n');
          this.buffer = lines.pop() || ''; // Keep last incomplete line in buffer

          for (const line of lines) {
            if (line.trim() === '') continue;
            
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              // Handle heartbeat separately
              if (data.trim() === 'heartbeat') {
                console.debug('Received heartbeat');
                continue;
              }
              
              if (this.messageHandler) {
                this.messageHandler(new MessageEvent('message', { data }));
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Stream reading aborted');
          return;
        }
        throw error;
      }

    } catch (error) {
      this.connected = false;
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('SSE connection aborted');
        return;
      }
      console.error('SSE Connection Error:', error);
      throw error;
    }
  }

  set onmessage(handler: (event: MessageEvent) => void) {
    this.messageHandler = handler;
  }

  async close(): Promise<void> {
    if (!this.connected) return;

    this.connected = false;
    
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (error) {
        console.warn('Error canceling reader:', error);
      } finally {
        this.reader = null;
      }
    }

    if (this.abortController) {
      try {
        if (!this.abortController.signal.aborted) {
          this.abortController.abort();
        }
      } catch (error) {
        console.warn('Error aborting SSE connection:', error);
      } finally {
        this.abortController = null;
      }
    }

    this.buffer = '';
  }

  get readyState(): number {
    return this.connected ? EventSource.OPEN : EventSource.CLOSED;
  }

  static get CONNECTING(): number { return 0; }
  static get OPEN(): number { return 1; }
  static get CLOSED(): number { return 2; }
}

class SSEServiceImpl implements SSEService {
  private static instance: SSEServiceImpl;
  private eventSource: CustomEventSource | null = null;
  private messageHandlers: Set<(event: MessageEvent) => void> = new Set();
  private lastOptions: SSEOptions | null = null;
  private isConnecting: boolean = false;

  private constructor() {}

  static getInstance(): SSEServiceImpl {
    if (!SSEServiceImpl.instance) {
      SSEServiceImpl.instance = new SSEServiceImpl();
    }
    return SSEServiceImpl.instance;
  }

  connect(options: SSEOptions): number {
    // If already connecting or connected with same options, just add handlers
    if (this.isConnecting || (
      this.eventSource && 
      this.lastOptions && 
      this.lastOptions.url === options.url && 
      JSON.stringify(this.lastOptions.headers) === JSON.stringify(options.headers)
    )) {
      if (options.onMessage) {
        this.messageHandlers.add(options.onMessage);
      }
      return this.messageHandlers.size;
    }

    // If we have a different connection, close it
    if (this.eventSource) {
      this.disconnect();
    }

    this.isConnecting = true;
    this.lastOptions = options;

    try {
      this.eventSource = new CustomEventSource(
        options.url,
        options.headers,
        options.withCredentials
      );

      if (options.onMessage) {
        this.messageHandlers.add(options.onMessage);
      }

      this.eventSource.onmessage = (event) => {
        this.messageHandlers.forEach(handler => handler(event));
      };

      this.eventSource.connect().finally(() => {
        this.isConnecting = false;
      });

      return this.messageHandlers.size;
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to create SSE connection:', error);
      return 0;
    }
  }

  async disconnect(): Promise<number> {
    if (this.eventSource) {
      await this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
    this.lastOptions = null;
    this.messageHandlers.clear();
    return 0;
  }

  isConnected(): boolean {
    return this.eventSource !== null && this.eventSource.readyState === CustomEventSource.OPEN;
  }
}

export const sseService = SSEServiceImpl.getInstance();
