import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    requestId: '' as string,
    classifier: '' as string
  }),
  actions: {
    setResult(requestId: string, classifier: string) {
      this.requestId = requestId
      this.classifier = classifier
    }
  }
})