import { FormAData, FormBData } from '../types/forms'

export type ServerSuccess = { requestId: string; classifier: string }
export type ServerError = { error: string }

export async function postFormA(data: FormAData): Promise<ServerSuccess | ServerError> {
  const url = import.meta.env.VITE_FORM_A_BACKEND_URL;
  if (!url) {
    return { error: 'FORM_A_BACKEND_URL is not defined' };
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function postFormB(data: FormBData): Promise<ServerSuccess | ServerError> {
  const url = import.meta.env.VITE_FORM_B_BACKEND_URL;
  if (!url) {
    return { error: 'FORM_A_BACKEND_URL is not defined' };
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Host': 'forsite-test.vercel.app',
      'Origin': 'https://forsite-test.vercel.app'
    },
    body: JSON.stringify(data)
  })
  return res.json()
}