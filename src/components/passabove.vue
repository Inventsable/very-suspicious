<template>
    <div :class="classname" ></div>
</template>

<script>
import passtest from '../assets/passtest.json'
import * as lottie from 'lottie-web'

export default {
    name: 'passabove',
    data: () => ({
        speed: .75,
        markers: [],
        elt: {},
        autoplay: false,
        loop: false,
    }),
    props: {
        classname: String,
    },
    mounted() {
        this.elt = this.$el;
        this.animData = this.buildAnimation();
        this.assignMarkers(this.animData.animationData.markers);
    },
    computed: {
        segments: function () {
            let mirrors = [];
            for (let i = 0; i < this.markers.length - 1; i++) {
                const marker = this.markers[i];
                const nextmarker = this.markers[i + 1];
                let mirror = {
                    forward: [marker, nextmarker],
                    reverse: [nextmarker, marker],
                };
                mirrors.push(mirror);
            }
            return mirrors;
        },
    },
    methods: {
        playSegment(msg) {
            let num = msg[0], state = msg[1];
            if (state) {
                if (num < 1)
                    this.animData.setSpeed(this.speed * 1.25);
                else
                    this.animData.setSpeed(this.speed);
                this.animData.playSegments(this.segments[num].forward, false);
            } else {
                this.animData.setSpeed(this.speed * 1.5);
                this.animData.playSegments(this.segments[num].reverse, false);
            }
        },
        isDone() {
            console.log(`${this.index} is complete`)
        },
        assignMarkers(args) {
            this.markers = [];
            for (let i = 0; i < args.length; i++) {
                const marker = args[i];
                this.markers.push(marker.tm)
            }
            // if (this.markers.length)
            // console.log(this.markers)
        },
        buildAnimation() {
            const self = this;
            const animData = {
                wrapper: self.elt,
                animType: 'svg',
                loop: self.loop,
                prerender: true,
                autoplay: self.autoplay,
                // path: `../assets/eyeCell${this.type}.json`,
                // animationData: passtest,
            };
            animData.animationData = passtest;
            
            return lottie.loadAnimation(animData);
        },
    }
}
</script>

<style>
svg {
    width: 100%;
}

.anim-eye {
    fill: var(--color-faded);
    stroke: var(--color-faded);
}

.anim-pupil {
    fill: var(--color-bg);
    stroke: var(--color-bg);
}

.pass-eye {
    fill: var(--color-status);
    stroke: var(--color-status);
}

.pass-pupil {
    fill: var(--color-bg);
    stroke: var(--color-bg);
}

.anim-bg {
    fill: transparent;
    stroke: transparent;
}
</style>
