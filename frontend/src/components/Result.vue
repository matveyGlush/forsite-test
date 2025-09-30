<script lang="ts" setup>
import { useFormStore } from '../stores/formStore'
import { computed } from 'vue'

const store = useFormStore()
const requestIdA = computed(() => store.requestIdA)
const classifierA = computed(() => store.classifierA)
const hasResultA = computed(() => !!store.requestIdA && !!store.classifierA)

const requestIdB = computed(() => store.requestIdB)
const classifierB = computed(() => store.classifierB)
const hasResultB = computed(() => !!store.requestIdB && !!store.classifierB)
</script>

<template>
  <div class="result-page">
    <h2 class="result-page__title">Результат отправки</h2>
    <section class="result-block">
      <h3 class="result-page__subtitle">Форма A</h3>
      <div v-if="hasResultA">
        <p class="result-page__item"><strong>requestId:</strong> {{ requestIdA }}</p>
        <p class="result-page__item"><strong>classifier:</strong> {{ classifierA }}</p>
      </div>
      <div v-else>
        <p class="result-page__empty">Результатов по форме A нет.</p>
      </div>
    </section>
    <section class="result-block">
      <h3 class="result-page__subtitle">Форма B</h3>
      <div v-if="hasResultB">
        <p class="result-page__item"><strong>requestId:</strong> {{ requestIdB }}</p>
        <p class="result-page__item"><strong>classifier:</strong> {{ classifierB }}</p>
      </div>
      <div v-else>
        <p class="result-page__empty">Результатов по форме B нет.</p>
      </div>
    </section>
  </div>
</template>

<style src="../styles/result.css"></style>
