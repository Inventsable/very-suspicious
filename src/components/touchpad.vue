<template>
    <div class="master" :style="getMasterStyle()" id="parent">
        <v-snackbar v-model="message" :timeout="2500" top>
            <v-spacer />
            <v-icon class="white--text">{{hasMatch ? 'vpn_key' : ''}}</v-icon>
            <span style="margin-left:.5rem;">{{anno}}</span>
            <v-spacer />
        </v-snackbar>
        <div class="hidden-sm-and-down" :style="getCenterStyle()">
            <v-card width="300px" class="offset">
                <v-card-title
                    style="display:flex;justify-content:center;width:100%;"
                    ><v-icon large>desktop_access_disabled</v-icon></v-card-title>

                <v-card-text style="display:flex;justify-content:center;width:100%;">
                    Only accessible in mobile
                </v-card-text>
            </v-card>
        </div>
        <div class="head hidden-md-and-up" style="width:100%;">
            <v-textarea
                id="text"
                :style="getOutputStyle()"
                v-model="valueMod"
                class="hidden-xs-only"
                color="cyan darken"
                loading
                readonly
                rows="2"
                maxlength="10"
                box
                >
                <v-progress-linear
                    slot="progress"
                    style="margin-top:6px;"
                    :value="progress"
                    :color="color"
                    height="5"
                ></v-progress-linear>
            </v-textarea>
            <v-textarea
                id="text"
                :style="getOutputStyleLand()"
                v-model="valueMod"
                class="hidden-sm-only "
                color="cyan darken"
                loading
                readonly
                rows="2"
                maxlength="10"
                box
                >
                <v-progress-linear
                    slot="progress"
                    style="margin-top:6px;"
                    :value="progress"
                    :color="color"
                    height="5"
                ></v-progress-linear>
            </v-textarea>
        </div>
        <div class="tail hidden-md-and-up" style="width:100%;">
            <div class="hidden-sm-only numpad" v-if="isPortrait && isMobileDevice">
                <div class="numpad-row">
                    <v-btn 
                        v-for="(btn,index) in number.pad" 
                        :style="getBtnStyle()"
                        :key="index" 
                        block
                        @click="addKey(btn.key)"
                        >{{btn.key}}</v-btn>
                    <v-btn 
                        :style="getBtnStyle()"
                        block
                        @click="backSpace()"
                        >
                        <v-icon large>backspace</v-icon>
                        </v-btn>
                </div>
            </div>
            <div class="keyboard" v-if="!isPortrait && isMobileDevice && altKeyboard">
                <div class="keyboard-rowA" :style="rowAStyle()">
                    <v-btn 
                        v-for="(btn,index) in keys.rowA" 
                        :style="getKeyBtnStyle()"
                        :key="index" 
                        block
                        @click="addKey(btn.key)"
                        >{{btn.key}}</v-btn>
                </div>
                <div class="keyboard-rowB" :style="rowBStyle()">
                    <div class="spacer"></div>
                    <v-btn 
                        v-for="(btn,index) in keys.rowB" 
                        :style="getKeyBtnStyle()"
                        :key="index" 
                        block
                        @click="addKey(btn.key)"
                        >{{btn.key}}</v-btn>
                    <div class="spacer"></div>
                </div>
                <div class="keyboard-rowC" :style="rowCStyle()">
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="value = ''"
                        >
                        <v-icon large>clear</v-icon>
                        </v-btn>
                    <div class="spacer"></div>
                    <v-btn 
                        v-for="(btn,index) in keys.rowC" 
                        :style="getKeyBtnStyle()"
                        :key="index" 
                        block
                        @click="addKey(btn.key)"
                        >{{btn.key}}</v-btn>
                    <div class="spacer"></div>
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="backSpace()"
                        >
                        <v-icon large>keyboard_backspace</v-icon>
                        </v-btn>
                </div>
                <div class="keyboard-rowD" :style="rowDStyle()" v-if="hasSpace">
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="displayConsole"
                        ><v-icon>vpn_key</v-icon></v-btn>
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="addKey(' ')"
                        ><v-icon>space_bar</v-icon></v-btn>
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="checkKey()"
                        ><v-icon>send</v-icon></v-btn>
                </div>
            </div>
            <div class="keyboard" v-if="!isPortrait && isMobileDevice && !altKeyboard">
                <div class="keyboard-rowA" :style="rowAStyle()">
                    <v-btn 
                        v-for="(btn,index) in keys.rowA" 
                        :style="getKeyBtnStyle()"
                        :key="index" 
                        block
                        @click="addKey(btn.key)"
                        >{{btn.key}}</v-btn>
                </div>
                <div class="keyboard-rowB" :style="rowBStyle()">
                    <div class="spacer"></div>
                    <v-btn 
                        v-for="(btn,index) in keys.rowB" 
                        :style="getKeyBtnStyle()"
                        :key="index" 
                        block
                        @click="addKey(btn.key)"
                        >{{btn.key}}</v-btn>
                    <div class="spacer"></div>
                </div>
                <div class="keyboard-rowC" :style="rowCStyle()">
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="value = ''"
                        >
                        <v-icon large>clear</v-icon>
                        </v-btn>
                    <div class="spacer"></div>
                    <v-btn 
                        v-for="(btn,index) in keys.rowC" 
                        :style="getKeyBtnStyle()"
                        :key="index" 
                        block
                        @click="addKey(btn.key)"
                        >{{btn.key}}</v-btn>
                    <div class="spacer"></div>
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="backSpace()"
                        >
                        <v-icon large>keyboard_backspace</v-icon>
                        </v-btn>
                </div>
                <div class="keyboard-rowD" :style="rowDStyle()" v-if="hasSpace">
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="displayConsole"
                        ><v-icon>vpn_key</v-icon></v-btn>
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="addKey(' ')"
                        ><v-icon>space_bar</v-icon></v-btn>
                    <v-btn 
                        :style="getKeyBtnStyle()"
                        block
                        @click="checkKey()"
                        ><v-icon>send</v-icon></v-btn>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import db from '@/firebase/init'

