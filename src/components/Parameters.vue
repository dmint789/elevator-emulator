<template>
  <div class="parameters">
    <button class="button" @click="changeFloors(-1)" :disabled="floors <= 2">-</button>
    <p class="text" style="width: 65px">{{ floors }} floors</p>
    <button
      class="button"
      style="margin-right: 10px"
      @click="changeFloors(1)"
      :disabled="floors >= 10"
    >
      +
    </button>
    <button class="button" @click="changeShafts(-1)" :disabled="shafts <= 1">-</button>
    <p class="text" style="width: 65px">{{ shafts + (shafts > 1 ? " shafts" : " shaft") }}</p>
    <button class="button" @click="changeShafts(1)" :disabled="shafts >= 7">+</button>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex";

  export default {
    name: "Parameters",
    computed: {
      ...mapState(["floors", "shafts"]),
    },
    methods: {
      ...mapActions(["changeFloors", "changeShafts"]),
    },
  };
</script>

<style scoped>
  .parameters {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 30px;
    padding-left: 20px;
  }
</style>
