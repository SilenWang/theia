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

import { Event } from '@theia/core';
import { RemoteConnection, RemoteConnectionOptions, PortForwardingRule } from './remote-types';

export interface RemoteService {
    readonly onConnectionChanged: Event<RemoteConnection>;
    
    getConnections(): Promise<RemoteConnection[]>;
    connect(options: RemoteConnectionOptions): Promise<RemoteConnection>;
    disconnect(connectionId: string): Promise<void>;
    getConnection(connectionId: string): Promise<RemoteConnection | undefined>;
}

export interface RemoteConnectionService {
    readonly onConnectionStatusChanged: Event<RemoteConnection>;
    
    createConnection(options: RemoteConnectionOptions): Promise<RemoteConnection>;
    testConnection(options: RemoteConnectionOptions): Promise<boolean>;
    closeConnection(connectionId: string): Promise<void>;
    getActiveConnections(): Promise<RemoteConnection[]>;
}

export interface RemotePortForwardingService {
    readonly onPortForwardingChanged: Event<PortForwardingRule>;
    
    createPortForwarding(connectionId: string, localPort: number, remoteHost: string, remotePort: number): Promise<PortForwardingRule>;
    removePortForwarding(ruleId: string): Promise<void>;
    getPortForwardingRules(connectionId: string): Promise<PortForwardingRule[]>;
    getAllPortForwardingRules(): Promise<PortForwardingRule[]>;
}