import { Mongoose } from 'mongoose';
import { FormSchema } from './schemas/forms.schema';

export const formsProviders = [
  {
    provide: 'FORM_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('forms', FormSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
