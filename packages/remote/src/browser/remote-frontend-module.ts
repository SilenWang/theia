import { ContainerModule } from '@theia/core/shared/inversify';
import { bindRemotePreferences } from './remote-preferences';
import { RemoteFrontendContribution } from './remote-frontend-contribution';
import { FrontendApplicationContribution, CommandContribution } from '@theia/core/lib/browser';
import { RemoteService } from '../common/remote-service';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';

export default new ContainerModule((bind, _, __, rebind) => {
    bind(RemoteFrontendContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(RemoteFrontendContribution);
    bind(CommandContribution).toService(RemoteFrontendContribution);

    bindRemotePreferences(bind);

    bind(RemoteService).toDynamicValue(ctx => 
        WebSocketConnectionProvider.createProxy<RemoteService>(ctx.container, '/services/remote')
    ).inSingletonScope();
});
