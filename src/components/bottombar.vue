<template>
    <div v-show="!hidden" style="z-index: 4001;">
        <div class="hidden-md-and-up">
            <div class="footNum grey lighten-3 hidden-sm-only" :style="getStyle()">
                <div>
                    <v-icon small v-for="(key, num) in list" :key="num" :color="key" class="px-0">vpn_key</v-icon>
                    <v-icon small v-for="numdark in missing" :key="numdark + 'd'" color="grey" style="opacity:.5;" class="px-0">vpn_key</v-icon>
                </div>
                <div class="tailend">
                    <div v-if="extra">
                        <v-icon small class="px-2" v-for="route in routes" :key="route.name" @click="goTo(route.name)">{{route.icon}}</v-icon>
                    </div>
                    <span class="title pr-1 ml-3 grey--text" style="opacity:.5;">
                        {{count}}
                    </span>
                </div>
            </div>
            <div class="footNum grey lighten-3 hidden-xs-only">
                <div class="tailend">
                    <v-icon small v-for="(key, num) in list" :key="num" :color="key" class="px-1">vpn_key</v-icon>
                    <v-icon small v-for="numdark in missing" :key="numdark + 'd'" color="grey" style="opacity:.5;" class="px-1">vpn_key</v-icon>
                </div>
                <div>
                    <div v-if="extra">
                        <v-icon small class="px-3" v-for="route in routes" :key="route.name" @click="goTo(route.name)">{{route.icon}}</v-icon>
                    </div>
                    <span class="title pr-1 ml-3 grey--text" style="opacity:.5;">
                        {{count}}
                    </span>
                </div>
            </div>

        </div>
        <div class="footNum grey lighten-3 hidden-sm-and-down">
            <div class="tailend">
                <v-icon v-for="(key, num) in list" :key="num" :color="key" class="px-1">vpn_key</v-icon>
                <v-icon v-for="numdark in missing" :key="numdark + 'd'" color="grey" style="opacity:.5;" class="px-1">vpn_key</v-icon>
            </div>
            <div style="display:flex;align-items:center;">
                <div v-if="extra">
                    <v-icon large class="px-5 pt-1" v-for="route in routes" :key="route.name" @click="goTo(route.name)">{{route.icon}}</v-icon>
                </div>
                <span class="display-1 pr-3 ml-5 grey--text">
                    {{count}}
                </span>
            </div>
        </div>
        
    </div>

</template>

<script>
export default {
    name: 'bottombar',
    data: () => ({
        extra: false,
        hidden: false,
        routes: [
            {
                name: 'home',
                icon: 'home'
            },
            {
                name: 'messages',
                icon: 'chat',
            },
            {
                name: 'link',
                icon: 'history',
            }
        ]
    }),
    props: {
        list: Array,
        missing: Number,
        count: Number,
    },
    mounted() {
        window.addEventListener('resize', this.checkStyle);
        this.checkRoute();
    },
    beforeUpdate() {
        this.checkRoute();
    },
    computed: {

    },
    methods: {
        checkRoute() {
            if (this.$route.name !== 'home') {
                this.hidden = true;
            } else {
                this.hidden = false;
            }
            // console.log(`Hidden is ${this.hidden}`);
        },
        goTo(place) {
            this.$router.push({name:place})
        },
        checkStyle() {
            if (this.$root.$children[0].world) {
                // console.log(window.orientation);
                // console.log(this.offset);
                this.offset = 17;
            }
            this.checkRoute();
        },
        getStyle() {
            let style = 'bottom:';
            if (this.$root.$children[0].world) {
                style+='0px;'
            } else {
                    style+=`17px;`
            }
            return style;
        },
        
    }
}
</script>

<style>
/* #fixbottom {
    
} */

.footNum {
  height: 34px;
  display: flex;
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
</style>
