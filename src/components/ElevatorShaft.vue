<template>
  <div class="shaft">
    <div class="floor" v-for="floor in floors" :key="floor">
      <transition
        @enter="onEnter(floor - 1)"
        @after-leave="state = 'idle'"
        :name="getAnimation(floor - 1)"
      >
        <div
          v-if="
            currentFloor === floor - 1 &&
            state !== 'moving' &&
            state !== 'waiting'
          "
          class="elevator"
        >
          <div class="display">{{ getDisplayFloor() }}</div>
        </div>
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
      // States: idle, moving, waiting, updating-display, updating-display-before-waiting
      return {
        state: "idle",
        currentFloor: 0,
        targetFloor: undefined,
        displayText: "",
      };
    },
    emits: ["target-reached", "reset-location"],
    watch: {
      // This updates the state when a new target floor is passed or one of the targets is reached
      queue(newQueue) {
        if (newQueue[0] !== this.targetFloor) {
          this.targetFloor = newQueue[0];

          if (this.state === "idle") this.state = "updating-display";
        }
      },
    },
    methods: {
      onEnter(floor) {
        if (this.currentFloor === this.targetFloor) {
          this.state = "updating-display-before-waiting";
        } else {
          this.state = "updating-display";
        }
      },
      updateFloor() {
        this.$emit("reset-location");
        this.displayText = "";

        if (this.targetFloor > this.currentFloor) {
          this.currentFloor = this.currentFloor + 1;
          this.state = "moving";
          this.displayText = (this.targetFloor + 1).toString() + " /\\";
        } else if (this.targetFloor < this.currentFloor) {
          this.currentFloor = this.currentFloor - 1;
          this.state = "moving";
          this.displayText = (this.targetFloor + 1).toString() + " \\/";
        }
      },
      getAnimation(floor) {
        if (this.state === "waiting") return "blink";
        else if (this.targetFloor > floor) return "up";
        else if (this.targetFloor < floor) return "down";
      },
      getDisplayFloor() {
        // This is to let the display update when the target floor is changed
        if (this.state === "updating-display") {
          this.updateFloor();
        }
        // This is to let the display update after reaching the target floor
        else if (this.state === "updating-display-before-waiting") {
          this.displayText = (this.targetFloor + 1).toString();
          this.$emit("target-reached", this.targetFloor);
          this.state = "waiting";
        }

        return this.displayText;
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
    display: flex;
    justify-content: center;
    left: 0px;
    top: 0px;
    background-color: cyan;
    min-width: 80px;
    height: 100%;
  }
  .display {
    margin-top: 10px;
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

  @keyframes blink {
    0%,
    33%,
    67%,
    100% {
      opacity: 1;
    }
    16%,
    50%,
    84% {
      opacity: 0.25;
    }
  }
  /* .blink-enter-active, */
  .blink-leave-active {
    animation: blink 3s ease-in-out;
  }
</style>
