<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">Papyr</h1>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  flex-shrink: 0;
}

.app-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.app-main {
  flex: 1;
  overflow: hidden;
}
</style>
