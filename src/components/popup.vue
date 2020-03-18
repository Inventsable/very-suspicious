<template>
    <div>
        <v-dialog v-model="dialog" persistent :max-width="wide + 'px'">
        <v-card
            class="elevation-16 mx-auto"
            :width="wide"
            v-for="(step,key) in steps"
            v-show="key == roll"
            :key="key"
        >
            <v-container fluid class="isolated">
                <v-icon small v-for="(match, digit) in keyList" :key="digit" class="px-1" :color="determineColor(match)">vpn_key</v-icon>
            </v-container>
            <v-card-title
                class="headline"
                primary-title
                v-if="step.title"
                v-show="key !== 2"
                >
                {{step.title}}
            </v-card-title>
            <v-card-title
                class="headline"
                primary-title
                v-show="key == 2"
                >
                    <span :class="(toggleRating) ? 'text-uppercase' : ''">We</span>
                    <v-icon v-if="!toggleRating" color="primary" class="px-2">favorite</v-icon>
                    <v-icon v-if="toggleRating" color="primary" class="px-2">visibility</v-icon>
                    <span :class="(toggleRating) ? 'text-uppercase' : ''">Feedback</span>
                    <span v-if="!toggleRating">!</span>
            </v-card-title>
            <div class="centered-icon py-3" v-if="key == 1">
                <v-icon x-large>visibility</v-icon>
            </div>
            <v-card-text v-if="key == 2" class="pt-0 pb-2 checkgrid">
                <v-layout style="height: 42px;">
                    <div v-if="!toggleRating">
                        <span v-if="!rating">{{step.subtext}}</span>
                        <v-chip v-else color="deep-purple" text-color="white">
                            <v-icon left>account_circle</v-icon>
                            {{step.posttext[rating-1]}}
                        </v-chip>
                        <!-- <span v-else></span> -->
                    </div>
                    <!-- <v-icon v-for="(icon,key) in 20" :key="key">visibility</v-icon> -->
                    <div v-else class="centered-icon">
                        <v-icon color="primary" x-large>visibility</v-icon>
                    </div>
                </v-layout>
                
                <div class="text-xs-center mt-2" 
                    @mouseover="toggleRating = true" 
                    @mouseout="toggleRating = false"
                    @touchstart="toggleRating = true"
                    >
                    <v-rating
                        @click="testRating"
                        v-model="rating"
                        color="primary"
                        background-color="grey lighten-1"
                        full-icon="visibility"
                        empty-icon="$vuetify.icons.ratingFull"
                        hover
                        ></v-rating>
                </div>
            </v-card-text>
            <v-card-text v-else class="pt-0 pb-2">
                {{step.subtext}}
                <ul class="my-2" v-if="step.list">
                    <li v-for="(bullet,index) in step.list" :key="index">{{bullet}}</li>
                </ul>
                <div v-if="step.checkmarks" class="pt-3">
                    <v-checkbox v-for="(check, num) in step.checkmarks" :key="num" v-model="checkboxes[num]" color="primary" class="py-1">
                        <div slot="label" v-html="check"></div>
                    </v-checkbox>
                </div>
            </v-card-text>
            <div>
                <v-divider></v-divider>
                <v-card-actions class="justify-space-between">
                    <v-btn
                        flat
                        @mouseover="flipped = true;"
                        @mouseout="flipped = false;"
                        @touchstart="flipped = true;"
                        :color="buttonState(false).color"
                        @click="checkAction(false)"
                        style="width: 112px;"
                        v-if="key < 2"
                    >
                        {{buttonState(false).text}}
                    </v-btn>
                    <v-btn
                        :color="buttonState(true).color"
                        flat
                        @click="checkAction(true)"
                        style="width: 112px;"
                        v-if="key < 2"
                    >
                        {{buttonState(true).text}}
                    </v-btn>
                    <v-btn
                        id="altBtn"
                        :color="buttonState(true).color"
                        flat
                        @click="altRating()"
                        style="width: 112px;opacity:.025;"
                        v-if="key == 2"
                        :disabled="(rating) ? false : true"
                    >
                        <v-icon large v-if="canEyeToggle">visibility</v-icon>
                        <span v-else>No Thanks</span>
                    </v-btn>
                    <v-spacer v-if="key >= 2"></v-spacer>
                    <v-btn
                        :color="buttonState(true).color"
                        flat
                        @click="$emit('submitRating', rating)"
                        style="width: 112px;"
                        v-if="key == 2"
                        :disabled="(rating) ? false : true"
                        @mouseenter="buttonToggle = true;" 
                        @mouseleave="buttonToggle = false;"
                        @touchstart="buttonToggle = true;" 
                    >
                        <v-icon large v-if="canEyeToggle">visibility</v-icon>
                        <span v-else>Submit</span>
                    </v-btn>
                    <v-btn
                        color="primary"
                        flat
                        @click="$emit('submit')"
                        @mouseenter="toggleFocus(true)"
                        @mouseleave="toggleFocus(false)"
                        style="width: 112px;"
                        v-if="key == 3"
                        :disabled="(checked) ? false : true"
                    >
                        <span >Submit</span>
                    </v-btn>
                    
                </v-card-actions>
            </div>
        </v-card>
        </v-dialog>
        <div v-if="roll == 3 && !hideKey" class="centerHidden">
            <v-btn outline color="grey darken-2" class="grey--text" @click="addHiddenKey">
                <v-icon>vpn_key</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
