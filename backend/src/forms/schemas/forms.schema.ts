import * as mongoose from 'mongoose';

export const FormSchema = new mongoose.Schema({
  type: String,
  data: {
    name: String,
    email: String,
    surname: String,
    patronymic: String,
    dob: String,
    login: String,
    inn: String,
    phone: String,
  },
});
