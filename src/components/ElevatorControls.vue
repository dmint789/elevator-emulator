<template>
  <div class="column" style="width: 100%">
    <div class="floor center-child" v-for="floor in floors" :key="floor">
      <button
        class="button"
        :style="{ backgroundColor: isInQueue(floor - 1) ? 'orange' : 'lightGray' }"
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

<style>
  .center-child {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
</style>
