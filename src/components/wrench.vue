<template>
    <div :class="classname" ></div>
</template>

<script>
import wrench from '../assets/wrench.json'
import * as lottie from 'lottie-web'

export default {
    name: 'wrench',
    data: () => ({
        speed: 1,
        markers: [],
        elt: {},
        isActive: false,
        autoplay: true,
        loop: true,
    }),
    props: {
        classname: String,
    },
    mounted() {
        this.elt = this.$el;
        this.animData = this.buildAnimation();
    },
    methods: {
        buildAnimation() {
            const self = this;
            const animData = {
                wrapper: self.elt,
                animType: 'svg',
                loop: self.loop,
                prerender: true,
                autoplay: self.autoplay,
            };
            animData.animationData = wrench;
            
            return lottie.loadAnimation(animData);
        },
    }
}
</script>

<style scoped>
svg {
    width: 100%;
}

.anim-main {
    fill: var(--color-faded);
    stroke: var(--color-faded);
}

.anim-mask {
    fill: var(--color-bg);
    stroke: var(--color-bg);
}
</style>
