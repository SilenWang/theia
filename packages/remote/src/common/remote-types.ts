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

export interface RemoteConnection {
    id: string;
    name: string;
    host: string;
    port?: number;
    username?: string;
    status: RemoteConnectionStatus;
    type: RemoteConnectionType;
}

export enum RemoteConnectionStatus {
    Disconnected = 'disconnected',
    Connecting = 'connecting',
    Connected = 'connected',
    Error = 'error'
}

export enum RemoteConnectionType {
    SSH = 'ssh',
    WebSocket = 'websocket'
}

export interface RemoteConnectionOptions {
    host: string;
    port?: number;
    username?: string;
    password?: string;
    privateKey?: string;
    passphrase?: string;
}

export interface PortForwardingRule {
    id: string;
    localPort: number;
    remoteHost: string;
    remotePort: number;
    status: PortForwardingStatus;
}

export enum PortForwardingStatus {
    Inactive = 'inactive',
    Active = 'active',
    Error = 'error'
}

export const RemoteServicePath = '/services/remote';
export const RemoteConnectionServicePath = '/services/remote-connection';
export const RemotePortForwardingServicePath = '/services/remote-port-forwarding';

export const RemoteService = Symbol('RemoteService');
export const RemoteConnectionService = Symbol('RemoteConnectionService');
export const RemotePortForwardingService = Symbol('RemotePortForwardingService');