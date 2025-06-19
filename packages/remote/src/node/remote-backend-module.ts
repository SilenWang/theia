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
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { 
    NodeRemoteService, 
    NodeRemoteConnectionService, 
    NodeRemotePortForwardingService 
} from './remote-backend-service-impl';
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

export default new ContainerModule(bind => {
    // Remote Service
    bind(NodeRemoteService).toSelf().inSingletonScope();
    bind(RemoteService).toService(NodeRemoteService);
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler(RemoteServicePath, () => ctx.container.get(RemoteService))
    ).inSingletonScope();

    // Remote Connection Service
    bind(NodeRemoteConnectionService).toSelf().inSingletonScope();
    bind(RemoteConnectionService).toService(NodeRemoteConnectionService);
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler(RemoteConnectionServicePath, () => ctx.container.get(RemoteConnectionService))
    ).inSingletonScope();

    // Remote Port Forwarding Service
    bind(NodeRemotePortForwardingService).toSelf().inSingletonScope();
    bind(RemotePortForwardingService).toService(NodeRemotePortForwardingService);
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler(RemotePortForwardingServicePath, () => ctx.container.get(RemotePortForwardingService))
    ).inSingletonScope();
});