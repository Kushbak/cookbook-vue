<script setup>
  import { computed, onMounted, ref } from 'vue'
  import store from '@/store'
  import { RECIPES_ACTIONS } from '@/store/actions'
  import { useRoute } from 'vue-router'
  import { formatCommentDate } from '@/utils'
  import { star, starEmpty } from '@/assets/img'
  import ButtonComponentVue from '@/ui/Button/ButtonComponent.vue'
  import InputComponent from '@/ui/Input/InputComponent.vue'
  import AvatarComponent from '@/ui/Avatar/AvatarComponent.vue'
  import { withAuth } from '@/utils/hofs'
  import RecipeMeta from '@/ui/RecipeMeta/RecipeMeta.vue'

  const route = useRoute()
  const recipe = computed(() => store.state.recipes.recipeDetails)
  const commentInput = ref('')

  const addComment = withAuth(async () => {
    await store.dispatch(RECIPES_ACTIONS.ADD_COMMENT_TO_RECIPE, { text: commentInput.value, recipe: recipe.value.id })
    commentInput.value = ''
  })

  onMounted(() => {
    store.dispatch(RECIPES_ACTIONS.GET_RECIPE_BY_ID, route.params.id)
  })
</script>
<!-- todo refactor layout -->
<template>
  <div v-if="recipe" class="recipe">
    <div class="recipe__category">{{ recipe.category.name }}</div>
    <div class="recipe__title">{{ recipe.name }}</div>
    <div class="recipe__author">
      <AvatarComponent :avatar="recipe.user.avatar?.file" />
      {{ recipe.user.username }}
    </div>
    <RecipeMeta :recipe="recipe" :withSave="true" />
    <iframe height="360" width="100%" :src="recipe.cooking_url" />
    <p class="recipe__description">{{ recipe.description }}</p>
    <img class="recipe__img" :src="recipe.image.file" :alt="recipe.name" />
    <div class="recipe__ingredients">
      <h4 class="recipe__subtitle">Ингредиенты: {{ recipe.ingredients_count }}</h4>
      <ul>
        <li v-for="ingredient of recipe.ingredients" :key="ingredient.id" class="recipe__ingredient">
          {{ ingredient.name }} - {{ ingredient.amount }}
        </li>
      </ul>
    </div>
    <div class="recipe__cooking">
      <h4 class="recipe__subtitle">Приготовление:</h4>
      <pre class="recipe__description"> {{ recipe.cooking_description }}</pre>
    </div>
    <div class="recipe__rating">
      <div class="recipe__rate">
        <p>Оцените рецепт, если опробовали его:</p>
        <div class="recipe__myRate">
          <!-- to rate component -->
          <img :src="starEmpty" alt="" />
          <img :src="starEmpty" alt="" />
          <img :src="starEmpty" alt="" />
          <img :src="starEmpty" alt="" />
          <img :src="starEmpty" alt="" />
          <p>Ваша оценка</p>
        </div>
      </div>
      <div class="recipe__avgRateBlock">
        <p class="recipe__avgRate">
          <img :src="star" alt="" />
          {{ recipe.avg_rating }}
        </p>
        <p>Средняя оценка</p>
        <p>Всего голосов: {{ recipe.avg_rating_count }}</p>
      </div>
    </div>
    <div class="recipe__comments">
      <h4 class="recipe__subtitle">Комментарии({{ recipe.comments_count }})</h4>
      <div class="comment" v-for="commentData of recipe.comments" :key="commentData.id">
        <div class="comment__author">
          <!-- todo split avatar to component -->
          <AvatarComponent :avatar="commentData.user.avatar?.file" />
          <div class="comment__meta">
            <p class="comment__authorName">{{ commentData.user.username }}</p>
            <p class="comment__date">{{ formatCommentDate(commentData.created_at) }}</p>
          </div>
        </div>
        <p class="comment__text">{{ commentData.text }}</p>
      </div>
      <div class="comment__inputBlock">
        <InputComponent class="comment__input" placeholder="Добавить комментарий" v-model="commentInput" />
        <ButtonComponentVue :disabled="commentInput.trim().length === 0" @click="addComment">
          Отправить
        </ButtonComponentVue>
      </div>
    </div>
  </div>
  <p v-else>Loading...</p>
</template>

<style lang="scss" scoped>
  .recipe {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    margin: 20px 0;
    color: var(--color-dark);
    &__category {
      color: var(--color-main);
      font-size: 18px;
    }
    &__title {
      font-size: 32px;
      margin-top: 4px;
      margin-bottom: 8px;
    }
    &__subtitle {
      font-size: 20px;
      margin-bottom: 16px;
    }
    &__author {
      width: 100%;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    &__description {
      font-size: 16px;
      margin: 32px 0;
      white-space: pre-wrap;
      font-family: inherit;
      line-height: 24px;
    }
    &__img {
      width: 100%;
      object-fit: cover;
      height: 380px;
      border-radius: 12px;
    }
    &__ingredients {
      width: 100%;
    }
    &__ingredient {
      margin-bottom: 8px;
      padding: 4px 0;
      font-size: 16px;
    }
    &__rating {
      padding: 32px 0;
      border-top: 1px solid var(--color-white-2);
      border-bottom: 1px solid var(--color-white-2);
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__myRate {
      display: flex;
      align-items: center;
      margin-top: 8px;
      gap: 4px;
    }
    &__avgRateBlock {
      text-align: right;
      font-size: 14px;
    }
    &__avgRate {
      font-size: 32px;
      font-weight: bold;
    }
    &__comments {
      width: 100%;
      margin-bottom: 120px;
    }
  }

  .comment {
    margin-bottom: 12px;
    &__author {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 4px;
    }
    &__authorName {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    &__date {
      font-size: 14px;
      color: var(--color-grey);
    }
    &__inputBlock {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-top: 36px;
    }
    &__input {
      margin-bottom: 0;
      width: 100%;
    }
  }
</style>
