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
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core';
import { FrontendApplicationContribution, CommonMenus } from '@theia/core/lib/browser';
import { RemoteService } from '../common/remote-service';
import { RemoteConnectionDialog } from './remote-connection-dialog';

export namespace RemoteCommands {
    export const CONNECT_TO_REMOTE: Command = {
        id: 'remote.connect',
        label: 'Connect to Remote Host'
    };

    export const DISCONNECT_FROM_REMOTE: Command = {
        id: 'remote.disconnect',
        label: 'Disconnect from Remote Host'
    };

    export const SHOW_REMOTE_CONNECTIONS: Command = {
        id: 'remote.show-connections',
        label: 'Show Remote Connections'
    };
}

@injectable()
export class BrowserRemoteFrontendContribution implements FrontendApplicationContribution, CommandContribution, MenuContribution {

    @inject(RemoteService)
    protected readonly remoteService: RemoteService;

    @inject(RemoteConnectionDialog)
    protected readonly connectionDialog: RemoteConnectionDialog;

    async initializeLayout(): Promise<void> {
        // Initialize remote connections on startup
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(RemoteCommands.CONNECT_TO_REMOTE, {
            execute: () => this.connectToRemote()
        });

        registry.registerCommand(RemoteCommands.DISCONNECT_FROM_REMOTE, {
            execute: () => this.disconnectFromRemote()
        });

        registry.registerCommand(RemoteCommands.SHOW_REMOTE_CONNECTIONS, {
            execute: () => this.showRemoteConnections()
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.FILE, {
            commandId: RemoteCommands.CONNECT_TO_REMOTE.id,
            label: RemoteCommands.CONNECT_TO_REMOTE.label,
            order: 'z1'
        });

        menus.registerMenuAction(CommonMenus.FILE, {
            commandId: RemoteCommands.SHOW_REMOTE_CONNECTIONS.id,
            label: RemoteCommands.SHOW_REMOTE_CONNECTIONS.label,
            order: 'z2'
        });
    }

    protected async connectToRemote(): Promise<void> {
        const options = await this.connectionDialog.open();
        if (options) {
            try {
                await this.remoteService.connect(options);
            } catch (error) {
                console.error('Failed to connect to remote host:', error);
            }
        }
    }

    protected async disconnectFromRemote(): Promise<void> {
        const connections = await this.remoteService.getConnections();
        const activeConnections = connections.filter(conn => conn.status === 'connected');
        
        if (activeConnections.length === 0) {
            return;
        }

        // For simplicity, disconnect the first active connection
        // In a real implementation, you'd show a selection dialog
        const connection = activeConnections[0];
        await this.remoteService.disconnect(connection.id);
    }

    protected async showRemoteConnections(): Promise<void> {
        const connections = await this.remoteService.getConnections();
        console.log('Remote connections:', connections);
        // In a real implementation, you'd show a widget or dialog with the connections
    }
}