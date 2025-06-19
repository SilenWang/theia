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
import { AbstractDialog, DialogProps, Message } from '@theia/core/lib/browser';
import { RemoteConnectionOptions } from '../common/remote-types';
import { RemoteConnectionService } from '../common/remote-service';

@injectable()
export class RemoteConnectionDialog extends AbstractDialog<RemoteConnectionOptions> {

    @inject(RemoteConnectionService)
    protected readonly connectionService: RemoteConnectionService;

    protected hostInput: HTMLInputElement;
    protected portInput: HTMLInputElement;
    protected usernameInput: HTMLInputElement;
    protected passwordInput: HTMLInputElement;
    protected testButton: HTMLButtonElement;

    constructor(
        @inject(DialogProps) protected readonly props: DialogProps
    ) {
        super(props);
        this.title = 'Connect to Remote Host';
    }

    protected createMessageNode(): HTMLElement {
        const messageNode = document.createElement('div');
        messageNode.classList.add('remote-connection-dialog');

        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '10px';

        // Host input
        const hostGroup = this.createInputGroup('Host:', 'text', 'localhost');
        this.hostInput = hostGroup.querySelector('input')!;
        form.appendChild(hostGroup);

        // Port input
        const portGroup = this.createInputGroup('Port:', 'number', '22');
        this.portInput = portGroup.querySelector('input')!;
        form.appendChild(portGroup);

        // Username input
        const usernameGroup = this.createInputGroup('Username:', 'text', '');
        this.usernameInput = usernameGroup.querySelector('input')!;
        form.appendChild(usernameGroup);

        // Password input
        const passwordGroup = this.createInputGroup('Password:', 'password', '');
        this.passwordInput = passwordGroup.querySelector('input')!;
        form.appendChild(passwordGroup);

        // Test connection button
        const testGroup = document.createElement('div');
        testGroup.style.display = 'flex';
        testGroup.style.justifyContent = 'flex-end';
        testGroup.style.marginTop = '10px';

        this.testButton = document.createElement('button');
        this.testButton.type = 'button';
        this.testButton.textContent = 'Test Connection';
        this.testButton.classList.add('theia-button', 'secondary');
        this.testButton.onclick = () => this.testConnection();
        testGroup.appendChild(this.testButton);

        form.appendChild(testGroup);
        messageNode.appendChild(form);

        return messageNode;
    }

    protected createInputGroup(label: string, type: string, placeholder: string): HTMLElement {
        const group = document.createElement('div');
        group.style.display = 'flex';
        group.style.flexDirection = 'column';
        group.style.gap = '5px';

        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.style.fontWeight = 'bold';
        group.appendChild(labelElement);

        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.classList.add('theia-input');
        group.appendChild(input);

        return group;
    }

    protected async testConnection(): Promise<void> {
        const options = this.getConnectionOptions();
        if (!options) {
            return;
        }

        this.testButton.disabled = true;
        this.testButton.textContent = 'Testing...';

        try {
            const success = await this.connectionService.testConnection(options);
            if (success) {
                this.testButton.textContent = 'Connection OK';
                this.testButton.style.color = 'green';
            } else {
                this.testButton.textContent = 'Connection Failed';
                this.testButton.style.color = 'red';
            }
        } catch (error) {
            this.testButton.textContent = 'Connection Failed';
            this.testButton.style.color = 'red';
        }

        setTimeout(() => {
            this.testButton.disabled = false;
            this.testButton.textContent = 'Test Connection';
            this.testButton.style.color = '';
        }, 2000);
    }

    protected getConnectionOptions(): RemoteConnectionOptions | undefined {
        const host = this.hostInput.value.trim();
        const username = this.usernameInput.value.trim();

        if (!host || !username) {
            return undefined;
        }

        return {
            host,
            port: parseInt(this.portInput.value) || 22,
            username,
            password: this.passwordInput.value
        };
    }

    get value(): RemoteConnectionOptions | undefined {
        return this.getConnectionOptions();
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        this.hostInput.focus();
    }
}