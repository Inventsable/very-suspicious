<template>
  <v-dialog
      v-model="status"
      hide-overlay
      persistent
      width="300"
      >
      <v-card
          color="primary"
          dark
      >
        
        <v-card-text>
        <v-icon class="pr-1">{{icon}}</v-icon>
        {{desc}}
        <v-progress-linear
            v-model="value"
            :active="show"
            :indeterminate="query"
            :query="(index < 1) ? true : false"
            color="white"
            class="mb-0"
        ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'loader',
  data: () => ({
    query: false,
    show: true,
    interval: 0,
    value: 0,
    file: {
      min: 200,
      max: 600,
    },
    runeware: {
      min: 400,
      max: 800,
    }
  }),
  props: {
    status: Boolean,
    index: Number,
    desc: String,
    icon: String,
  },
  mounted() {
    this.value = 0;
    this.interval = 0;
    if (this.index < 1) {
      this.queryAndIndeterminate();
    } else {
      this.goLinear();
    }
  },
  computed: {
    timer() {
      if (this.index > 1)
        return 1000;
      else 
        return 1000/(this.index + 1);
    },
    toggleTimer() {
      let min = Math.ceil(200);
      let max = Math.floor(600);
      return Math.floor(Math.random() * (max - min)) + min;
    },
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    getRandomTime(params) {
      let min = Math.ceil(this[params].min);
      let max = Math.ceil(this[params].max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    goLinear() {
      // setTimeout(() => {
        // this.query = false
        this.interval = setInterval(() => {
          if (this.value === 100) {
            clearInterval(this.interval)
            this.show = false
            return setTimeout(this.goLinear, 500)
          }
          this.value += Math.floor(Math.random() * Math.floor(30));
          if (this.value >= 100) {
            this.$emit('done');
          }
        }, this.getRandomTime('file'));
      // }, 2500)
    },
    queryAndIndeterminate () {
      this.query = true
      this.show = true
      this.value = 0
      setTimeout(() => {
        this.query = false

        this.interval = setInterval(() => {
          if (this.value === 100) {
            clearInterval(this.interval)
            this.show = false
            return setTimeout(this.queryAndIndeterminate, 2000)
          }
          this.value += 25
          if (this.value >= 100) {
            this.$emit('done');
          }
        }, this.getRandomTime('runeware'))
      }, 2500)
      
      
    }
  }
}
</script>
