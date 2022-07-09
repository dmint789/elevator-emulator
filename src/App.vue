<template>
  <div class="container">
    <ElevatorShaft
      @floor-reached="onFloorReached"
      :floors="5"
      :queue="queue"
      v-for="shaft in 1"
      :key="shaft"
    />
    <ElevatorControls @floor-selected="onFloorSelect" :floors="5" />
  </div>
</template>

<script>
  import ElevatorShaft from "./components/ElevatorShaft.vue";
  import ElevatorControls from "./components/ElevatorControls.vue";

  export default {
    name: "App",
    components: {
      ElevatorShaft,
      ElevatorControls,
    },
    data() {
      return {
        queue: [],
      };
    },
    methods: {
      onFloorSelect(floor) {
        if (!this.queue.find(item => item === floor))
          this.queue = [...this.queue, floor];
        console.log(this.queue);
      },
      onFloorReached() {
        this.queue = this.queue.slice(1);
        console.log(this.queue);
      },
    },
  };
</script>

<style>
  .container {
    display: flex;
    flex-direction: row;
    margin: 50px 25%;
    border-top: 2px solid lightgray;
    border-bottom: 2px solid lightgray;
  }
</style>
