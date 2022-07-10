<template>
  <div class="controls">
    <div class="floor" v-for="floor in floors" :key="floor">
      <button
        class="button"
        :style="{ backgroundColor: isInQueue(floor - 1) ? 'orange' : 'blue' }"
        @click="onFloorSelect(floor - 1)"
      >
        {{ floor }}
      </button>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

  export default {
    name: "ElevatorControls",
    computed: {
      ...mapState(["floors"]),
      ...mapGetters(["isInQueue", "closestElevator", "isValidFloor"]),
    },
    methods: {
      onFloorSelect(floor) {
        // Make sure the selected floor isn't already in the queue or has an elevator there
        if (this.isValidFloor(floor)) {
          this.addQueueItem(floor);

          let closestElevatorId = this.closestElevator(floor);

          if (closestElevatorId !== null) {
            this.changeTarget({ shaft: closestElevatorId, newFloor: floor });
          }
        }
      },
      ...mapMutations(["addQueueItem"]),
      ...mapActions(["changeTarget"]),
    },
  };
</script>

<style scoped>
  .controls {
    flex-grow: 1;
    display: flex;
    flex-direction: column-reverse;
    height: 500px;
  }
  .floor {
    flex-grow: 1;
    display: flex;
    align-items: center;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    padding-left: 20px;
  }
  .button {
    margin-left: 10px;
    height: 22px;
    color: white;
  }
</style>
