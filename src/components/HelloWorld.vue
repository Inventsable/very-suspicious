<template>
  <div>
    <v-container v-if="show">
        <password ref="passdialog" :status="passwordScreen" :avatar="getAvatar()" @submitPass="storePass"/>
        
        <v-dialog v-model="login" max-width="300px" persistent>
        <!-- div class="centered"> -->
          <!-- <v-btn
            slot="activator"
            color="primary lighten-2"
            style="z-index: 200;"
            dark
            @click="login = !login;"
          >
            Login
          </v-btn> -->
        <!-- </div>   -->
          <v-card
              class="elevation-16 mx-auto"
              width="300px"
          >
            <v-card-text>
              <v-container grid-list-md>
                    <form @submit.prevent="enterDef">
                        <v-text-field
                          v-model="alias"
                          autofocus
                          browser-autocomplete="new_password"
                          :append-icon="showname ? 'visibility_off' : 'visibility'"
                          :rules="[rules.required]"
                          :type="showname ? 'text' : 'text'"
                          name="input-10-1"
                          required
                          label="Who are you?"
                          hide-details
                          hint="What should we call you?"
                          counter
                          @click:append="toggleVisibility"
                        ></v-text-field>
                    </form>
              </v-container>
            </v-card-text>
            <!-- <v-divider></v-divider> -->
          </v-card>
        </v-dialog>
        <keymessage ref="keydialog" :status="keyMsg" :list="keyList" />
        <keybar 
            @done="hideKeySnack" 
            v-if="keySnack" 
            :anno="anno" 
            :color="lastColor"
        />
        <!-- <snackbar @done="hideSnack" v-if="hasSnack" :text="(lastKey) ? altsnack : snack" :bg="'primary'" :index="roll" :icon="lastKey ? keyicon : null" /> -->
        <popup 
          ref="maindialog"
          :keyList="keyList" 
          @submitRating="submitRating" 
          @submitAltRating="altRating" 
          @submit="prepRoll" 
          @altsubmit="prepKey()" 
          :dialog="dialog" 
          :roll="roll" 
          :wide="widths[roll]" />
        <warning :status="noKeys" @report="endReset"/>
        <loader v-if="loader" @done="nextRoll" :desc="description" :icon="loadIcon[this.roll]" :index="roll" :status="loader" />
        <eyegrid ref="grid" style="position:absolute;" :orientation="$root.$children[0].orientation" />
    </v-container>
    <div dark class="ma-0 pa-0" v-if="alt" id="alt">
      
      
      <!-- <snackbar @done="hideSnack" v-if="hasSnack" :text="(lastKey) ? altsnack : snack" :bg="'primary'" :index="roll" :icon="lastKey ? keyicon : null" /> -->
      <div v-if="isLoading" class="overlap">
        <loadingicon @done="generateMenu" />
      </div>
      <!-- <avatargrid v-show="!isLoading" /> -->
      <touchpad v-show="!isLoading" />

      <keybar 
            @done="hideKeySnack" 
            v-if="keySnack" 
            :anno="anno" 
            :color="lastColor"
        />
    </div>
  </div>
</template>

