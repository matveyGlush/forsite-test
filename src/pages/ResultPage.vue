<template>
  <div class="result-page">
    <h2 class="result-page__title">Результат отправки</h2>
    <div v-if="hasResult">
      <p class="result-page__item"><strong>requestId:</strong> {{ requestId }}</p>
      <p class="result-page__item"><strong>classifier:</strong> {{ classifier }}</p>
    </div>
    <div v-else>
      <p class="result-page__empty">Результатов нет.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFormStore } from '../stores/formStore'
import { computed } from 'vue'

const store = useFormStore()
const requestId = computed(() => store.requestId)
const classifier = computed(() => store.classifier)
const hasResult = computed(() => !!store.requestId && !!store.classifier)
</script>

<style src="../styles/result-page.css"></style>