// import snackbar from ''
export default {
    name: 'popup',
    props: {
        dialog: Boolean,
        roll: Number,
        wide: Number,
        keyList: Array,
    },
    mounted() {
        this.loader = false;
    },
    data() {
        return {
            hideKey: false,
            refuse: 'No thanks',
            accept: 'I consent',
            toggleRating: false,
            visible: true,
            rating: null,
            checkboxes: [false, false, false],
            buttonToggle: false,
            flipped: false,
            // loader: false,
            steps: [
                {
                    width: 300,
                    title: 'Administrator Request',
                    subtext: `Grand Mainframe is requesting access to:`,
                    list: [
                        'Messages and Contacts',
                        'Network and browsing history',
                        'Storage and battery',
                        'Camera, microphone and speakers',
                        'All nearby external devices',
                        'Geolocation',
                    ]
                },
                {
                    // title: 'Request permission',
                    width: 300,
                    subtext: `To ensure the best experience, Grand Mainframe is requesting access to your:`,
                    list: [
                        'bank accounts',
                        'usernames and passwords',
                        'family and friends',
                        'medical history',
                        // 'family members',
                        'fears and uncertainties',
                        // 'physical weaknesses',
                        // 'psychological triggers',
                    ]
                },
                {
                    width: 300,
                    title: 'We love feedback',
                    subtext: `How would you rate your recruitment experience?`,
                    posttext: [
                        'MAILER-DAEMON',
                        'XAROC',
                        'ZENGI',
                        'ENRELE',
                        'BEAUREGARD',
                    ]
                },
                {
                    width: 300,
                    // title: 'Checkers',
                    // subtext: `How would you rate your recruitment experience?`,
                    checkmarks: [
                        `</span>I have read and agree to the <a>Terms and Conditions</a></span>`,
                        `I understand the consequences of my actions`,
                        `I authorize Grand Mainframe to act on my behalf`,
                    ],
                }
            ]
        }
    },
    computed: {
        validateSubmit() {
            if (this.rating && this.key == 2)
                return true;
            else if (this.checked && this.key > 2)
                return true;
            else 
                return false;
        },
        canEyeToggle() {
            if (this.rating && this.buttonToggle)
                return true;
            else
                return false;
        },
        checked() {
            if (this.checkboxes[0] && this.checkboxes[1] && this.checkboxes[2])
                return true;
            else
                return false;
        },
        // roll() {
        //     return this.$parent.roll;
        // }
    },
    methods: {
        testRating() {
            this.ratingToggle++;
            // console.log(this.ratingToggle);
        },
        reset() {
            this.visible = true;
            this.rating = null;
            this.checkboxes = [false, false, false];
            this.buttonToggle = false;
            this.flipped = false;
        },
        toggleFocus(state) {
            let a, b, c, d = null;
            if (this.$parent.roll !== 3) {
                if (state) {
                    a = this.$parent.typeList[0];
                    b = this.$parent.typeList[1];
                    c = this.$parent.typeList[2];
                    d = this.$parent.typeList[3];
                } else {
                    a = this.$parent.typeList[3];
                    b = this.$parent.typeList[2];
                    c = this.$parent.typeList[0];
                    d = this.$parent.typeList[1];
                }
                this.$parent.$refs.grid.reverseFocusing(a)
                this.$parent.$refs.grid.reverseFocusing(b)
                this.$parent.$refs.grid.playFocusing(c)
                this.$parent.$refs.grid.playFocusing(d)
                // console.log(`Didn't do it`)
            } else {
                // console.log(`Roll is ${this.$parent.roll}`)
            }
        },
        addHiddenKey() {
            this.$parent.addKey('grey');
            this.hideKey = true;
            this.$emit('submit');
        },
        determineColor(name) {
            // if (/green/i.test(name))
            //     return 'success';
            // else if (/red/i.test(name))
            //     return 'error';
            // else if (/skull/i.test(name)) {
            //     return 'grey';
            // }
            return name;
        },
        altRating() {
            this.$parent.addKey('amber')
            this.$emit('submitRating', 0);
        },
        checkAction(params) {
            if (params !== this.flipped) {
                this.$emit('submit')
            } else {
                // console.log(this.$parent.roll)
                if (!this.flipped) {
                    if (!params) {
                        // if (this.$parent.roll !== 1) {
                            this.$parent.addKey('red');
                        // } else {
                            // this.$parent.addKey('red');
                        // }
                        this.$emit('altsubmit')
                        // this.$emit('submit')
                    } else {
                        this.$emit('submit')
                    }
                } else {
                    // if (this.$parent.roll == 1) {
                            this.$parent.addKey('purple');
                        // } else {
                            // this.$parent.addKey('purple');
                        // }
                    this.$emit('altsubmit')
                    // this.$emit('greensubmit')
                }
            }
        },
        buttonState(param) {
            let result = {};
            if (param) {
                result.text = (this.flipped) ? this.refuse : this.accept;
                result.color = (this.flipped) ? '' : 'primary';
            } else {
                result.text = (this.flipped) ?  this.accept : this.refuse;
                result.color = (this.flipped) ? 'primary' : '';
            }
            return result;
        }
    },
}
</script>


<style>
.centered-icon {
    width: 100%;
    display: flex;
    justify-content: center;
}

#altBtn {
    cursor: default;
}

.centerHidden {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80vw;
    height: 80vh;
    z-index: 5;
    /* border: 2px solid red; */
}

.isolated {
    position: absolute;
    left: 10px;
    top: -16px;
    opacity: .5;
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.v-input--selection-controls {
    margin-top: 0px;
}
/* .v-input__control {
    width: 80%;
    word-wrap: normal;
} */

.v-card__title--primary {
    padding-top: 14px;
}
</style>


