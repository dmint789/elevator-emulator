<template>
  <div class="display" :style="{ 'margin-top': marginTop + 'px' }" v-if="text">
    <p class="text">{{ text }}</p>
  </div>
</template>

<script>
  export default {
    name: "Display",
    props: {
      text: String,
      marginTop: Number,
    },
  };
</script>

<style>
  .display {
    height: 20px;
    width: 40px;
    padding-top: 3px;
    text-align: center;
    border-radius: 3px;
    background-color: #bbb;
    opacity: 0.8;
  }
</style>
