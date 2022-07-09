<template>
  <div class="controls">
    <div class="floor" v-for="floor in floors" :key="floor">
      <button
        class="button"
        :style="{ backgroundColor: inQueue(floor - 1) ? 'orange' : 'blue' }"
        @click="$emit('floor-selected', floor - 1)"
      >
        {{ floor }}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ElevatorControls",
    props: {
      floors: Number,
      queue: Array,
    },
    emits: ["floor-selected"],
    methods: {
      inQueue(floor) {
        return this.queue.find(item => item === floor) !== undefined;
      },
    },
  };
</script>

<style>
  .controls {
    display: flex;
    flex-direction: column-reverse;
    height: 400px;
    width: 200px;
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
