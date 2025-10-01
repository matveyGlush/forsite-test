import { Document } from 'mongoose';

export interface Form extends Document {
  type: 'A' | 'B';
  data:
    | {
        name: string;
        email: string;
        surname: string;
        patronymic: string;
        dob: string;
        login: string;
      }
    | {
        name: string;
        email: string;
        inn: string;
        phone: string;
      };
}
