import { createStore } from "vuex";
import * as STATE from "../elevatorStates";

export default createStore({
  state: {
    floors: 5,
    shafts: 1,
    queue: [],
    elevators: [],
  },
  getters: {
    elevator: state => shaft => state.elevators[shaft],
    // Returns the shaft of the closest idle elevator to the given floor
    closestElevator: state => floor => {
      let closestElevator = { shaft: null, distance: 10 };

      for (let i = 0; i < state.shafts; i++) {
        if (
          state.elevators[i].state === STATE.IDLE &&
          (Math.abs(floor - state.elevators[i].floor) < closestElevator.distance ||
            closestElevator.shaft === null)
        ) {
          closestElevator.shaft = i;
          closestElevator.distance = Math.abs(floor - state.elevators[i].floor);
        }
      }

      return closestElevator.shaft;
    },
    isValidFloor: state => floor => {
      return (
        !state.queue.find(item => item === floor) &&
        !state.elevators.find(
          item =>
            (item.floor === floor && (item.state === STATE.IDLE || item.state === STATE.WAITING)) || item.target === floor
        )
      );
    },
    // Returns true if given floor is in queue or targeted by any elevator
    isInQueue: state => floor => {
      return (
        state.queue.find(item => item === floor) !== undefined ||
        state.elevators.find(item => item.target === floor && item.state !== STATE.IDLE)
      );
    },
  },
  mutations: {
    resetState: (state, fromUser = true) => {
      // Initialize all elevators and the queue
      state.queue = [];
      state.elevators = [];

      for (let i = 0; i < state.shafts; i++) {
        state.elevators.push({
          floor: 0,
          target: undefined,
          state: STATE.IDLE,
          shaft: i,
        });
      }

      localStorage.setItem("store", JSON.stringify(state));
    },
    reloadState: state => {
      let tempState = JSON.parse(localStorage.getItem("store"));

      for (let i = 0; i < tempState.shafts; i++) {
        if (
          tempState.elevators[i].state === STATE.MOVING ||
          tempState.elevators[i].state === STATE.WAITING
        )
          tempState.elevators[i].state = STATE.UPDATING;
      }

      Object.assign(state, tempState);
    },
    setFloors: (state, floors) => {
      state.floors = floors;
      localStorage.setItem("store", JSON.stringify(state));
    },
    setShafts: (state, shafts) => {
      state.shafts = shafts;
      localStorage.setItem("store", JSON.stringify(state));
    },
    setFloor: (state, { shaft, newFloor }) => {
      state.elevators[shaft].floor = newFloor;
      localStorage.setItem("store", JSON.stringify(state));
    },
    setTarget: (state, { shaft, newFloor }) => {
      state.elevators[shaft].target = newFloor;
      localStorage.setItem("store", JSON.stringify(state));
    },
    setState: (state, { shaft, newState }) => {
      state.elevators[shaft].state = newState;
      localStorage.setItem("store", JSON.stringify(state));
    },
    addQueueItem: (state, floor) => {
      state.queue.push(floor);
      localStorage.setItem("store", JSON.stringify(state));
    },
    deleteQueueItem: state => state.queue.shift(),
  },
  actions: {
    onTargetReached({ state, dispatch }, shaft) {
      // If there are still any items in the queue, set the first one as the target
      // Otherwise, set the target to undefined
      if (state.queue[0] !== undefined) {
        dispatch("changeTarget", { shaft, newFloor: state.queue[0] });
      } else dispatch("changeTarget", { shaft, newFloor: undefined });
    },
    changeFloor({ commit }, { shaft, newFloor }) {
      commit("setFloor", { shaft, newFloor });
      // If the current floor of an elevator is updated, that means it's moving
      commit("setState", { shaft, newState: STATE.MOVING });
    },
    changeTarget({ commit }, { shaft, newFloor }) {
      commit("setTarget", { shaft, newFloor });

      // If a new target was given, change the state to UPDATING
      if (newFloor !== undefined) {
        commit("setState", { shaft, newState: STATE.UPDATING });
        commit("deleteQueueItem");
      } else {
        commit("setState", { shaft, newState: STATE.IDLE });
      }
    },
    changeFloors({ state, commit }, change) {
      commit("setFloors", state.floors + change);
      commit("resetState");
    },
    changeShafts({ state, commit }, change) {
      commit("setShafts", state.shafts + change);
      commit("resetState");
    },
  },
  modules: {},
});
