<template>
    <div :class="classname" ></div>
</template>

<script>
import eyeCellA from '../assets/eyeCellA.json'
import * as lottie from 'lottie-web'

export default {
    name: 'animator',
    data: () => ({
        speed: .75,
        markers: [],
        elt: {},
        isActive: false,
        autoplay: false,
        loop: false,
    }),
    props: {
        index: Number,
        type: String,
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
        forceClosing() {
            // console.log(this.animData);
            if (this.animData.currentFrame > 0) {
                this.animData.setSpeed(this.speed * 1.25);
                this.animData.playSegments(this.segments[0].reverse);
            }
            
        },
        playSegment(msg) {
            let num = msg[0], state = msg[1];
            if (state) {
                this.animData.setSpeed(this.speed);
                this.animData.playSegments(this.segments[num].forward);
            } else {
                this.animData.setSpeed(this.speed * 1.25);
                this.animData.playSegments(this.segments[num].reverse);
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
                // animationData: eyeCellA,
            };
            // if (/a/i.test(this.type))
            animData.animationData = eyeCellA;
            
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

.anim-bg {
    fill: transparent;
    stroke: transparent;
}
</style>
