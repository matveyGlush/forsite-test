<template>
  <div class="container">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/form/a">Форма A</router-link> |
      <router-link to="/form/b">Форма B</router-link> |
      <router-link to="/result">Result</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
.container { padding: 20px; font-family: Arial, sans-serif }
nav a { margin-right: 8px }
input { display:block; margin-bottom:10px }
.error { color: red; font-size: 0.9em }
</style>