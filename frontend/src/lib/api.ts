import { FormAData, FormBData } from '../types/forms'

export type GetAllSuccess = { type: string; data: FormAData | FormBData }
export type ServerSuccess = { requestId: string; classifier: string }
export type ServerError = { error: string }

export async function postFormA(data: FormAData): Promise<ServerSuccess | ServerError> {
  const url = import.meta.env.VITE_FORM_BACKEND_URL + 'a';
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
  const url = import.meta.env.VITE_FORM_BACKEND_URL + 'b';
  if (!url) {
    return { error: 'FORM_A_BACKEND_URL is not defined' };
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function getAllData(): Promise<GetAllSuccess[] | ServerError> {
  const url = import.meta.env.VITE_FORM_BACKEND_URL + 'all';
  if (!url) {
    return { error: 'FORM_A_BACKEND_URL is not defined' };
  }
  const res = await fetch(url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}