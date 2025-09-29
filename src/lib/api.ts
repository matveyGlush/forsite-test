import { FormAData, FormBData } from '../types/forms'

export type ServerSuccess = { requestId: string; classifier: string }
export type ServerError = { error: string }

function fakeFetch<T>(path: string, body: any): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (Math.random() < 0.8) {
        const success = { requestId: String(Date.now()), classifier: 'cls-' + Math.random().toString(36).slice(2, 9) }
        // @ts-ignore
        resolve(success)
      } else {
        // @ts-ignore
        resolve({ error: 'Серверная ошибка: не удалось сохранить данные' })
      }
    }, 700)
  })
}

export async function postFormA(data: FormAData): Promise<ServerSuccess | ServerError> {
  return fakeFetch('/form/a', data)
}

export async function postFormB(data: FormBData): Promise<ServerSuccess | ServerError> {
  return fakeFetch('/form/b', data)
}