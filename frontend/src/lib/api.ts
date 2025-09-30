import { FormAData, FormBData } from '../types/forms'

export type ServerSuccess = { requestId: string; classifier: string }
export type ServerError = { error: string }

export async function postFormA(data: FormAData): Promise<ServerSuccess | ServerError> {
  const res = await fetch('http://localhost:3000/form/a', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function postFormB(data: FormBData): Promise<ServerSuccess | ServerError> {
  const res = await fetch('http://localhost:3000/form/b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}