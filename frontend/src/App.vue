<script lang="ts" setup>
</script>

<template>
  <div class="container">
    <nav>
      <router-link to="/">Главная</router-link> |
      <router-link to="/form/a">Форма A</router-link> |
      <router-link to="/form/b">Форма B</router-link> |
      <router-link to="/result">Результаты</router-link> |
      <router-link to="/db">База данных</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style src="./styles/theme.css"></style>