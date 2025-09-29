export interface FormAData {
  name: string
  email?: string
  inn: string
  phone: string
}

export interface FormBData {
  name: string
  surname: string
  patronymic?: string
  dob: string // DD.MM.YYYY
  login: string
  email: string
}