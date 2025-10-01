<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getAllData, GetAllSuccess } from '../lib/api';

const data = ref<GetAllSuccess[] | null>(null);
const serverError = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await getAllData();
    if ("error" in res) {
      serverError.value = res.error || "Неизвестная ошибка";
    } else {
      data.value = res;
    }
  } catch (e) {
    serverError.value = "Ошибка запроса к серверу";
  }
});
</script>

<template>
  <div class="result-page">
    <h2 class="result-page__title">База данных</h2>

    <section class="result-block">
      <div v-if="serverError">{{ serverError }}</div>
      <ul v-else-if="data">
        <li v-for="item in data" :key="item.data._id">
          <span>
            {{ item.type }}: {{ item.data }}
          </span>
        </li>
      </ul>
      <div v-else>Загрузка...</div>
    </section>
  </div>
</template>

<style src="../styles/result.css"></style>