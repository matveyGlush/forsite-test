<template>
  <div class="form-a">
    <h2 class="form-a__title">Форма A</h2>
    <form class="form-a__form" @submit.prevent="onSubmit">
      <label class="form-a__label">Имя*
        <input class="form-a__input" v-model="data.name" />
      </label>
      <div v-if="errors.name" class="form-a__error">{{ errors.name }}</div>

      <label class="form-a__label">Email
        <input class="form-a__input" v-model="data.email" />
      </label>
      <div v-if="errors.email" class="form-a__error">{{ errors.email }}</div>

      <label class="form-a__label">ИНН*
        <input class="form-a__input" v-model="data.inn" />
      </label>
      <div v-if="errors.inn" class="form-a__error">{{ errors.inn }}</div>

      <label class="form-a__label">Телефон*
        <input class="form-a__input" v-model="data.phone" placeholder="+7 (XXX) XXX-XX-XX" />
      </label>
      <div v-if="errors.phone" class="form-a__error">{{ errors.phone }}</div>

      <div class="form-a__actions">
        <button class="form-a__submit" :disabled="!isValid || sending">Отправить</button>
        <div v-if="serverError" class="form-a__error">{{ serverError }}</div>
        <div v-if="sending" class="form-a__sending">Отправка...</div>
      </div>
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
<style src="../styles/form-a.css"></style>