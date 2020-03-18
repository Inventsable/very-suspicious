<template>
    <div :style="getGridStyle(orientation)" class="joystick-grid">
        <animator 
            v-for="(type,key) in typeFactory"
            :key="key"
            :ref="'cell' + key" 
            :type="type" 
            :index="key"
            classname="cell" 
        />
    </div>
</template>

<script>
import animator from './animator'

export default {
    name: 'eyegrid',
    data: () => ({
        gridList: [],
        index: 0,
        maxStep: 4,
        typeList: ['A', 'B', 'C', 'D'],
        types: {
            A: [],
            B: [],
            C: [],
            D: [],
        },
    }),
    props: {
        // cols: Number,
        orientation: String,
    },
    components: {
        animator,
    },
    computed: {
        cols() {
            if (window.orientation) {
                if (window.orientation == 90) {
                    return 10;
                } else {
                    return 8;
                }
            } else {
                return 18;
            }
            // return 10;
        },
        rows() {
            // if (this.orientation == 'landscape') {
            //     return 10;
            // } else if (this.orientation == 'portrait') {
            //     return 10;
            // } else {
            //     return 10;
            // }
            return 10;

        },
        total() {
            return this.cols * this.rows;
        },
        typeFactory() {
            let count = -1, mirror = [];
            for (var i = 0; i < this.total; i++) {
                if (count < this.typeList.length - 1)
                    count++;
                else
                    count = 0;
                mirror.push(this.typeList[count])
            }
            return mirror;
        },
    },
    mounted() {
        this.buildGridList();
        this.types = this.buildTypeList();
    },
    methods: {
        forceClosing() {
            for (var e = 0; e < this.typeList.length; e++) {
                var letter = this.typeList[e];
                for (var i = 0; i < this.types[letter].length; i++) {
                    var child = this.types[letter][i];
                    this.$refs['cell' + child][0].forceClosing();
                }
            }
        },
        playOpening(letter) {
            for (var i = 0; i < this.types[letter].length; i++) {
                var child = this.types[letter][i];
                this.$refs['cell' + child][0].playSegment([0, true]);
            }
        },
        playFocusing(letter) {
            for (var i = 0; i < this.types[letter].length; i++) {
                var child = this.types[letter][i];
                this.$refs['cell' + child][0].playSegment([1, true]);
            }
        },
        reverseFocusing(letter) {
            for (var i = 0; i < this.types[letter].length; i++) {
                var child = this.types[letter][i];
                this.$refs['cell' + child][0].playSegment([1, false]);
            }
        },
        playClosing(letter) {
            // state = state|false;
            for (var i = 0; i < this.types[letter].length; i++) {
                var child = this.types[letter][i];
                // if (state)
                //     this.$refs['cell' + child][0].playSegment([0, true]);
                // else 
                    this.$refs['cell' + child][0].playSegment([0, false]);
            }
        },
        buildTypeList() {
            let result = {
                ATypes: [],
                BTypes: [], 
                CTypes: [],
                DTypes: [],
                // ETypes: [],
            }
            // if (this.$refs.length )
            for (var i = 0; i < this.typeFactory.length; i++) {
                let char = this.typeFactory[i];
                if (this.$refs['cell' + i].type == char);
                    result[char + 'Types'].push(i);
            }
            return {
                A: result.ATypes,
                B: result.BTypes,
                C: result.CTypes,
                D: result.DTypes,
                // E: result.ETypes,
            }
        },
        getGridStyle(type) {
            let style = `
                display: grid;
                box-sizing: border-box;
                z-index: 4;
                position: absolute;
                top: 0px;
                width: 100vw;
                left: 0px;
                height: 100vh;
                grid-template-columns: repeat(${this.cols}, 1fr);
                grid-template-rows: repeat(${this.rows}, 1fr);
            `
            return style;
        },
        getGridLineStyle() {
            return `border:1px solid rgba(255,255,255,1);`
        },
        buildGridList() {
            let mirror = [];
            this.gridList = [];
            for (let i = 0; i < this.cols * this.rows; i++)
                mirror.push({ key: i })
            this.gridList = mirror;
        },
    }
}
</script>

<style>
.cell {
    box-sizing: border-box;
    padding: .125rem;
}
</style>
