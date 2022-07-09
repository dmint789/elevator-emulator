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
            nextFloor === floor - 1 &&
            (state === 'idle' || state === 'updating-display')
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
      // States: idle, moving, waiting, updating-display
      return {
        state: "idle",
        currentFloor: 0,
        nextFloor: 0,
        targetFloor: undefined,
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
        this.currentFloor = this.nextFloor;

        if (this.currentFloor === this.targetFloor) {
          this.$emit("target-reached", floor);
          this.state = "waiting";
        } else {
          this.updateFloor();
        }
      },
      updateFloor() {
        this.$emit("reset-location");

        if (this.targetFloor > this.currentFloor) {
          this.nextFloor = this.currentFloor + 1;
          this.state = "moving";
        } else if (this.targetFloor < this.currentFloor) {
          this.nextFloor = this.currentFloor - 1;
          this.state = "moving";
        }
      },
      getAnimation(floor) {
        if (this.state === "waiting") return "blink";
        else if (this.targetFloor > floor) return "up";
        else if (this.targetFloor < floor) return "down";
      },
      getDisplayFloor() {
        // This is to let the display update when the target floor was changed while the elevator was idle
        if (this.state === "updating-display") {
          this.updateFloor();
        }

        if (
          this.targetFloor !== undefined &&
          this.targetFloor !== this.currentFloor
        ) {
          return this.targetFloor + 1;
        } else {
          return "";
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
  .blink-enter-active,
  .blink-leave-active {
    animation: blink 3s ease-in-out;
  }
</style>
