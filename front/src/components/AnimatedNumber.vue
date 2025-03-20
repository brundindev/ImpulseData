<template>
  <span>{{ Math.round(displayNumber) }}</span>
</template>

<script>
export default {
  name: 'AnimatedNumber',
  props: {
    number: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      displayNumber: 0,
      interval: null,
      stepFactor: 0.05
    }
  },
  mounted() {
    this.displayNumber = 0;
    this.animateToTarget(this.number);
  },
  watch: {
    number(newVal) {
      this.animateToTarget(newVal);
    }
  },
  methods: {
    animateToTarget(target) {
      clearInterval(this.interval);

      if (target === Math.round(this.displayNumber)) {
        return;
      }

      this.interval = window.setInterval(() => {
        if (Math.abs(this.displayNumber - target) < 0.5) {
          this.displayNumber = target;
          clearInterval(this.interval);
          return;
        }

        const difference = target - this.displayNumber;
        
        const changePercentage = Math.min(1, Math.abs(difference) / target) * 0.8 + 0.2;
        
        const change = difference * this.stepFactor * changePercentage;
        
        this.displayNumber = this.displayNumber + change;
      }, 25);
    }
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
}
</script> 