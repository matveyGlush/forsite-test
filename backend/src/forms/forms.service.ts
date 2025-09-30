import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { FormADto } from './dto/form-a.dto';
import { FormBDto } from './dto/form-b.dto';

@Injectable()
export class FormsService {
  processForm(data: FormADto | FormBDto) {
    console.log('Получены данные формы:', data);

    try {
      const filePath = join(process.cwd(), 'data.json');
      let existingContent = '';
      existingContent = fs.readFileSync(filePath, 'utf-8').trim();
      let list: unknown = [];
      if (existingContent.length > 0) {
        try {
          list = JSON.parse(existingContent);
        } catch {
          list = [];
        }
      }
      const dataList = Array.isArray(list) ? list : [];
      dataList.push(data as unknown as Record<string, unknown>);
      fs.writeFileSync(filePath, JSON.stringify(dataList, null, 2), 'utf-8');
    } catch (err) {
      console.error('Не удалось записать данные формы в data.json:', err);
    }

    if (Math.random() < 0.8) {
      return {
        requestId: String(Date.now()),
        classifier: 'cls-' + Math.random().toString(36).slice(2, 9),
      };
    } else {
      return { error: 'Серверная ошибка: не удалось сохранить данные' };
    }
  }
}
