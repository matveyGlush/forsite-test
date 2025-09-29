<template>
  <div>
    <h2>Результат отправки</h2>
    <div v-if="hasResult">
      <p><strong>requestId:</strong> {{ requestId }}</p>
      <p><strong>classifier:</strong> {{ classifier }}</p>
    </div>
    <div v-else>
      <p>Результатов нет.</p>
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