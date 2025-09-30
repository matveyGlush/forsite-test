<script lang="ts" setup>
import { reactive, computed, ref, watch, onMounted } from 'vue'
import { postFormA } from '../lib/api'
import { useFormStore } from '../stores/formStore'
import type { FormAData } from '../types/forms'

const store = useFormStore()
const data = reactive<FormAData>({
  name: store.formAData.name || '',
  email: store.formAData.email || '',
  inn: store.formAData.inn || '',
  phone: store.formAData.phone || ''
})
const errors = reactive<{ [k: string]: string | null }>({ name: null, email: null, inn: null, phone: null })
type FieldA = 'name' | 'email' | 'inn' | 'phone'
const touched = reactive<Record<FieldA, boolean>>({ name: false, email: false, inn: false, phone: false })
const sending = ref(false)
const serverError = ref('')

watch(data, (v) => {
  store.setFormAData({ ...v })
}, { deep: true })
const submitted = ref(false)
const triedSubmit = ref(false)

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
  errors.phone = re.test(data.phone) ? null : 'Телефон обязателен'
}

watch(() => data.name, validateName)
watch(() => data.email, validateEmail)
watch(() => data.inn, validateINN)
watch(() => data.phone, validatePhone)

const isValid = computed(() => {
  validateName(); 
  validateEmail(); 
  validateINN(); 
  validatePhone();
  return !errors.name && !errors.email && !errors.inn && !errors.phone
})

function onInnInput(e: Event) {
  const target = e.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '').slice(0, 12)
  data.inn = digits
}

function onPhoneFocus() {
  if (!data.phone) {
    data.phone = '+7 '
  }
}

function formatPhoneFromDigits(digits: string): string {
  const d = digits.replace(/\D/g, '')
  const withoutCountry = d.startsWith('7') ? d.slice(1) : d
  const p1 = withoutCountry.slice(0, 3)
  const p2 = withoutCountry.slice(3, 6)
  const p3 = withoutCountry.slice(6, 8)
  const p4 = withoutCountry.slice(8, 10)
  let result = '+7'
  if (p1) result += ` (${p1}`
  if (p1 && p1.length === 3) result += ')'
  if (p2) result += ` ${p2}`
  if (p3) result += `-${p3}`
  if (p4) result += `-${p4}`
  return result
}

function onPhoneInput(e: Event) {
  const target = e.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '').slice(0, 11)
  data.phone = formatPhoneFromDigits(digits)
}

function markTouched(field: FieldA) {
  touched[field] = true
}

onMounted(() => {
  submitted.value = store.submittedA
})

async function onSubmit() {
  serverError.value = ''
  triedSubmit.value = true
  if (!isValid.value) return
  sending.value = true
  try {
    const res = await postFormA({ ...data })
    if ((res as any).requestId) {
      store.setResult('a', (res as any).requestId, (res as any).classifier)
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
</script>

<template>
  <div class="form">
    <h2 class="form__title">Форма A</h2>
    <form class="form__form" @submit.prevent="onSubmit">
      <label class="form__label"><span class="form__label-text">Имя*</span>
        <input class="form__input" v-model="data.name" @blur="markTouched('name')" />
        <div v-if="(touched.name || triedSubmit) && errors.name" class="form__error">{{ errors.name }}</div>
      </label>

      <label class="form__label"><span class="form__label-text">Email</span>
        <input class="form__input" v-model="data.email" @blur="markTouched('email')" />
        <div v-if="(touched.email || triedSubmit) && errors.email" class="form__error">{{ errors.email }}</div>
      </label>

      <label class="form__label"><span class="form__label-text">ИНН*</span>
        <input class="form__input" v-model="data.inn" @input="onInnInput" @blur="markTouched('inn')" inputmode="numeric" />
        <div v-if="(touched.inn || triedSubmit) && errors.inn" class="form__error">{{ errors.inn }}</div>
      </label>

      <label class="form__label"><span class="form__label-text">Телефон*</span>
        <input class="form__input" v-model="data.phone" placeholder="+7 (XXX) XXX-XX-XX" @focus="onPhoneFocus" @input="onPhoneInput" @blur="markTouched('phone')" inputmode="tel" />
        <div v-if="(touched.phone || triedSubmit) && errors.phone" class="form__error">{{ errors.phone }}</div>
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
          <router-link class="form-link-button" to="/form/b">К форме B →</router-link>
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