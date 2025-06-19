// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import { injectable } from '@theia/core/shared/inversify';
import { Emitter, Event } from '@theia/core';
import { RemoteConnectionService } from '../common/remote-service';
import { RemoteConnection, RemoteConnectionOptions, RemoteConnectionStatus, RemoteConnectionType } from '../common/remote-types';
import { v4 as uuid } from 'uuid';

@injectable()
export class BrowserRemoteConnectionService implements RemoteConnectionService {

    protected readonly onConnectionStatusChangedEmitter = new Emitter<RemoteConnection>();
    readonly onConnectionStatusChanged: Event<RemoteConnection> = this.onConnectionStatusChangedEmitter.event;

    protected connections = new Map<string, RemoteConnection>();
    protected webSockets = new Map<string, WebSocket>();

    async createConnection(options: RemoteConnectionOptions): Promise<RemoteConnection> {
        const connection: RemoteConnection = {
            id: uuid(),
            name: `${options.username}@${options.host}:${options.port || 22}`,
            host: options.host,
            port: options.port || 22,
            username: options.username,
            status: RemoteConnectionStatus.Connecting,
            type: RemoteConnectionType.WebSocket
        };

        this.connections.set(connection.id, connection);
        this.onConnectionStatusChangedEmitter.fire(connection);

        try {
            await this.establishWebSocketConnection(connection, options);
            connection.status = RemoteConnectionStatus.Connected;
        } catch (error) {
            connection.status = RemoteConnectionStatus.Error;
            console.error('Failed to establish remote connection:', error);
        }

        this.onConnectionStatusChangedEmitter.fire(connection);
        return connection;
    }

    async testConnection(options: RemoteConnectionOptions): Promise<boolean> {
        try {
            // For browser version, we'll test by attempting to establish a WebSocket connection
            // This is a simplified test - in a real implementation, you might want to
            // connect to a WebSocket proxy that can test SSH connectivity
            const wsUrl = this.buildWebSocketUrl(options);
            const ws = new WebSocket(wsUrl);
            
            return new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    ws.close();
                    resolve(false);
                }, 5000);

                ws.onopen = () => {
                    clearTimeout(timeout);
                    ws.close();
                    resolve(true);
                };

                ws.onerror = () => {
                    clearTimeout(timeout);
                    resolve(false);
                };
            });
        } catch (error) {
            return false;
        }
    }

    async closeConnection(connectionId: string): Promise<void> {
        const connection = this.connections.get(connectionId);
        if (connection) {
            const ws = this.webSockets.get(connectionId);
            if (ws) {
                ws.close();
                this.webSockets.delete(connectionId);
            }
            connection.status = RemoteConnectionStatus.Disconnected;
            this.onConnectionStatusChangedEmitter.fire(connection);
        }
    }

    async getActiveConnections(): Promise<RemoteConnection[]> {
        return Array.from(this.connections.values()).filter(
            conn => conn.status === RemoteConnectionStatus.Connected
        );
    }

    protected async establishWebSocketConnection(connection: RemoteConnection, options: RemoteConnectionOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            const wsUrl = this.buildWebSocketUrl(options);
            const ws = new WebSocket(wsUrl);

            const timeout = setTimeout(() => {
                ws.close();
                reject(new Error('Connection timeout'));
            }, 10000);

            ws.onopen = () => {
                clearTimeout(timeout);
                this.webSockets.set(connection.id, ws);
                resolve();
            };

            ws.onerror = (error) => {
                clearTimeout(timeout);
                reject(error);
            };

            ws.onclose = () => {
                this.webSockets.delete(connection.id);
                if (connection.status === RemoteConnectionStatus.Connected) {
                    connection.status = RemoteConnectionStatus.Disconnected;
                    this.onConnectionStatusChangedEmitter.fire(connection);
                }
            };
        });
    }

    protected buildWebSocketUrl(options: RemoteConnectionOptions): string {
        // In a real implementation, this would connect to a WebSocket proxy server
        // that can establish SSH connections on behalf of the browser client
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${protocol}//${host}/remote-proxy/${options.host}:${options.port || 22}`;
    }
}