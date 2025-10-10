<script lang="ts" setup>
import { reactive, computed, ref, watch, onMounted } from 'vue'
import { postFormB } from '../lib/api'
import { useFormStore } from '../stores/formStore'
import type { FormBData } from '../types/forms'

const store = useFormStore()
const data = reactive<FormBData>({
  name: store.formBData.name || '',
  surname: store.formBData.surname || '',
  patronymic: (store.formBData as any).patronymic || '',
  dob: store.formBData.dob || '',
  login: store.formBData.login || '',
  email: store.formBData.email || '',
  _id: ''
})
const errors = reactive<{ [k: string]: string | null }>({ name: null, surname: null, dob: null, login: null, email: null })
type FieldB = 'name' | 'surname' | 'dob' | 'login' | 'email'
const touched = reactive<Record<FieldB, boolean>>({ name: false, surname: false, dob: false, login: false, email: false })
const sending = ref(false)
const serverError = ref('')

watch(data, (v) => {
  store.setFormBData({ ...v })
}, { deep: true })
const submitted = ref(false)
const triedSubmit = ref(false)

function validateName() {
  if (!data.name.trim()) {
    errors.name = 'Имя обязательно'
    return
  }
  const re = /^[A-Za-zА-Яа-яЁё\s-]+$/
  errors.name = re.test(data.name)
    ? null
    : 'Недопустимый символ!'
}

function validateSurname() {
  if (!data.surname.trim()) {
    errors.surname = 'Фамилия обязательна'
    return
  }
  const re = /^[A-Za-zА-Яа-яЁё\s-]+$/
  errors.surname = re.test(data.surname)
    ? null
    : 'Недопустимый символ!'
}
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
  if (!data.login) {
    errors.login = 'Логин обязателен'
    return
  }
  if (data.login.length < 6) {
    errors.login = 'Минимум 6 символов'
    return
  }
  if (!/^[A-Za-z0-9]+$/.test(data.login)) {
    errors.login = 'Только латиница и цифры'
    return
  }
  errors.login = null
}
function validateEmail() {
  if (!data.email) {
    errors.email = null
    return
  }
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
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

function onDobInput(e: Event) {
  const target = e.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '').slice(0, 8)
  const d = digits.slice(0, 2)
  const m = digits.slice(2, 4)
  const y = digits.slice(4, 8)
  let result = ''
  if (d) result += d
  if (m) result += (result ? '.' : '') + m
  if (y) result += (result ? '.' : '') + y
  data.dob = result
}

onMounted(() => {
  submitted.value = store.submittedB
})

async function onSubmit() {
  serverError.value = ''
  triedSubmit.value = true
  if (!isValid.value) return
  sending.value = true
  try {
    const res = await postFormB({ ...data })
    if ((res as any).requestId) {
      store.setResult('b', (res as any).requestId, (res as any).classifier)
      submitted.value = true
    } else {
      serverError.value = (res as any).error || 'Неизвестная ошибка'
    }
  } catch (e) {
    serverError.value = String(e)
  } finally {
    sending.value = false
  }
}

function markTouched(field: FieldB) {
  touched[field] = true
}
</script>

<template>
  <div class="form">
    <h2 class="form__title">Форма B</h2>
    <form class="form__form" @submit.prevent="onSubmit">
      <label class="form__label"><span class="form__label-text">Имя*</span>
        <input class="form__input" v-model="data.name" @blur="markTouched('name')" />
        <div v-if="(touched.name || triedSubmit) && errors.name" class="form__error">{{ errors.name }}</div>
      </label>

      <label class="form__label"><span class="form__label-text">Фамилия*</span>
        <input class="form__input" v-model="data.surname" @blur="markTouched('surname')" />
        <div v-if="(touched.surname || triedSubmit) && errors.surname" class="form__error">{{ errors.surname }}</div>
      </label>

      <label class="form__label">Отчество
        <input class="form__input" v-model="data.patronymic" />
      </label>

      <label class="form__label"><span class="form__label-text">Дата рождения*</span>
        <input class="form__input" v-model="data.dob" placeholder="DD.MM.YYYY" @input="onDobInput" @blur="markTouched('dob')" inputmode="numeric" />
        <div v-if="(touched.dob || triedSubmit) && errors.dob" class="form__error">{{ errors.dob }}</div>
      </label>

      <label class="form__label"><span class="form__label-text">Логин*</span>
        <input class="form__input" v-model="data.login" @blur="markTouched('login')" />
        <div v-if="(touched.login || triedSubmit) && errors.login" class="form__error">{{ errors.login }}</div>
      </label>

      <label class="form__label"><span class="form__label-text">Email*</span>
        <input class="form__input" v-model="data.email" @blur="markTouched('email')" />
        <div v-if="(touched.email || triedSubmit) && errors.email" class="form__error">{{ errors.email }}</div>
      </label>

      <div class="form__actions">
        <div class="form__actions-left">
          <button
            v-if="!submitted"
            class="form__submit"
            :disabled="!isValid || sending"
          >Отправить</button>
          <button
            v-else
            type="button"
            class="form__submit"
            :disabled="!isValid || sending"
            @click="onSubmit"
          >Отправить снова</button>
        </div>
        <div class="form__actions-right">
          <router-link class="form-link-button" to="/form/a">← К форме А</router-link>
        </div>
      </div>
      <div v-if="serverError" class="form__error">{{ serverError }}</div>
      <div v-if="sending" class="form__sending">Отправка...</div>
      <div v-if="submitted">
        <router-link class="form-link-button" to="/result">Перейти к результату</router-link>
        <div class="form__success">Успешно отправлено.</div>
      </div>
    </form>
  </div>
 </template>

<style src="../styles/forms.css"></style>