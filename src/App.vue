<template>
  <div class="container" :style="{ '--app-height': appHeight + 'px' }">
    <div class="app">
      <ElevatorShaft
        v-for="shaft in shafts"
        :key="shaft * floors * shafts"
        :shaft="shaft - 1"
        :appHeight="appHeight"
      />
      <ElevatorControls />
    </div>
    <Parameters />
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import ElevatorShaft from "./components/ElevatorShaft.vue";
  import ElevatorControls from "./components/ElevatorControls.vue";
  import Parameters from "./components/Parameters.vue";

  export default {
    name: "App",
    components: {
      ElevatorShaft,
      ElevatorControls,
      Parameters,
    },
    data() {
      return {
        appHeight: 500,
      };
    },
    computed: {
      ...mapState(["floors", "shafts"]),
    },
    beforeCreate() {
      if (localStorage.getItem("store")) this.$store.commit("reloadState");
      else this.$store.commit("resetState", false);
    },
  };
</script>

<style>
  :root {
    --border: 2px solid lightgray;
  }

  .container {
    margin: 50px 20%;
  }
  .app {
    display: flex;
  }
  .column {
    display: flex;
    flex-direction: column-reverse;
    height: var(--app-height);
    min-width: 70px;
    border-left: 2px solid gray;
  }
  .floor {
    flex-grow: 1;
    /* This is for the elevator (child style of this style) to be able to move up and down */
    position: relative;
    border-top: var(--border);
    border-bottom: var(--border);
  }
  .button {
    color: black;
    height: 30px;
    width: 30px;
  }
  .text {
    margin: 0px;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
