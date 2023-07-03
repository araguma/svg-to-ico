import { Buffer } from 'node:buffer';
import fs from 'fs';
import sharp from 'sharp';

const dimensions = [16, 24, 32, 48, 64, 128, 256];
const headerSize = 6;
const directorySize = 16;
const headerDirectorySize = headerSize + directorySize * dimensions.length;

async function svgToIco(inputPath: string, outputPath: string) {
    const pngBuffers = await Promise.all(dimensions.map((dimension) => {
        return sharp(inputPath)
            .resize(dimension, dimension)
            .png()
            .toBuffer();
    }));
    const icoBuffer = Buffer.alloc(headerDirectorySize + pngBuffers.reduce((acc, cur) => {
        return acc + cur.length;
    }, 0));

    // Header
    icoBuffer.writeUint16LE(0, 0); // Reserved
    icoBuffer.writeUint16LE(1, 2); // Type
    icoBuffer.writeUint16LE(dimensions.length, 4); // Number of PNGs

    // Directory
    let offset = headerSize;
    let pngOffset = headerDirectorySize;
    for(let i = 0; i < dimensions.length; pngOffset += pngBuffers[i].length, offset += directorySize, i ++) {
        icoBuffer.writeUint8(dimensions[i] < 256 ? dimensions[i] : 0, offset); // Width
        icoBuffer.writeUint8(dimensions[i] < 256 ? dimensions[i] : 0, offset + 1); // Height
        icoBuffer.writeUint8(0, offset + 2); // Color palette
        icoBuffer.writeUint8(0, offset + 3); // Reserved
        icoBuffer.writeUint16LE(1, offset + 4); // Color planes
        icoBuffer.writeUint16LE(8, offset + 6); // Bits per pixel
        icoBuffer.writeUint32LE(pngBuffers[i].length, offset + 8); // PNG size
        icoBuffer.writeUint32LE(pngOffset, offset + 12); // PNG offset
    }

    // PNG Data
    Buffer.concat(pngBuffers).copy(icoBuffer, headerDirectorySize);

    fs.writeFileSync(outputPath, icoBuffer);
}

export default svgToIco;