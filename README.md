# Overlay (public download)

Public download site for Overlay — a free Windows voice and typing assistant.

Application source code is private. This repository holds:

- Landing page (GitHub Pages)
- install.ps1 (one-line installer bootstrap)
- Windows installer builds as GitHub Releases

## Install on Windows

One-line (PowerShell):

```
irm https://ridhamjain28.github.io/Overlay-public/install.ps1 | iex
```

Or download Overlay-Setup-*.exe from Releases:
https://github.com/ridhamjain28/Overlay-public/releases

The installer is not code-signed yet. SmartScreen may warn you; choose More info, then Run anyway.

## License

MIT. Overlay is based on OpenWhispr (https://github.com/OpenWhispr/openwhispr), MIT, Gizmo Labs Inc. See LICENSE and NOTICE.