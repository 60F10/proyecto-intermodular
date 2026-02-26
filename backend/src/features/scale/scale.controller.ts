import { Controller, Get } from '@nestjs/common'
import { ScaleService } from './scale.service'

@Controller('scale')
export class ScaleController {
  constructor(private readonly scaleService: ScaleService) {}

  @Get('weight')
  getWeight() {
    return this.scaleService.getLatest()
  }
}
