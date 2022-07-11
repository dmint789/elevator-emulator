<template>
  <div class="column">
    <div class="floor" v-for="floor in floors" :key="floor">
      <Transition
        @enter="onEnter"
        @after-leave="onLeave"
        :name="getAnimation(floor - 1)"
        :style="{ '--top': getTop(floor - 1) }"
      >
        <div v-if="isVisible(floor - 1)" class="elevator">
          <Display :text="getDisplayText()" :marginTop="Math.max(appHeight / 25 - floors, 5)" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from "vuex";
  import Display from "./Display.vue";
  import * as STATE from "../elevatorStates";

  export default {
    name: "ElevatorShaft",
    components: {
      Display,
    },
    props: {
      shaft: Number,
      appHeight: Number,
    },
    data() {
      return {
        displayText: "",
      };
    },
    computed: {
      elevator() {
        return this.$store.getters.elevator(this.shaft);
      },
      ...mapState(["floors"]),
    },
    methods: {
      onEnter(el, done) {
        done();
      },
      // This happens whenever a new floor is reached
      onLeave() {
        if (this.elevator.state === STATE.MOVING) {
          this.setState({ shaft: this.shaft, newState: STATE.UPDATING });
        }
        // Otherwise the state could only be WAITING, so we need to reset the state
        // back to IDLE and send the target reached signal and reset the display
        else {
          this.setState({ shaft: this.shaft, newState: STATE.IDLE });
          this.onTargetReached(this.shaft);
          this.displayText = "";
        }
      },
      isVisible(floor) {
        return (
          this.elevator.floor === floor &&
          this.elevator.state !== STATE.MOVING &&
          this.elevator.state !== STATE.WAITING
        );
      },
      getDisplayText() {
        // This is to let the display update when the target floor is changed
        // It also sets the new floor and the new state
        if (this.elevator.state === STATE.UPDATING) {
          if (this.elevator.target > this.elevator.floor) {
            // This also sets the state to MOVING
            this.changeFloor({ shaft: this.shaft, newFloor: this.elevator.floor + 1 });
            this.displayText = this.elevator.target + 1 + " /\\";
          } else if (this.elevator.target < this.elevator.floor) {
            this.changeFloor({ shaft: this.shaft, newFloor: this.elevator.floor - 1 });
            this.displayText = this.elevator.target + 1 + " \\/";
          }
          // If the floor is reached, that means we need to start waiting
          else {
            this.setState({ shaft: this.shaft, newState: STATE.WAITING });
            this.displayText = (this.elevator.target + 1).toString();
          }
        }

        return this.displayText;
      },
      getAnimation(floor) {
        if (this.elevator.state === STATE.WAITING) return "blink";
        else if (this.elevator.target > floor) return "up";
        else return "down";
      },
      getTop(floor) {
        if (this.elevator.state !== STATE.WAITING) {
          if (this.elevator.target > floor) {
            return -Math.round(this.appHeight / this.floors) + "px";
          } else return Math.round(this.appHeight / this.floors) + "px";
        }
      },
      ...mapMutations(["setState"]),
      ...mapActions(["onTargetReached", "changeFloor"]),
    },
  };
</script>

<style>
  .elevator {
    position: absolute;
    display: flex;
    justify-content: center;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    background-color: cyan;
  }
  .up-leave-active,
  .down-leave-active {
    transition: top 1s linear;
  }
  .up-leave-to,
  .down-leave-to {
    top: var(--top);
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
  .blink-leave-active {
    animation: blink 3s ease-in-out;
  }
</style>
