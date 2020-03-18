<template>
    <div class="loading-icon" ></div>
</template>

<script>
import loading from '../assets/allseeing.json'
import * as lottie from 'lottie-web'

export default {
    name: 'loadingicon',
    data: () => ({
        speed: .75,
        elt: {},
        autoplay: true,
    }),
    mounted() {
        this.elt = this.$el;
        this.animData = this.buildAnimation();
        this.animData.addEventListener('complete', this.isDone);
    },
    methods: {
        isDone() {
            this.$emit('done');
        },
        buildAnimation() {
            const self = this;
            const animData = {
                wrapper: self.elt,
                animType: 'svg',
                loop: false,
                prerender: true,
                autoplay: true,
            };
            animData.animationData = loading;
            return lottie.loadAnimation(animData);
        },
    }
}
</script>

<style>
svg {
    width: 100%;
}

.anim-main {
    fill: var(--color-invert);
    stroke: var(--color-invert);
}

.anim-mask {
    fill: var(--color-bg-dark);
    stroke: var(--color-bg-dark);
}

.anim-bg {
    fill: transparent;
    stroke: transparent;
}
.loading-icon {
    width: 300px;
}
</style>
