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
import { RemoteService, RemoteConnectionService, RemotePortForwardingService } from '../common/remote-service';
import { RemoteConnection, RemoteConnectionOptions, PortForwardingRule } from '../common/remote-types';

@injectable()
export class NodeRemoteService implements RemoteService {

    protected readonly onConnectionChangedEmitter = new Emitter<RemoteConnection>();
    readonly onConnectionChanged: Event<RemoteConnection> = this.onConnectionChangedEmitter.event;

    protected connections = new Map<string, RemoteConnection>();

    async getConnections(): Promise<RemoteConnection[]> {
        return Array.from(this.connections.values());
    }

    async connect(options: RemoteConnectionOptions): Promise<RemoteConnection> {
        // Implementation would use SSH2 library to establish actual SSH connections
        throw new Error('Not implemented in browser backend');
    }

    async disconnect(connectionId: string): Promise<void> {
        // Implementation would close SSH connections
        throw new Error('Not implemented in browser backend');
    }

    async getConnection(connectionId: string): Promise<RemoteConnection | undefined> {
        return this.connections.get(connectionId);
    }
}

@injectable()
export class NodeRemoteConnectionService implements RemoteConnectionService {

    protected readonly onConnectionStatusChangedEmitter = new Emitter<RemoteConnection>();
    readonly onConnectionStatusChanged: Event<RemoteConnection> = this.onConnectionStatusChangedEmitter.event;

    async createConnection(options: RemoteConnectionOptions): Promise<RemoteConnection> {
        // Implementation would use SSH2 library
        throw new Error('Not implemented in browser backend');
    }

    async testConnection(options: RemoteConnectionOptions): Promise<boolean> {
        // Implementation would test SSH connectivity
        throw new Error('Not implemented in browser backend');
    }

    async closeConnection(connectionId: string): Promise<void> {
        // Implementation would close SSH connection
        throw new Error('Not implemented in browser backend');
    }

    async getActiveConnections(): Promise<RemoteConnection[]> {
        return [];
    }
}

@injectable()
export class NodeRemotePortForwardingService implements RemotePortForwardingService {

    protected readonly onPortForwardingChangedEmitter = new Emitter<PortForwardingRule>();
    readonly onPortForwardingChanged: Event<PortForwardingRule> = this.onPortForwardingChangedEmitter.event;

    async createPortForwarding(connectionId: string, localPort: number, remoteHost: string, remotePort: number): Promise<PortForwardingRule> {
        // Implementation would create SSH tunnels
        throw new Error('Not implemented in browser backend');
    }

    async removePortForwarding(ruleId: string): Promise<void> {
        // Implementation would close SSH tunnels
        throw new Error('Not implemented in browser backend');
    }

    async getPortForwardingRules(connectionId: string): Promise<PortForwardingRule[]> {
        return [];
    }

    async getAllPortForwardingRules(): Promise<PortForwardingRule[]> {
        return [];
    }
}