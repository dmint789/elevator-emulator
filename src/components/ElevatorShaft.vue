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
  // || (currentFloor === floor && animating)
  export default {
    name: "ElevatorShaft",
    props: {
      floors: Number,
      queue: Array,
    },
    data() {
      return {
        animating: false,
        currentFloor: this.queue[0],
        targetFloor: this.queue[0],
      };
    },
    watch: {
      queue(newQueue) {
        this.targetFloor = newQueue[0];

        if (this.targetFloor > this.currentFloor) {
          this.currentFloor = this.currentFloor + 1;
          this.animating = true;
        } else if (this.targetFloor < this.currentFloor) {
          this.currentFloor = this.currentFloor - 1;
          this.animating = true;
        }
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

  .up-leave-active {
    transition: top 1s linear;
  }
  .up-leave-to {
    top: -80px;
  }
  .down-leave-active {
    transition: top 1s linear;
  }
  .down-leave-to {
    top: 80px;
  }
</style>
