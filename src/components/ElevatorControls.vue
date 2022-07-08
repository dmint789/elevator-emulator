<template>
  <div class="controls">
    <div class="floor" v-for="floor in floors" :key="floor">
      <button
        class="button"
        :style="{ backgroundColor: false ? 'orange' : 'blue' }"
        @click="$emit('floor-selected', floor)"
        :name="floor"
        :value="floor"
        checked
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
    },
    emits: ["floor-selected"],
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
