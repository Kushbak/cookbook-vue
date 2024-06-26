import axios from 'axios'
import store from '@/store'
import { getCookie } from '@/utils'
import { USER_ACTIONS } from '@/store/actions'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const accessToken = getCookie(process.env.VUE_APP_CBAT)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

instance.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config
    const refresh = getCookie(process.env.VUE_APP_CBRT)
    if (error.response.status === 401 && !originalRequest._retry && refresh) {
      originalRequest._retry = true
      await store.dispatch(USER_ACTIONS.REFRESH_TOKEN, { refresh })
      instance(originalRequest)
    } else if (!refresh) {
      store.dispatch('logout')
    } else {
      return Promise.reject(error)
    }
  },
)

export const recipesApi = {
  getMyBookmarks: async (params) => instance.get('recipe/bookmarks/', { params }),
  getAllCategories: async (params) => instance.get('recipe/categories/', { params }),
  getAllRecipes: async (params) => instance.get('recipe/feed/', { params }),
  getRecipeById: async (recipeId) => instance.get(`recipe/${recipeId}/`),
  createRecipe: async (data) => instance.post('recipe/', data),
  addBookmark: async (data) => instance.post('recipe/bookmarks/', data),
  addComment: async (data) => instance.post('recipe/comments', data),
  addRate: async (data) => instance.post('recipe/rates', data),
  changeRecipe: async (recipeId, data) => instance.put(`recipe/${recipeId}/`, data),
  deleteRecipe: async (recipeId) => instance.delete(`recipe/${recipeId}`),
  postRecipeImage: async (data) =>
    instance.post('common/image/', data, { headers: { 'Content-Type': 'multipart/formdata' } }),
}

export const usersApi = {
  login: async (data) => instance.post('users/login/', data),
  register: async (data) => instance.post('users/register/', data),
  refresh: async (data) => instance.post('users/login/refresh/', data),
  getUserById: async (userId) => instance.get(`users/${userId}/`),
}
