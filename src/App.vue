<template>
  <div class="container">
    <ElevatorShaft
      @reset-location="elevatorLocations[shaft - 1] = undefined"
      @target-reached="floor => onTargetReached(floor, shaft - 1)"
      :floors="floors"
      :queue="queue"
      v-for="shaft in shafts"
      :key="shaft"
    />
    <ElevatorControls
      @floor-selected="onFloorSelect"
      :floors="floors"
      :queue="queue"
    />
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
        shafts: 1,
        elevatorLocations: [],
        floors: 5,
      };
    },
    created() {
      // Initialize all elevator locations to the first (0th) floor
      this.elevatorLocations = Array(this.shafts).fill(0);
    },
    methods: {
      onFloorSelect(floor) {
        // Make sure the selected floor isn't already in the queue or has an elevator there
        if (
          !this.queue.find(item => item === floor) &&
          !this.elevatorLocations.find(item => item === floor)
        ) {
          this.queue = [...this.queue, floor];
        }
      },
      onTargetReached(floor, shaft) {
        this.queue = this.queue.slice(1);
        this.elevatorLocations[shaft] = floor;
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
