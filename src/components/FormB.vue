<template>
  <div class="form-b">
    <h2 class="form-b__title">Форма B</h2>
    <form class="form-b__form" @submit.prevent="onSubmit">
      <label class="form-b__label">Имя*
        <input class="form-b__input" v-model="data.name" />
      </label>
      <div v-if="errors.name" class="form-b__error">{{ errors.name }}</div>

      <label class="form-b__label">Фамилия*
        <input class="form-b__input" v-model="data.surname" />
      </label>
      <div v-if="errors.surname" class="form-b__error">{{ errors.surname }}</div>

      <label class="form-b__label">Отчество
        <input class="form-b__input" v-model="data.patronymic" />
      </label>

      <label class="form-b__label">Дата рождения*
        <input class="form-b__input" v-model="data.dob" placeholder="DD.MM.YYYY" />
      </label>
      <div v-if="errors.dob" class="form-b__error">{{ errors.dob }}</div>

      <label class="form-b__label">Логин*
        <input class="form-b__input" v-model="data.login" />
      </label>
      <div v-if="errors.login" class="form-b__error">{{ errors.login }}</div>

      <label class="form-b__label">Email*
        <input class="form-b__input" v-model="data.email" />
      </label>
      <div v-if="errors.email" class="form-b__error">{{ errors.email }}</div>

      <div class="form-b__actions">
        <button class="form-b__submit" :disabled="!isValid || sending">Отправить</button>
        <div v-if="serverError" class="form-b__error">{{ serverError }}</div>
        <div v-if="sending" class="form-b__sending">Отправка...</div>
      </div>
    </form>
  </div>
 </template>

<script lang="ts" setup>
import { reactive, computed, ref, watch } from 'vue'
import { postFormB } from '../lib/api'
import { useFormStore } from '../stores/formStore'
import type { FormBData } from '../types/forms'

const data = reactive<FormBData>({ name: '', surname: '', patronymic: '', dob: '', login: '', email: '' })
const errors = reactive<{ [k: string]: string | null }>({ name: null, surname: null, dob: null, login: null, email: null })
const sending = ref(false)
const serverError = ref('')
const store = useFormStore()

function validateName() { errors.name = data.name.trim() ? null : 'Имя обязательно' }
function validateSurname() { errors.surname = data.surname.trim() ? null : 'Фамилия обязательна' }
function validateDob() {
  const re = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/
  if (!data.dob) { errors.dob = 'Дата рождения обязательна'; return }
  if (!re.test(data.dob)) { errors.dob = 'Формат DD.MM.YYYY'; return }
  const [d, m, y] = data.dob.split('.').map(Number)
  const dt = new Date(y, m - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() + 1 !== m || dt.getDate() !== d) {
    errors.dob = 'Неверная дата'
  } else {
    errors.dob = null
  }
}
function validateLogin() {
  if (!data.login) { errors.login = 'Логин обязателен'; return }
  if (data.login.length < 6) { errors.login = 'Минимум 6 символов'; return }
  if (!/^[A-Za-z0-9]+$/.test(data.login)) { errors.login = 'Только латиница и цифры'; return }
  errors.login = null
}
function validateEmail() {
  const re = /^\S+@\S+\.\S+$/
  errors.email = re.test(data.email) ? null : 'Неверный email'
}

watch(() => data.name, validateName)
watch(() => data.surname, validateSurname)
watch(() => data.dob, validateDob)
watch(() => data.login, validateLogin)
watch(() => data.email, validateEmail)

const isValid = computed(() => {
  validateName(); validateSurname(); validateDob(); validateLogin(); validateEmail();
  return !errors.name && !errors.surname && !errors.dob && !errors.login && !errors.email
})

async function onSubmit() {
  serverError.value = ''
  if (!isValid.value) return
  sending.value = true
  try {
    const res = await postFormB({ ...data })
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
<style src="../styles/form-b.css"></style>