import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Form } from './interfaces/form.interface';
import { FormADto } from './dto/form-a.dto';
import { FormBDto } from './dto/form-b.dto';

@Injectable()
export class FormsService {
  constructor(@Inject('FORM_MODEL') private readonly formModel: Model<Form>) {}

  async create(data: FormADto): Promise<Form> {
    const resp = this.formModel.create(data);
    return resp;
  }

  async findAll(): Promise<Form[]> {
    return this.formModel.find().exec();
  }

  async processForm(data: FormADto | FormBDto) {
    const formType = 'inn' in data ? 'A' : 'B';
    try {
      await this.formModel.create({
        type: formType,
        data: data,
      });
    } catch (err) {
      console.error('Не удалось записать данные формы в MongoDB:', err);
    }

    if (Math.random() < 0.8) {
      return {
        requestId: String(Date.now()),
        classifier: 'cls-' + Math.random().toString(36).slice(2, 9),
      };
    } else {
      return {
        error: 'Серверная ошибка (вероятность 20%)',
      };
    }
  }
}
