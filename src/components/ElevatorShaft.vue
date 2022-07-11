<template>
  <div class="shaft">
    <div class="floor" v-for="floor in floors" :key="floor">
      <Transition
        @enter="onEnter"
        @after-leave="onLeave"
        :name="getAnimation(floor - 1)"
        :style="{ '--top': getHeight(floor - 1) }"
      >
        <div v-if="isVisible(floor - 1)" class="elevator">
          <div class="display" :style="{ '--display-margin': (15 - floors).toString() + 'px' }">
            <p class="text">{{ getDisplayText() }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from "vuex";
  import * as STATE from "../elevatorStates";

  export default {
    name: "ElevatorShaft",
    props: {
      shaft: Number,
    },
    data() {
      return { displayText: "" };
    },
    computed: {
      elevator() {
        return this.$store.getters.elevator(this.shaft);
      },
      currentFloor() {
        return this.elevator.floor;
      },
      targetFloor() {
        return this.elevator.target;
      },
      state() {
        return this.elevator.state;
      },
      ...mapState(["floors"]),
    },
    methods: {
      onEnter(el, done) {
        done();
      },
      // This happens whenever a new floor is reached
      onLeave() {
        if (this.state === STATE.MOVING) {
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
          this.currentFloor === floor && this.state !== STATE.MOVING && this.state !== STATE.WAITING
        );
      },
      getDisplayText() {
        // This is to let the display update when the target floor is changed
        // It also sets the new floor and the new state
        if (this.state === STATE.UPDATING) {
          if (this.targetFloor > this.currentFloor) {
            // This also sets the state to MOVING
            this.changeFloor({ shaft: this.shaft, newFloor: this.currentFloor + 1 });
            this.displayText = this.targetFloor + 1 + " /\\";
          } else if (this.targetFloor < this.currentFloor) {
            this.changeFloor({ shaft: this.shaft, newFloor: this.currentFloor - 1 });
            this.displayText = this.targetFloor + 1 + " \\/";
          }
          // If the floor is reached, that means we need to start waiting
          else {
            this.setState({ shaft: this.shaft, newState: STATE.WAITING });
            this.displayText = (this.targetFloor + 1).toString();
          }
        }

        return this.displayText;
      },
      getAnimation(floor) {
        if (this.state === STATE.WAITING) return "blink";
        else if (this.targetFloor > floor) return "up";
        else return "down";
      },
      getHeight(floor) {
        if (this.state !== STATE.WAITING) {
          if (this.targetFloor > floor) {
            return -Math.round(500 / this.floors) + "px";
          } else return Math.round(500 / this.floors) + "px";
        }
      },
      ...mapMutations(["setState"]),
      ...mapActions(["onTargetReached", "changeFloor"]),
    },
  };
</script>

<style scoped>
  .shaft {
    display: flex;
    flex-direction: column-reverse;
    min-width: 70px;
    height: 500px;
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
    min-width: 70px;
    height: 100%;
  }
  .display {
    margin-top: var(--display-margin);
  }
  .text {
    margin: 0px;
    font-family: Arial, Helvetica, sans-serif;
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
    animation: blink 2s ease-in-out;
  }
</style>
