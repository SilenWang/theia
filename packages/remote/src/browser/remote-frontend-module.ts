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

import { ContainerModule } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution, CommandContribution, MenuContribution } from '@theia/core/lib/browser';
import { BrowserRemoteFrontendContribution } from './remote-frontend-contribution';
import { BrowserRemoteService } from './remote-service-impl';
import { BrowserRemoteConnectionService } from './remote-connection-service-impl';
import { BrowserRemotePortForwardingService } from './remote-port-forwarding-service-impl';
import { RemoteConnectionDialog } from './remote-connection-dialog';
import { 
    RemoteService, 
    RemoteConnectionService, 
    RemotePortForwardingService 
} from '../common/remote-service';
import { 
    RemoteServicePath, 
    RemoteConnectionServicePath, 
    RemotePortForwardingServicePath 
} from '../common/remote-types';
import { ServiceConnectionProvider } from '@theia/core/lib/browser/messaging/service-connection-provider';
import './style/remote-dialog.css';

export default new ContainerModule(bind => {
    // Frontend contribution
    bind(BrowserRemoteFrontendContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(BrowserRemoteFrontendContribution);
    bind(CommandContribution).toService(BrowserRemoteFrontendContribution);
    bind(MenuContribution).toService(BrowserRemoteFrontendContribution);

    // Dialog
    bind(RemoteConnectionDialog).toSelf().inSingletonScope();

    // Services - bind to local implementations for browser version
    bind(BrowserRemoteService).toSelf().inSingletonScope();
    bind(RemoteService).toService(BrowserRemoteService);

    bind(BrowserRemoteConnectionService).toSelf().inSingletonScope();
    bind(RemoteConnectionService).toService(BrowserRemoteConnectionService);

    bind(BrowserRemotePortForwardingService).toSelf().inSingletonScope();
    bind(RemotePortForwardingService).toService(BrowserRemotePortForwardingService);

    // For future backend integration, you can uncomment these lines:
    // bind(RemoteService).toDynamicValue(ctx =>
    //     ServiceConnectionProvider.createProxy<RemoteService>(ctx.container, RemoteServicePath)
    // ).inSingletonScope();
    
    // bind(RemoteConnectionService).toDynamicValue(ctx =>
    //     ServiceConnectionProvider.createProxy<RemoteConnectionService>(ctx.container, RemoteConnectionServicePath)
    // ).inSingletonScope();
    
    // bind(RemotePortForwardingService).toDynamicValue(ctx =>
    //     ServiceConnectionProvider.createProxy<RemotePortForwardingService>(ctx.container, RemotePortForwardingServicePath)
    // ).inSingletonScope();
});