# Theia Remote Module - Browser Support

This document describes the browser support implementation for the Theia Remote module.

## Overview

The original Theia Remote module only supported Electron environments. This implementation adds browser support by creating a new architecture that works within browser limitations.

## Architecture

### Directory Structure

```
src/
├── browser/                    # Browser-specific frontend code
│   ├── remote-service-impl.ts
│   ├── remote-connection-service-impl.ts
│   ├── remote-port-forwarding-service-impl.ts
│   ├── remote-frontend-contribution.ts
│   ├── remote-connection-dialog.ts
│   ├── remote-frontend-module.ts
│   └── style/
│       └── remote-dialog.css
├── common/                     # Shared interfaces and types
│   ├── remote-types.ts
│   └── remote-service.ts
├── node/                       # Node.js backend code
│   ├── remote-backend-service-impl.ts
│   └── remote-backend-module.ts
├── electron-browser/           # Electron frontend (existing)
├── electron-node/              # Electron backend (existing)
└── electron-common/            # Electron shared (existing)
```

### Key Features

1. **Remote Connections**: Connect to remote hosts via WebSocket proxy
2. **Port Forwarding**: Forward ports through the backend proxy
3. **Connection Management**: Manage multiple remote connections
4. **User Interface**: Dialog for connection configuration

### Browser Limitations and Solutions

#### SSH Connections
- **Limitation**: Browsers cannot establish direct SSH connections
- **Solution**: Use WebSocket proxy that handles SSH connections on the backend

#### Port Forwarding
- **Limitation**: Browsers cannot bind to local ports
- **Solution**: Backend handles port forwarding, browser accesses through proxy URLs

#### File System Access
- **Limitation**: Limited file system access in browsers
- **Solution**: All file operations go through the backend services

## Implementation Details

### Services

1. **RemoteService**: Main service for managing remote connections
2. **RemoteConnectionService**: Handles connection establishment and management
3. **RemotePortForwardingService**: Manages port forwarding rules

### Frontend Components

1. **RemoteConnectionDialog**: UI for configuring remote connections
2. **BrowserRemoteFrontendContribution**: Provides commands and menu items

### Backend Integration

The browser version can work with either:
1. Local implementations (for demo/testing)
2. Backend services via RPC (for production)

## Usage

### Commands

- `remote.connect`: Open connection dialog
- `remote.disconnect`: Disconnect from remote host
- `remote.show-connections`: Show active connections

### Menu Items

Available in File menu:
- "Connect to Remote Host"
- "Show Remote Connections"

## Configuration

The module is configured in `package.json`:

```json
{
  "theiaExtensions": [
    {
      "frontend": "lib/browser/remote-frontend-module",
      "backend": "lib/node/remote-backend-module"
    },
    {
      "frontendElectron": "lib/electron-browser/remote-frontend-module",
      "backendElectron": "lib/electron-node/remote-backend-module"
    }
  ]
}
```

## Future Enhancements

1. **WebSocket Proxy Server**: Implement a proper WebSocket-to-SSH proxy
2. **Authentication**: Support for SSH keys and advanced authentication
3. **File Browser**: Remote file system browsing
4. **Terminal Integration**: Remote terminal sessions
5. **Workspace Sync**: Synchronize workspace settings with remote hosts

## Development

To build the module:

```bash
cd packages/remote
npm run compile
```

To test in browser environment:

```bash
cd examples/browser
npm start
```

The remote functionality will be available in the File menu.