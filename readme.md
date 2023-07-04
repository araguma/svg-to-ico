## Installation

```bash
npm i https://github.com/araguma/svg-to-ico.git
```

## Usage

```typescript
import svgToIco from 'svg-to-ico'

svgToIco('path/to/input.svg', 'path/to/output.ico');
// Generated output.ico contains the following:
// input.png (16 x 16)
// input.png (24 x 24)
// input.png (32 x 32)
// input.png (48 x 48)
// input.png (64 x 64)
// input.png (128 x 128)
// input.png (256 x 256)
```