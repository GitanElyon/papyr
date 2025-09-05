<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header>
      <h1>Papyr</h1>
      <p>A clean markdown editor</p>
    </header>
    
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fafafa;
  color: #2c3e50;
}

header {
  text-align: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

header h1 {
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: 600;
  color: #1a202c;
}

header p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

@media (prefers-color-scheme: dark) {
  #app {
    background: #1a1a1a;
    color: #d4d4d4;
  }
  
  header {
    background: #2d2d30;
    border-bottom-color: #3e3e42;
  }
  
  header h1 {
    color: #ffffff;
  }
  
  header p {
    color: #cccccc;
  }
}
</style>