<script>
  import touchpad from './touchpad'
  import eyegrid from './eyegrid'
  import password from './password'
  import popup from './popup'
  import loader from './loader'
  import keymessage from './keymessage'
  import loadingicon from './loadingicon'
  import keybar from './keybar'
  import snackbar from './snackbar'
  import avatargrid from './avatargrid'
  import warning from './warning'
  import { format } from 'date-fns'
  import db from '@/firebase/init'

  export default {
    components: {
      touchpad,
      keybar,
      eyegrid,
      popup,
      loader,
      snackbar,
      password,
      loadingicon,
      keymessage,
      warning,
      avatargrid,
    },
    data: () => ({
      login: true,
      experience: null,
      rules: { required: value => !!value || 'We must know who you are.', },
      roll: 0,
      anno: null,
      showname: false,
      loader: false,
      hasSnack: false,
      fromEnd: false,
      lastKey: false,
      startTime: null,
      timestamp: null,
      endTime: null,
      noKeys: false,
      keySnack: null,
      keyicon: 'vpn_key',
      keycolor: null,
      dialog: false,
      hardreset: false,
      keyMsg: false,
      // tries: null,
      passwordScreen: false,
      rating: null,
      alias: null,
      avatarURL: null,
      email: null,
      show: false,
      isLoading: true,
      lat: null,
      lng: null,
      password: null,
      toggleNum: 0,
      zoomToggle: false,
      typeList: ['B', 'C', 'D', 'A'],
      keyMax: 3,
      rollmessage: [
        `Please allow us to scan your hardware for malicious entities. You can override this behavior at any time.`,
        `Please give us access to any sensitive information you want to keep hidden.`,
        `We've been watching you, everything seems fine!`,
        `Please authorize us to protect you in dangerous situations when threatened with loss of agency.`
      ],
      keys: {
        red: [],
        green: [],
        white: [],
      },
      keyList: [],
      alt: false,
      widths: [300, 300, 300, 300],
      descriptions: [
        'Installing Eyeware and rune modules',
        'Compressing data',
      ],
      snacks: [
        'HIDE YOUR IDENTITY',
        `Now we can watch you very closely`,
        `Now we know everything about you`,
      ],
      snackIcon: [
        'visibility',
        'group',
      ],
      loadIcon: [
        'security',
        'visibility'
      ]
      
    }),
    computed: {
      description() { return this.descriptions[this.roll]; },
      snack() { return this.snacks[this.roll]; },
      altsnack() { return `obtained ${this.keycolor} key` },
      slug() { return this.alias.toLowerCase().split(' ').join('-'); },
      userlist() { return this.$root.$children[0].userlist },
      lastColor() {
        if (this.keyList.length)
          return this.keyList[this.keyList.length - 1];
        else
          return null;
      },
      avatar() {
        if (this.avatarURL)
          return this.avatarURL;
        else
          return './avatar-1.png';
      },
      hasRequired() {
        if (this.email && this.password && this.avatar)
          return true;
        else
          return false;
      },
      tries() {
        return this.$root.$children[0].tries;
      }
    },
    created() {
      this.checkMode().then((isMode) => {
        this.alt = isMode;
        if (this.alt) {
          this.$root.$children[0].isdark = true;
          setTimeout(() => {
            this.$root.$children[0].showBtn = false;
            this.addKey('grey');
          }, 500)
          // this.$routes.push('messages')
        } else {
          this.show = true;
        }
      });
    },
    mounted() {
      // console.log(this.$children);
      this.startTime = this.getTime();
      this.timestamp = Date.now();
      setTimeout(() => {
        Mainframe.speak(`${JSON.parse(window.localStorage.getItem('mainFrame'))} previous attempt${JSON.parse(window.localStorage.getItem('mainFrame')) > 1 ? 's' : ''}`)
        Mainframe.speak(`SEED > ${this.$root.$children[0].uid}`)
      }, 1000)
      // console.log(this.getTime())    
    },
    methods: {
      getTime() {
        return format(new Date(), 'M[/]D[ at ]HH[:]mm[ ]A')
      },
      endReset() {
        this.fromEnd = true;
        this.reset();
      },
      reset() {
        this.$refs.maindialog.reset();
        this.$refs.passdialog.reset();
        this.$refs.grid.forceClosing();
        // if (!this.fromEnd) {
        //   // this.$refs.grid.playClosing(target);
        //   if (this.roll > 0) {

        //     this.$refs.grid.forceClosing();
        //     // if (this.roll < this.typeList.length) {
        //     //   let target = this.typeList[this.roll]
        //     //   this.$refs.grid.playClosing(target);
        //     //   if (this.roll - 1 >= 0)
        //     //     this.$refs.grid.playClosing(this.typeList[this.roll-1]);
        //     // }
        //   } else {
        //     try {
        //       this.$refs.grid.playClosing(this.typeList[0]);
        //     } catch(err) {
        //       // Do nothing
        //     }
        //   }
        // }
        // CLOSE EYES

        if (!this.hardreset) {
          setTimeout(() => {
          Mainframe.speak(`RELOADING...`)
          this.$root.$children[0].reset();
          this.login = true;
          this.fromEnd = false;
          this.roll = 0;
          this.showname = false;
          this.loader = false;
          this.hasSnack = false;
          this.lastKey = false;

          // this.startTime = null;
          // this.timestamp = null;
          // this.endTime = null;
          this.noKeys = false;
          this.keySnack = null;
          this.keyicon = 'vpn_key';
          this.keycolor = null;
          this.dialog = false;
          this.keyMsg = false;
          // this.tries = null;
          this.passwordScreen = false;
          this.rating = null;
          this.alias = null;
          this.avatarURL = null;
          this.email = null;
          this.isLoading = true;
          this.lat = null;
          this.lng = null;
          this.password = null;
          this.toggleNum = 0;
          this.zoomToggle = false;
          this.show = true;
          this.hardreset = true;
          setTimeout(()=> {
            this.hardreset = false;
          }, 500)
          }, 200)
        }
        

      },
      checkAvatar() {
        // REFACTORED INTO SINGLE QUERY @ this.checkUser()

        // db.collection('members').where('name', '==', this.alias).get()
        // .then(doc => {
        // })
        // let avatarcount = 0;
        // db.collection('members').get()
        //   .then(snapshot => {
        //     snapshot.forEach(doc => {
        //       avatarcount++;
        //         // console.log(`Avatar reads is ${avatarcount}`)
        //           let member = doc.data();
        //           if (member.name == this.alias) {
        //             this.avatarURL = member.avatar;
        //           }
        //       })
        //   }).then(() => {
        //     console.log(`HelloWorld @230: Avatar count reads ${avatarcount} times per page load`)
        //     // 
        //   })
      },
      toggleVisibility() {
        if (this.toggleNum < 5) {
          this.toggleNum++;
          this.showname = !this.showname;
        } else {
          this.alias = 'OBELUS';
          this.avatarURL = 'https://www.valucre.com/uploads/monthly_2019_01/fit.thumb.gif.fc4eebd52c8b2df01eab6afa960bdaa4.gif';
          this.addKey('blue');
          this.enter(true);
          this.$root.$children[0].showBtn = false;
        }
      },
      checkIfUserHasMaster(color) {
        let keys = JSON.parse(window.localStorage.getItem('masterkeys'));
        let err = 0;
        let match = false;
        keys.forEach(key => {
          if (key == color)
            err++

        })
        if (!err) {
          keys.push(color)
          match = true;
        }
        this.$root.$children[0].masterkeys = keys;
        // console.log(this.$root.$children[0].masterkeys);
        window.localStorage.setItem('masterkeys', JSON.stringify(keys));
        if (match)
          return true;
        else
          return false;
      },
      addKey(color) {
        // console.log('Should trigger key message');
        let newKey = this.checkIfUserHasMaster(color);
        if (newKey) {
          this.anno = 'Obtained ' + color + ' key';
          this.keycolor = color;
          this.keyList.push(color);
          this.lastKey = true;
          this.keySnack = true;
          this.logKey();
        }
      },
      logKey() {
        let doc = db.collection('clues').doc(this.keyList[this.keyList.length - 1]).get()
        .then((res) => {
          if (this.tries > 3)
            Mainframe.speak(` Good job! > ${res.data().pass}`)
        });
      },
      generateMenu() {
        this.isLoading = false;
        // console.log('Loading menu is done')
        this.checkAvatar();
      },
      checkGrid() {
        if (this.roll > 0) {
          if (this.roll < this.typeList.length) {
            let target = this.typeList[this.roll]
            // console.log(target)
            this.$refs.grid.playOpening(target);
          }
        } else {
          this.$refs.grid.playOpening(this.typeList[0]);
        }
      },
      enter(alt) {
        // try {
          if (alt) {
            // console.log(`LKCH > ${this.getTime()}`)
            this.$root.$children[0].user = 'null';
            this.login = false;
            this.dialog = true;
            this.checkGrid();
          } else {
            // console.log(`${this.alias} > ${this.getTime()}`)
            this.$root.$children[0].user = this.alias;
            this.login = false;
            this.dialog = true;
            this.checkGrid();
            this.checkAvatar();
            this.checkUser();
          }
      },
      checkUser() {
        if (this.tries > 10)
          this.addKey('orange');
        if (this.alias == this.$root.$children[0].uid) {
            this.addKey('lime');
          }
        this.$root.$children[0].showBtn = false;
        if (this.alias) {
          db.collection('passwords').doc(this.alias).get()
          .then((doc) => {
            if (doc.exists) {
              this.addKey(doc.data().color);
            }
          }).catch((err) => {
            console.log(err)
          })

          this.userlist.forEach(item => {
            if (item.name == this.alias) {
              this.avatarURL = item.avatar;
            }
          })
          
          // db.collection('members').where('name', '==', this.alias).get()
          //   .then(snapshot => {
          //     if (snapshot.docs.length && snapshot.docs[0].exists) 
          //       this.$root.$children[0].avatarURL = snapshot.docs[0].data().avatar;
          //   })
        }
      },
      enterDef() {
        if (this.alias.length > 2) {
          this.$root.$children[0].user = this.alias;
          if (this.tries > 3) {
            Mainframe.speak(`Good to see you ${this.alias}!`);
            Mainframe.speak(this.rollDialog());
          }
          this.$root.$children[0].submitUser = true;
          this.login = false;
          this.dialog = true;
          this.checkGrid();
          this.checkAvatar();
          this.checkUser();
        }
      },
      rollDialog() {
        // console.log(this.roll);
        return this.rollmessage[this.roll];
      },
      getAvatar() {
        try {
          if ((this.avatar) && (/\.(gif|png|jpg)/i.test(this.avatar))) {
            return this.avatar;

          } else {
            if (JSON.parse(window.localStorage.getItem('mainFrame')) < 10) {
              return './avatar-1.png'
            } else if (JSON.parse(window.localStorage.getItem('mainFrame')) < 20) {
              return './avatar-2.png'
            } else {
              return './avatar-3.png'
            }
          }
        } catch(err) {
          console.log('Error')
          console.log(err)
        }
      },
      addPlay() {
        db.collection('meta').doc('playcount').set({total: this.$root.$children[0].totalCount + 1})
      },
      storePass() {
        let result = this.$root.$children[0].password;
        this.passwordScreen = false;
        db.collection('plays').add({
          username: this.alias,
          uid: this.$root.$children[0].uid,
          password: this.$root.$children[0].password,
          rating: this.rating,
          keyList: this.keyList,
          timeelapsed: Date.now() - this.timestamp,
          timestart: this.startTime,
          timeend: this.getTime(),
          time: new Date(),
          tries: JSON.parse(window.localStorage.getItem('mainFrame')),
          avatar: this.avatar,
        })
        this.addPlay();
        this.$children[3].hideKey = true;
        if (this.tries == 3) {
          if (this.keyList.length == 3) {
            this.addKey('teal')
          }
        }
        if (this.keyList.length == 12) {
          this.keyList = [];
        }
        db.collection('keyphrase').where('pass', '==', result).get()
          .then(snapshot => {
              if (snapshot.docs.length) {
                this.addKey(snapshot.docs[0].data().color);
                  // this.hasMatch = true;
                  // this.anno = snapshot.docs[0].data().anno;
              }
              if (this.keyList.length) {
                this.keyMsg = true;
                // console.log('Launch function')
                // console.log(this.$children[2])
                this.$refs.keydialog.launch();
              } else {
                this.noKeys = true;
                if (this.tries > 3)
                  Mainframe.speak(`You have failed this training exercise.`)
              }
          })
        
        // console.log(result)
      },
      passwordGame() {
        // console.log('password game start')
        this.passwordScreen = true;

      },
      submitRating(params) {
        this.rating = params;
        // console.log(params);
        this.prepRoll();
      },
      doRoll() {
        // console.log(this.roll);
        if (this.roll == 1) {
          this.$refs.grid.playFocusing(this.typeList[0])
          this.$refs.grid.playFocusing(this.typeList[1])
        } else if (this.roll == 3) {
          this.$refs.grid.reverseFocusing(this.typeList[0])
          this.$refs.grid.reverseFocusing(this.typeList[1])
        }
        if (this.roll == 2) {
          // console.log('INSERT HERE!')
          this.$root.$children[0].showBtn = true;
          this.$root.$children[0].returnKey = true;
        } else {
          this.$root.$children[0].showBtn = false;
          this.$root.$children[0].returnKey = false;
        }

        this.dialog = false;
        if (this.roll < 2) {
          if (!this.lastKey) {
            this.loader = true;
          } else {
            this.nextRoll();
          }
        } else if (this.roll == 3) {
          this.loader = false;
          this.dialog = false;
          this.hasSnack = false;
          this.passwordScreen = true;
          this.$root.$children[0].locked = true;
          this.passwordGame();
        } else {
          this.nextRoll();
        }
        
      },
      altRating() {
        this.rating = 0;
        this.addKey('cyan');
        this.doRoll();
      },
      prepRoll() {
        this.keycolor = null;
        this.lastKey = false;
        // console.log(`Loading at roll ${this.roll}`)
        this.doRoll();
      },
      prepKey(color) {
        // this.keycolor = color;
        // this.keyList.push(color);
        // this.keys[color].push('');
        // this.lastKey = true;
        this.doRoll();
      },
      nextRoll() {
        if (this.lastKey)
          this.snacks[this.roll] = 'KEY'
        
        if (this.roll < 2)
          this.hasSnack = true;
        this.roll += 1;
        // console.log(this.roll);
        this.loader = false;
        this.dialog = true;
        this.checkGrid();
      },
      hideSnack() {
        this.hasSnack = false;
        // console.log('Hello')
      },
      hideKeySnack() {
        this.keySnack = false;
      },
      checkMode() {
        return new Promise((resolve) => {
          const on = () => resolve(true);
          const off = () => resolve(false);
          const testLocalStorage = () => {
            try {
              if (localStorage.length) off();
              else {
                localStorage.x = 1;
                localStorage.removeItem('x');
                off();
              }
            } catch (e) {
              navigator.cookieEnabled ? on() : off();
            }
          };
          if (window.webkitRequestFileSystem) {
            return void window.webkitRequestFileSystem(0, 0, off, on);
          }
          if ('MozAppearance' in document.documentElement.style) {
            const lb = indexedDB.open('test');
            lb.onerror = on;
            lb.onsuccess = off;
            return void 0;
          }
          if (/constructor/i.test(window.HTMLElement)) {
            return testLocalStorage();
          }
          if (!window.indexedDB && (window.PointerEvent || window.MSPointerEvent)) {
            return on();
          }
          return off();
        });
      },
    }
  }
</script>

<style>

#alt {
  height: 80vh;
}

.overlap {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatarHeader {
  display: flex;
  justify-content: center;
}
.screen {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 14px;
}

.v-input--selection-controls {
  margin-top: 0px;
}
</style>