export default {
    name: 'touchpad',
    data: () => ({
        // value: '',
        max: 10,
        custom: true,
        anno: 'Found key',
        message: false,
        altKeyboard: false,
        hasMatch: false,
        isMobileDevice: null,
        hasSpace: false,
        isPortrait: null,
        device: null,
        value: '',
        keys: {
            rowAlist: ['q','w','e','r','t','y','u','i','o','p'],
            rowBlist: ['a','s','d','f','g','h','j','k','l'],
            rowClist: ['z','x','c','v','b','n','m'],
            rowDlist: ['in', 'space', 'out'],
            rowA: [],
            rowB: [],
            rowC: [],
            rowD: [],
        },
        number: {
            typeList: ['1','2','3','4','5','6','7','8','9','\.','0'],
            pad: [
                {
                    key: '1',
                    active: false,
                    color: 'red',
                }
            ],
            rows: 4,
            cols: 3,
        },

    }),
    computed: {
        progress () { return Math.min(100, this.value.length * 10) },
        valueMod() { return this.value.toUpperCase() },
        color () {
            return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
        },
    },
    mounted() {
        // console.log('Touchpad start')
        this.buildNumpad();
        this.buildKeypad();
        this.checkSize();
        // console.log(this.$route.name)
        window.addEventListener("resize", this.checkSize);
        window.addEventListener("orientationchange", this.checkSize);
    },
    methods: {
        checkSize(evt) {
            let mobilex = [640, 360, 375, 667, 568, 320, 812, 736, 823];
            let mobiley = [280, 560, 551, 325, 270, 452, 375, 414, 411];
            let devices = ['Galaxy S5', 'Galaxy S5', 'iPhone 6/7/8', 'iPhone 6/7/8', 'iPhone SE', 'iPhone SE', 'iPhone X', 'iPhone 6/7/8+', 'Pixel 2 XL'];
            let match = false;
            const doc = document.documentElement;
            for (let i = 0; i < mobilex.length; i++) {
                let x = mobilex[i], y = mobiley[i]
                if (screen.orientation.angle !== 0) {
                    if ((doc.clientWidth == x) && (doc.clientHeight == y)) {
                        match = true;
                        this.isMobileDevice = true;
                        this.isPortrait = false;
                        this.device = devices[i];
                    }
                } else {
                    if ((doc.clientWidth == y) && (doc.clientHeight == x)) {
                        match = true;
                        this.isMobileDevice = true;
                        this.isPortrait = true;
                        this.device = devices[i];
                    }
                }
            }
            if (!match) {
                this.altKeyboard = false;
                if (doc.clientWidth < 800) {
                    if (doc.clientWidth > doc.clientHeight)
                        this.isPortrait = false;
                    else
                        this.isPortrait = true;
                    this.isMobileDevice = true;
                    this.device = 'Unknown mobile'
                } else {
                    this.isMobileDevice = false;
                    this.device = 'Desktop';
                    this.isPortrait = true;
                }
            } else {
                this.altKeyboard = true;
            }
            // console.log(`${this.device} @ ${this.isPortrait ? 'Portrait' : 'Landscape'}`)
            // console.log(`${this.altKeyboard}`)
            // console.log(`${document.documentElement.clientWidth}x${document.documentElement.clientHeight} : ${screen.orientation.angle}`)
        
        },
        getMasterStyle() {
            return `
                height: ${this.$route.name == 'codes' ? '100vh' : 'calc(100vh - 32px)'};
                width: ${this.$route.name == 'codes' ? '100vw' : 'calc(100vw - 32px)'};
                padding: ${this.$route.name == 'codes' ? '.75rem' : '0px'};
            `
        },
        getCenterStyle() {
            return `
                display:flex;
                justify-content:center;
                align-items:center;
                width: 80%;
                height: 90%;
            `
        },
        displayConsole() {
            this.$root.$children[0].toggleConsole = true;
        },
        backSpace() {
            if (this.value.length)
                this.value = this.value.substring(0, this.value.length - 1);
        },
        addKey(key) {
            if (this.value.length < this.max)
                this.value = this.value + key;
            if (this.value.length == this.max)
                setTimeout(() => {
                    this.checkKey();
                }, 500)
        },
        checkKey() {
            if (this.value.length <= this.max) {
                let pass = this.value.toLowerCase();
                this.value = '';
                db.collection('touchpad').where('pass', '==', pass).get()
                    .then(snapshot => {
                        if (snapshot.docs.length) {
                            this.hasMatch = true;
                            this.anno = snapshot.docs[0].data().anno;
                        } else {
                            this.hasMatch = false;
                            this.anno = 'FALSE';
                        }
                        this.message = true;
                    })
            }
        },
        rowAStyle() {
            return ``;
        },
        rowBStyle() {
            return ``;
        },
        rowCStyle() {
            return ``;
        },
        rowDStyle() {
            return ``;
        },
        getOutputStyle() {
            return `
                font-size:30px;
                font-family: 'Space Mono', monospace;
                line-height:20px;
            `;
        },
        getOutputStyleLand() {
            return `
                font-size:30px;
                font-family: 'Space Mono', monospace;
                line-height:20px;
            `;
        },
        getBtnStyle() {
            return `
                font-size:40px;
                font-family: 'Space Mono', monospace;
                color: grey;
            `;
        },
        getKeyBtnStyle() {
            return `
                font-size:20px;
                font-family: 'Space Mono', monospace;
                color: grey;
                margin: 0px;
                height: 6vw;
            `;
        },
        buildNumpad() {
            let results = [];
            this.number.pad = [];
            while (this.number.typeList.length) {
                results.push(this.number.typeList.splice(0, this.number.cols));
            }
            for (var i = 0; i < results.length; i++) {
                for (var c = 0; c < results[i].length; c++) {
                    var key = results[i][c];
                    this.number.pad.push({
                        key: key,
                        active: false,
                        color: '',
                    })
                }
            }
        },
        buildKeypad() {
            let results = ['A','B','C','D'];
            this.keys.rowA = [];
            for (var i = 0; i < results.length; i++) {
                let type = results[i];
                // console.log(type)
                for (var c = 0; c < this.keys[`row${type}list`].length; c++) {
                    var key = this.keys[`row${type}list`][c];
                    this.keys[`row${type}`].push({
                        key: key,
                        active: false,
                        color: '',
                    })
                }
            }
        }
    }
}
</script>

