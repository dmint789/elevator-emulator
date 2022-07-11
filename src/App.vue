<template>
  <div class="container">
    <div class="app">
      <ElevatorShaft v-for="shaft in shafts" :key="shaft * floors * shafts" :shaft="shaft - 1" />
      <ElevatorControls />
    </div>
    <div class="parameters">
      <button class="button" @click="changeFloors(-1)" :disabled="floors <= 2">-</button>
      <p class="text">{{ floors }} floors</p>
      <button
        class="button"
        style="margin-right: 10px"
        @click="changeFloors(1)"
        :disabled="floors >= 10"
      >
        +
      </button>
      <button class="button" @click="changeShafts(-1)" :disabled="shafts <= 1">-</button>
      <p class="text">{{ shafts + (shafts > 1 ? " shafts" : " shaft") }}</p>
      <button class="button" @click="changeShafts(1)" :disabled="shafts >= 5">+</button>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import ElevatorShaft from "./components/ElevatorShaft.vue";
  import ElevatorControls from "./components/ElevatorControls.vue";

  export default {
    name: "App",
    components: {
      ElevatorShaft,
      ElevatorControls,
    },
    computed: {
      ...mapState(["floors", "shafts"]),
    },
    methods: {
      ...mapActions(["changeFloors", "changeShafts"]),
    },
    beforeCreate() {
      if (localStorage.getItem("store")) this.$store.commit("reloadState");
      else this.$store.commit("resetState", false);
    },
  };
</script>

<style scoped>
  .container {
    margin: 50px 20%;
  }
  .app {
    display: flex;
    border-top: 2px solid lightgray;
    border-bottom: 2px solid lightgray;
  }
  .parameters {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    padding-top: 30px;
    padding-left: 20px;
  }
  .button {
    color: black;
    height: 30px;
    width: 30px;
  }
  .text {
    font-family: Arial, Helvetica, sans-serif;
    width: 65px;
  }
</style>
