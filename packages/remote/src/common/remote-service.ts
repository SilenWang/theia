export const RemoteService = Symbol('RemoteService');

export interface RemoteService {
    connect(options: SSHConnectionOptions): Promise<void>;
    disconnect(): Promise<void>;
    executeCommand(command: string): Promise<string>;
    getPortForwardingRules(): Promise<PortForwardingRule[]>;
    // Other common methods matching electron version
}

export interface SSHConnectionOptions {
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string;
}

export interface PortForwardingRule {
    remotePort: number;
    localPort?: number;
    host?: string;
}
