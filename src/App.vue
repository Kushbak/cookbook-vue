<script setup>
  import HeaderComponent from '@/components/Header/HeaderComponent'
  import AppLayout from '@/components/Layout/AppLayout.vue'
  import CategoriesComponent from '@/components/Categories/CategoriesComponent.vue'
  import ModalComponent from './components/Modals/ModalComponent.vue'
  import { getCookie } from './utils'
  import store from './store'
  import { USER_ACTIONS } from './store/actions'
  import { onMounted, ref } from 'vue'

  const isLoading = ref(true)

  onMounted(async () => {
    isLoading.value = true
    const cookie = getCookie(process.env.VUE_APP_CBAT)
    if (cookie) {
      await store.dispatch(USER_ACTIONS.GET_PROFILE)
    }
    isLoading.value = false
  })
</script>

<template>
  <AppLayout v-if="!isLoading">
    <HeaderComponent />
    <CategoriesComponent />
    <router-view />
    <ModalComponent />
  </AppLayout>
</template>

<style lang="scss"></style>
