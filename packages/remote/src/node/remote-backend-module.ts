import { ContainerModule } from '@theia/core/shared/inversify';
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core/lib/common';
import { RemoteService } from '../common/remote-service';
import { RemoteServiceImpl } from './remote-service-impl';
import { BackendApplicationContribution } from '@theia/core/lib/node';

export default new ContainerModule(bind => {
    bind(RemoteServiceImpl).toSelf().inSingletonScope();
    bind(RemoteService).toService(RemoteServiceImpl);
    bind(BackendApplicationContribution).toService(RemoteServiceImpl);

    bind(ConnectionHandler).toDynamicValue(ctx => 
        new JsonRpcConnectionHandler<RemoteService>('/services/remote', () => 
            ctx.container.get(RemoteService)
        )
    ).inSingletonScope();
});