<style scoped>
.numpad {
    display: grid;
    grid-column-gap: .25rem;
    grid-gap: .25rem;
    height: 56vh;
}
.v-btn--block { height: 90%; }
.v-progress-linear__bar { height: 5px; }
.v-input input { max-height: 40px; }
.v-btn { min-width: 0px; }
.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot { height: 40px; }
#text { line-height: 1 !important; }

.keyboard {
    display: flex;
    justify-content: center;
    align-items: baseline;
    flex-wrap: wrap;
    width: 100%;
    /* border: 2px solid red; */

    /* height: vh; */
}

[class^="keyboard-row"] {
    margin: 2px 0px;
    display: grid;
    grid-column-gap: .25rem;
    width: 100%;
}

.keyboard-key {
    width: 100%;
    height: 100%;
}

.master {
    /* border: 2px solid white; */    
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.keyboard-rowA {
    grid-template-columns: repeat(10, 1fr);
}
.keyboard-rowB {
    grid-template-columns: .5fr repeat(9, 1fr) .5fr;
}
.keyboard-rowC {
    grid-template-columns: 1.325fr .175fr repeat(7, 1fr) .175fr 1.325fr;
    grid-template-rows: 1fr;
}
.keyboard-rowD {
    grid-template-columns: 1fr 3fr 1fr;
}

.numpad-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: .5rem;
    grid-template-rows: repeat(4, 1fr);
}

</style>
