import { Controller, Get, Post, Request } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormADto } from './dto/form-a.dto';
import { FormBDto } from './dto/form-b.dto';

@Controller('form')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('a')
  handleFormA(@Request() req: { body: FormADto }) {
    return this.formsService.processForm(req.body);
  }

  @Post('b')
  handleFormB(@Request() req: { body: FormBDto }) {
    return this.formsService.processForm(req.body);
  }

  @Get('all')
  handleGetAll() {
    return this.formsService.findAll();
  }
}
