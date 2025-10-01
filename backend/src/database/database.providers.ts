import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(
        'mongodb+srv://matveyglushkospb:gSZeJZc4ym20kkOg@lampas.as0znvc.mongodb.net/?retryWrites=true&w=majority&appName=lampas',
      ),
  },
];
