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
import { RemotePortForwardingService } from '../common/remote-service';
import { PortForwardingRule, PortForwardingStatus } from '../common/remote-types';
import { v4 as uuid } from 'uuid';

@injectable()
export class BrowserRemotePortForwardingService implements RemotePortForwardingService {

    protected readonly onPortForwardingChangedEmitter = new Emitter<PortForwardingRule>();
    readonly onPortForwardingChanged: Event<PortForwardingRule> = this.onPortForwardingChangedEmitter.event;

    protected portForwardingRules = new Map<string, PortForwardingRule>();

    async createPortForwarding(connectionId: string, localPort: number, remoteHost: string, remotePort: number): Promise<PortForwardingRule> {
        const rule: PortForwardingRule = {
            id: uuid(),
            localPort,
            remoteHost,
            remotePort,
            status: PortForwardingStatus.Inactive
        };

        this.portForwardingRules.set(rule.id, rule);

        try {
            // In browser environment, port forwarding would need to be handled
            // through a WebSocket proxy or similar mechanism
            await this.establishPortForwarding(rule, connectionId);
            rule.status = PortForwardingStatus.Active;
        } catch (error) {
            rule.status = PortForwardingStatus.Error;
            console.error('Failed to establish port forwarding:', error);
        }

        this.onPortForwardingChangedEmitter.fire(rule);
        return rule;
    }

    async removePortForwarding(ruleId: string): Promise<void> {
        const rule = this.portForwardingRules.get(ruleId);
        if (rule) {
            await this.closePortForwarding(rule);
            this.portForwardingRules.delete(ruleId);
            rule.status = PortForwardingStatus.Inactive;
            this.onPortForwardingChangedEmitter.fire(rule);
        }
    }

    async getPortForwardingRules(connectionId: string): Promise<PortForwardingRule[]> {
        // In a real implementation, you'd filter by connectionId
        return Array.from(this.portForwardingRules.values());
    }

    async getAllPortForwardingRules(): Promise<PortForwardingRule[]> {
        return Array.from(this.portForwardingRules.values());
    }

    protected async establishPortForwarding(rule: PortForwardingRule, connectionId: string): Promise<void> {
        // In browser environment, this would typically involve:
        // 1. Sending a request to the backend to establish port forwarding
        // 2. The backend would handle the actual port forwarding through SSH tunnels
        // 3. The browser would access the forwarded port through the backend proxy
        
        // For now, we'll simulate the establishment
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate for demo
                    resolve();
                } else {
                    reject(new Error('Failed to establish port forwarding'));
                }
            }, 1000);
        });
    }

    protected async closePortForwarding(rule: PortForwardingRule): Promise<void> {
        // Close the port forwarding connection
        // In a real implementation, this would notify the backend to close the tunnel
        return Promise.resolve();
    }
}