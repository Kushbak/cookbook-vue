<script setup>
  import { defineProps, defineEmits, useSlots } from 'vue'
  const slots = useSlots()
  const props = defineProps(['onClick', 'class', 'disabled', 'type', 'btnType'])
  const emit = defineEmits(['click'])
  const btnTypeClass = 'button_' + (props.btnType || 'default')

  const handleClick = () => {
    emit('click')
  }
</script>

<template>
  <button
    @click.stop="handleClick"
    :class="['button', btnTypeClass, props.class]"
    :disabled="props.disabled"
    :type="props.type || 'button'"
  >
    <slot></slot>
    <span v-if="slots.icon" class="button__icon">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<style lang="scss" scoped>
  .button {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 24px;
    border-radius: 12px;
    color: var(--color-white);
    border: none;
    font-size: 16px;
    &__icon {
      margin: 0px 4px;
    }

    &_lucid {
      background-color: transparent;
      color: var(--color-dark);
      &:hover {
        color: var(--color-grey);
      }
      &:active {
        background-color: var(--color-white-1);
        color: var(--color-dark);
      }
      &:disabled {
        color: var(--color-dark);
      }
    }

    &_default {
      background-color: var(--color-main);
      &:hover {
        background-color: var(--color-main-dark);
      }
      &:active {
        background-color: var(--color-main-darker);
      }
      &:disabled {
        background-color: var(--color-grey-light);
      }
    }

    &_light {
      background-color: var(--color-white);
      color: var(--color-main);
    }

    /* change outline color on focus while navigating by tab */
    &:focus {
      outline: 2px solid #007bff;
      outline-offset: 1px;
    }
    &:focus:not(:focus-visible) {
      outline: none;
    }
    &:focus:focus-visible {
      outline-color: var(--color-main);
    }
  }
</style>
