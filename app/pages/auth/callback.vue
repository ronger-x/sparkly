<script setup lang="ts">
// 获取 query 参数
const route = useRoute()
const { token, refreshToken } = route.query

const { signIn } = useAuth()
signIn({ token, refreshToken })
</script>

<template>
  <div>
    <h1>Callback</h1>
  </div>
</template>

<style scoped>

</style>
