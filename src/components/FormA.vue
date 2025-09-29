<template>
  <div>
    <h2>Форма A</h2>
    <form @submit.prevent="onSubmit">
      <label>Имя*<input v-model="data.name" /></label>
      <div v-if="errors.name" class="error">{{ errors.name }}</div>

      <label>Email<input v-model="data.email" /></label>
      <div v-if="errors.email" class="error">{{ errors.email }}</div>

      <label>ИНН*<input v-model="data.inn" /></label>
      <div v-if="errors.inn" class="error">{{ errors.inn }}</div>

      <label>Телефон*<input v-model="data.phone" placeholder="+7 (XXX) XXX-XX-XX" /></label>
      <div v-if="errors.phone" class="error">{{ errors.phone }}</div>

      <button :disabled="!isValid || sending">Отправить</button>
      <div v-if="serverError" class="error">{{ serverError }}</div>
      <div v-if="sending">Отправка...</div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, watch } from 'vue'
import { postFormA } from '../lib/api'
import { useFormStore } from '../stores/formStore'
import type { FormAData } from '../types/forms'

const data = reactive<FormAData>({ name: '', email: '', inn: '', phone: '' })
const errors = reactive<{ [k: string]: string | null }>({ name: null, email: null, inn: null, phone: null })
const sending = ref(false)
const serverError = ref('')
const store = useFormStore()

function validateName() { errors.name = data.name.trim() ? null : 'Имя обязательно' }
function validateEmail() {
  if (!data.email) { errors.email = null; return }
  const re = /^\S+@\S+\.\S+$/
  errors.email = re.test(data.email) ? null : 'Неверный email'
}
function validateINN() {
  const v = data.inn.trim()
  if (!v) { errors.inn = 'ИНН обязателен'; return }
  if (!/^\d{10}$/.test(v) && !/^\d{12}$/.test(v)) { errors.inn = 'ИНН должен быть 10 или 12 цифр'; return }
  errors.inn = null
}
function validatePhone() {
  const re = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
  errors.phone = re.test(data.phone) ? null : 'Телефон в формате +7 (XXX) XXX-XX-XX'
}

watch(() => data.name, validateName)
watch(() => data.email, validateEmail)
watch(() => data.inn, validateINN)
watch(() => data.phone, validatePhone)

const isValid = computed(() => {
  validateName(); validateEmail(); validateINN(); validatePhone();
  return !errors.name && !errors.email && !errors.inn && !errors.phone
})

async function onSubmit() {
  serverError.value = ''
  if (!isValid.value) return
  sending.value = true
  try {
    const res = await postFormA({ ...data })
    // @ts-ignore
    if ((res as any).requestId) {
      // @ts-ignore
      store.setResult((res as any).requestId, (res as any).classifier)
      window.location.pathname = '/result'
    } else {
      // @ts-ignore
      serverError.value = (res as any).error || 'Неизвестная ошибка'
    }
  } catch (e) {
    serverError.value = String(e)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.error { color: red }
</style>