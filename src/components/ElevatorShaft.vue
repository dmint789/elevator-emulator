<template>
  <div class="shaft">
    <div class="floor" v-for="floor in floors" :key="floor">
      <transition
        @enter="onFloorChanged"
        @after-leave="animating = false"
        :name="targetFloor > floor ? 'up' : 'down'"
      >
        <div v-if="currentFloor === floor && !animating" class="elevator"></div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ElevatorShaft",
    props: {
      floors: Number,
      queue: Array,
    },
    data() {
      return {
        animating: false,
        currentFloor: 1,
        targetFloor: 1,
      };
    },
    emits: ["floor-reached"],
    watch: {
      queue(newQueue) {
        if (newQueue[0] !== this.targetFloor) this.onTargetChanged(newQueue[0]);
      },
    },
    methods: {
      onFloorChanged() {
        if (this.targetFloor > this.currentFloor) {
          this.currentFloor = this.currentFloor + 1;
          this.animating = true;
        } else if (this.targetFloor < this.currentFloor) {
          this.currentFloor = this.currentFloor - 1;
          this.animating = true;
        } else {
          this.$emit("floor-reached");
        }
      },
      onTargetChanged(floor) {
        this.targetFloor = floor;

        if (this.targetFloor > this.currentFloor) {
          this.currentFloor = this.currentFloor + 1;
          this.animating = true;
        } else if (this.targetFloor < this.currentFloor) {
          this.currentFloor = this.currentFloor - 1;
          this.animating = true;
        }
      },
    },
  };
</script>

<style scoped>
  .shaft {
    display: flex;
    flex-direction: column-reverse;
    min-width: 80px;
    height: 400px;
    border-left: 2px solid gray;
    border-right: 2px solid gray;
  }
  .floor {
    flex-grow: 1;
    position: relative;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
  }
  .elevator {
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: cyan;
    min-width: 80px;
    height: 100%;
  }

  .up-leave-active,
  .down-leave-active {
    transition: top 1s linear;
  }
  .up-leave-to {
    top: -80px;
  }
  .down-leave-to {
    top: 80px;
  }
</style>
