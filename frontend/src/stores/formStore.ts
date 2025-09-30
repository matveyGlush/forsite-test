import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    formAData: {
      name: '',
      email: '',
      inn: '',
      phone: ''
    } as {
      name: string
      email: string
      inn: string
      phone: string
    },

    requestIdA: '' as string,
    classifierA: '' as string,
    submittedA: false as boolean,

    formBData: {
      name: '',
      surname: '',
      patronymic: '',
      dob: '',
      login: '',
      email: ''
    } as {
      name: string
      surname: string
      patronymic: string
      dob: string
      login: string
      email: string
    },

    requestIdB: '' as string,
    classifierB: '' as string,
    submittedB: false as boolean
  }),
  actions: {
    setFormAData(payload: Partial<{ name: string; email: string; inn: string; phone: string }>) {
      this.formAData = { ...this.formAData, ...payload }
    },
    setFormBData(payload: Partial<{ name: string; surname: string; patronymic: string; dob: string; login: string; email: string }>) {
      this.formBData = { ...this.formBData, ...payload }
    },
    setResult(form: 'a' | 'b', requestId: string, classifier: string) {
      if (form === 'a') {
        this.requestIdA = requestId
        this.classifierA = classifier
        this.submittedA = true
      } else {
        this.requestIdB = requestId
        this.classifierB = classifier
        this.submittedB = true
      }
    },
  }
})