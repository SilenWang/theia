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

import { injectable, inject } from '@theia/core/shared/inversify';
import { Emitter, Event } from '@theia/core';
import { RemoteService, RemoteConnectionService } from '../common/remote-service';
import { RemoteConnection, RemoteConnectionOptions, RemoteConnectionStatus, RemoteConnectionType } from '../common/remote-types';

@injectable()
export class BrowserRemoteService implements RemoteService {

    @inject(RemoteConnectionService)
    protected readonly connectionService: RemoteConnectionService;

    protected readonly onConnectionChangedEmitter = new Emitter<RemoteConnection>();
    readonly onConnectionChanged: Event<RemoteConnection> = this.onConnectionChangedEmitter.event;

    protected connections = new Map<string, RemoteConnection>();

    constructor() {
        this.connectionService.onConnectionStatusChanged(connection => {
            this.connections.set(connection.id, connection);
            this.onConnectionChangedEmitter.fire(connection);
        });
    }

    async getConnections(): Promise<RemoteConnection[]> {
        return Array.from(this.connections.values());
    }

    async connect(options: RemoteConnectionOptions): Promise<RemoteConnection> {
        const connection = await this.connectionService.createConnection(options);
        this.connections.set(connection.id, connection);
        this.onConnectionChangedEmitter.fire(connection);
        return connection;
    }

    async disconnect(connectionId: string): Promise<void> {
        await this.connectionService.closeConnection(connectionId);
        const connection = this.connections.get(connectionId);
        if (connection) {
            connection.status = RemoteConnectionStatus.Disconnected;
            this.onConnectionChangedEmitter.fire(connection);
        }
    }

    async getConnection(connectionId: string): Promise<RemoteConnection | undefined> {
        return this.connections.get(connectionId);
    }
}