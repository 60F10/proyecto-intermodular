import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common'

const STX = 0x02
const ETX = 0x03

@Injectable()
export class ScaleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScaleService.name)
  private port: any = null
  private buffer: any = Buffer.alloc(0)
  private latest: { weight: number | null; raw?: string; timestamp?: Date } = { weight: null }

  onModuleInit() {
    const portName = process.env.SCALE_PORT || process.env.DB_SCALE_PORT || 'COM1'
    const baud = Number(process.env.SCALE_BAUD || process.env.DB_SCALE_BAUD || 9600)
    try {
      // Load serialport at runtime so the app doesn't crash if the optional
      // dependency wasn't installed. The package is listed as optional.
      let SerialPortClass: any = null
      try {
        // Support different export shapes across serialport versions
        const sp = require('serialport')
        SerialPortClass = sp?.SerialPort || sp?.default || sp
      } catch (e) {
        this.logger.warn('serialport module not installed; scale reading disabled. Install with `npm install serialport` to enable.')
        return
      }

      this.port = new SerialPortClass({ path: portName, baudRate: baud, autoOpen: true })
      this.logger.log(`Opening scale serial port ${portName} @ ${baud}`)

      this.port.on('data', (chunk: Buffer) => {
        this.handleChunk(chunk)
      })

      this.port.on('error', (err) => {
        this.logger.error('Scale serial error: ' + (err?.message || err))
      })
    } catch (err) {
      this.logger.warn('Could not open serial port for scale: ' + (err as any)?.message)
    }
  }

  onModuleDestroy() {
    if (!this.port) return
    try {
      // Support both callback and promise-based close implementations
      const res = this.port.close()
      if (res && typeof res.then === 'function') {
        res.catch(() => null)
      }
    } catch (e) {
      // ignore
    }
  }

  private handleChunk(chunk: Buffer) {
    this.buffer = Buffer.concat([this.buffer, chunk])

    const results = this.extractFrames(this.buffer)
    const frames = results.frames
    this.buffer = results.rest as unknown as Buffer

    for (const f of frames) {
      const text = f.toString('ascii', 0).trim()
      const weight = this.parseWeight(text)
      if (weight !== null) {
        const prev = this.latest.weight
        this.latest = { weight, raw: text, timestamp: new Date() }
        if (prev !== weight) {
          this.logger.debug(`Scale weight updated: ${weight} (raw: ${text})`)
        }
      }
    }
  }

  private extractFrames(buf: Buffer): { frames: Buffer[]; rest: Buffer } {
    const frames: Buffer[] = []
    let idx = 0

    while (idx < buf.length) {
      const stx = buf.indexOf(STX, idx)
      if (stx !== -1) {
        const etx = buf.indexOf(ETX, stx + 1)
        if (etx === -1) break // incomplete
        frames.push(buf.slice(stx + 1, etx))
        idx = etx + 1
        continue
      }

      // No STX — try newline-delimited
      const nl = buf.indexOf('\n', idx)
      if (nl !== -1) {
        frames.push(buf.slice(idx, nl))
        idx = nl + 1
        continue
      }

      const cr = buf.indexOf('\r', idx)
      if (cr !== -1) {
        frames.push(buf.slice(idx, cr))
        idx = cr + 1
        continue
      }

      break
    }

    return { frames, rest: buf.slice(idx) }
  }

  private parseWeight(text: string): number | null {
    const m = Array.from(text.matchAll(/[-+]?\d+(?:[\.,]\d+)?/g)).map(r => r[0])
    if (!m.length) return null
    const last = m[m.length - 1].replace(',', '.')
    const val = parseFloat(last)
    if (Number.isFinite(val)) return val
    return null
  }

  getLatest() {
    return this.latest
  }
}
