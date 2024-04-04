<img src="https://avatars.githubusercontent.com/u/64851912" alt="MapComponents logo" width="200"/>

# PWA-Demo with MapComponents + vite + react + typescript

This project merges PWA technology with MapComponents, aiming to provide reliable, fail-safe access to data offline. It uses a Service Worker for enhanced performance and data accessibility.
MapComponents MapLibre is a react component library for declarative GIS application development.



## Links

- Live PWA Demo: https://pwademo.wheregroup.com/
- MapComponents: https://github.com/mapcomponents/react-map-components-maplibre

## Features

- **Offline Functionality:** Offers robust offline maps and data access.
- **Cross-Platform Compatibility:** Designed for seamless operation across all devices.
- **Easy Updates & Maintenance:** Ensures easy access to the latest features.

## Getting Started

Install project dependencies:

```bash
yarn
```
Docker: 

```bash
docker build . -t mc_pwa_data_processing
docker run -d -p 8080:8080 mc_pwa_data_processing
```

### Update data
To build background tiles, data tiles, geometry and search indices. 

```bash
yarn processData
```

### Start the development server

```bash
yarn dev
```

### Build for production

```bash
yarn build
```

