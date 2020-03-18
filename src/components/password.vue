<template>
    <v-dialog v-model="status" persistent max-width="300px">
          <v-card
              class="elevation-16 mx-auto"
              width="300px"
          >
            <v-card-text>
                <v-container grid-list-md>
                    <div style="margin-bottom:-12px;">
                        <passabove ref="passabove" class="pass"></passabove>
                    </div>
                    <!-- <div class="hidden-md-and-up">
                        <simplepassabove ref="simplepassabove" class="pass"></simplepassabove>
                    </div> -->
                    <v-layout>
                        <v-flex xs2 class="mt-3">
                            <v-avatar size="30" class="grey lighten-2 mt-1">
                                <img :src="avatar" alt="profile">
                            </v-avatar>
                        </v-flex>
                        <v-flex xs10>
                            <form @submit.prevent="enter">
                                <v-text-field
                                    v-model="password"
                                    autofocus
                                    @blur="focusOff"
                                    @focus="focusOn"
                                    browser-autocomplete="new_password"
                                    :append-icon="showname ? 'visibility_off' : 'visibility'"
                                    :rules="[rules.required, rules.counter]"
                                    type="text"
                                    name="input-10-2"
                                    label="Enter password"
                                    :hint="hintText"
                                    counter
                                    maxlength="8"
                                    @input="passAnim"
                                    @click:append="showname = !showname"
                                    @keyup="checkLength"
                                ></v-text-field>
                            </form>

                        </v-flex>

                    </v-layout>
                    <!-- <div class="placeholder"></div> -->
                </v-container>
            </v-card-text>

            <!-- <v-divider></v-divider> -->
          </v-card>
    </v-dialog>
</template>

<script>
import passabove from './passabove.vue'
// import simplepassabove from './simplepassabove.vue'

export default {
    name: 'password',
    props: {
        status: Boolean,
        avatar: String,
    },
    components: {
        // simplepassabove,
        passabove,
    },
    data: () => ({
        password: null,
        passActive: false,
        rules: {
            required: value => !!value || `Inactivity will be reported.`,
            counter: value => value ? value.length <= 8 || 'Must be 8 characters' : false,
        },
        hintText: 'Strength: Weak',
        showname: false,
        isForward: true,
        lastlength: 0,
        hardReset: false,
        max: 9,
    }),
    computed: {
        // avatar() {
        //     return this.$root.$children[0].avatar;
        // }
    },
    methods: {
        focusOn() {
            this.passActive = true;
            this.checkColor();
            // console.log(`${this.passActive}`)
        },
        focusOff() {
            this.passActive = false;
            // console.log(`${this.passActive}`)
            this.$root.$children[0].setCSS('color-status', `rgba(0,0,0,0.54)`);
        },
        checkLength() {
            if (!this.hardReset) {
                if (!this.password.length) {
                    this.$refs.passabove.playSegment([0, false])
                    // this.$refs.simplepassabove.playSegment([0, false])
                }
            }
        },
        checkColor() {
            if (this.passActive) {
                if (this.password) {
                    this.$root.$children[0].setCSS('color-status', `#1976D2`);
                } else {
                    this.$root.$children[0].setCSS('color-status', `#FF5252`);
                }
            } else {
                this.$root.$children[0].setCSS('color-status', `rgba(0,0,0,0.54)`);
            }
        },
        passAnim() {
            this.checkColor();
            if (this.password) {
                if (this.password.length < this.max) {
                    // console.log(this.password.length, this.lastlength);
                    if (this.lastlength < this.password.length)
                        this.isForward = true;
                    else if ((this.password.length == 1) && (this.lastlength == 1||0))
                        this.isForward = true;
                    else if ((this.password.length == 1) && (this.lastlength == 2))
                        this.isForward = false;
                    else
                        this.isForward = false;
                    
                    this.lastlength = this.password.length;
                    if ((this.isForward && this.password.length > 0) && ((this.password.length !== 0) && (this.lastlength !== 0))) {
                        this.$refs.passabove.playSegment([this.password.length - 1, this.isForward])
                        // this.$refs.simplepassabove.playSegment([this.password.length - 1, this.isForward])

                    // if (this.password.length == 0) {
                        //     this.$refs.simplepassabove.playSegment([0, this.isForward])
                        // } else {
                        //     this.$refs.simplepassabove.playSegment([1, this.isForward])
                        // }
                    } else {
                        if ((this.password.length !== 8) && ((this.password.length !== 0) && (this.lastlength !== 0)))
                            this.$refs.passabove.playSegment([this.password.length, this.isForward])
                            // this.$refs.simplepassabove.playSegment([this.password.length, this.isForward])

                    // if (this.password.length == 0) {
                        //     this.$refs.simplepassabove.playSegment([0, this.isForward])
                        // } else {
                        //     this.$refs.simplepassabove.playSegment([1, this.isForward])
                        // }
                    }
                    // this.checkColor();
                }
            }
        },
        reset() {
            this.password = null;
            this.showname = false;
            this.hardReset = false;
        },
        enter() {
            if (this.password.length > 2) {
                // console.log(`Entering as ${this.password}`);
                this.hardReset = true;
                this.$root.$children[0].password = this.password;
                this.$emit('submitPass');
                this.$parent.$refs.grid.playClosing(this.$parent.typeList[0]);
                this.$parent.$refs.grid.playClosing(this.$parent.typeList[1]);
                this.$parent.$refs.grid.playClosing(this.$parent.typeList[2]);
                this.$parent.$refs.grid.playClosing(this.$parent.typeList[3]);
            }
        },
        start() {
            // console.log('BEGIN');
            this.$parent.$refs.grid.reverseFocusing(this.$parent.typeList[0]);
            this.$parent.$refs.grid.reverseFocusing(this.$parent.typeList[1]);
        }
    },
    mounted() {
        // console.log('Password launched');
    }
}
</script>

<style scoped>
.v-card__text {
    padding: 0px 16px !important;
}

.grid-list-md {
    padding-top: 4px;
}
/* .v-text-field {
    padding-top: 0px !important;
} */

.pass {
    /* border: 2px solid green; */
    box-sizing: border-box;
}


.placeholder {
    /* border: 2px solid rgba(255,0,0,0.2); */
    box-sizing: border-box;
    width: 100%;
    height: 50px;
}
</style>
