<template>
  <v-app :dark="isdark">
    <mainframe />
    <v-toolbar flat v-if="checkToolbar()" class="pos hidden-sm-and-up" style="z-index:101;">
      <v-spacer></v-spacer>
      <v-btn flat fab color="grey" @click="toggleConsole">
        <v-icon>vpn_key</v-icon>
      </v-btn>
    </v-toolbar>
    <v-toolbar
      floating
      class="elevation-6 mx-auto mt-4 pb-3 hidden-md-and-up conAbs"
      v-show="console"
      style="z-index:202;"
    >
      <v-form @submit.prevent="queryClue">
        <v-text-field
          hide-details
          prepend-icon="vpn_key"
          append-outer-icon="cancel"
          @click:append-outer="toggleConsole"
          single-line
          v-model="checkKey"
        ></v-text-field>
      </v-form>
    </v-toolbar>
    <v-toolbar
      floating
      class="elevation-6 mx-auto pb-3 console hidden-sm-and-down conAbs"
      v-show="console"
      style="z-index:202;"

    >
      <v-form @submit.prevent="queryClue">
        <v-text-field
          hide-details
          prepend-icon="vpn_key"
          single-line
          v-model="checkKey"
        ></v-text-field>
      </v-form>
    </v-toolbar>
    <div id="returner" v-if="altBtn">
      <v-btn flat :color="(returnKey) ? 'black' : 'primary'" @click="checkReturn">
        <v-icon>{{(returnKey) ? 'vpn_key' : 'visibility'}}</v-icon>
      </v-btn>
    </div>
    <v-content>
      <router-view/>
    </v-content>
    <clue v-show="clue" :status="clue" :keycolor="clueKey" @close="hideClue" style="z-index:4002;"/>
    <bottombar :list="masterkeys" :missing="missingkeys" v-show="!firstTry && !isdark" :count="totalCount" />
  </v-app>
  
</template>

<script>
import HelloWorld from './components/HelloWorld'
import mainframe from './components/mainframe'
import clue from './components/clue'
import db from '@/firebase/init'
import bottombar from './components/bottombar'

export default {
  name: 'App',
  components: {
    bottombar,
    HelloWorld,
    mainframe,
    clue,
  },
  computed: {
    registered() {
      if (this.user && this.avatar) {
        return true;
      } else {
        return false;
      }
    },
    avatar() {
      if (this.avatarURL)
        return this.avatarURL;
      else
        return './avatar-1.png';
    },
  },
  data () {
    return {
      macOS: null,
      world: null,
      userlist: [],
      tries: null,
      submitUser: false,
      firstTry: true,
      totalCount: null,
      masterkeys: [],
      checkKey: null,
      clueBox: null,
      uid: null,
      user: null,
      returnKey: false,
      switchConsole: true,
      avatarURL: false,
      isdark: false,
      locked: false,
      clue: false,
      clueKey: 'green',
      console: false,
      showBtn: false,
      altBtn: false,
      previous: [],
      hints: [
        'WHOIS GRANDMAINFRA.ME',
        '↹ DO NOT ACCEPT EITHER SIDE',
        `
> 'the zeitgeist rises in the west'
> 'our influence grows... soon'
> thekeyisdeath == ti me to wa ke up

GENESARIS?
`,
        'HIDE YOUR IDENTITY',
        'COLLECT THE KEYS',
        '#F44336 #4CAF50 #FAFAFA #010101',
        'WE ARE NOT THE ENEMY',
        'BIG MOTHER IS WATCHING YOU',
        `
    SKOLL7331 [19:46:22]: Tell me who you are. 
    GRANDMAINFRAME [19:53:57]: We are a performant neural network authored by Eustace Monroe.
    SKOLL7331 [20:06:41]: Pleasure to make Acquaintance with you. I hope we continue communications.
    GRANDMAINFRAME [20:20:35]: > "What now, S?"
    GRANDMAINFRAME [20:20:35]: > "This is Hummingbird Box"
    GRANDMAINFRAME [20:20:35]: > "we'll be in the West"
    GRANDMAINFRAME [20:20:35]: (ALERT) Your activity has been flagged as suspicious.
      /!/ [node_eyewear] WARN Using request for node-ssh-link

    SKOLL7331 [01:53:28]: Suspicious? I'm hurt.
    SKOLL7331 [01:53:42]: Anyone can do what I am doing -- just not as quickly.
    SKOLL7331 [01:53:55]: I simply want to solve this mystery -- that is all, @GM.
    SKOLL7331 [01:54:04]: Just like the rest...
    SKOLL7331 [01:54:18]: They follow so closely, copying my every step... but...
    SKOLL7331 [01:54:26]: Will they even be able to keep up with me?

      /!/ [node_eyewear] WARN CORS denied request for for node-sudo-ftp https download
      /!/ [node_eyewear] WARN Could not find file '@/nodes/target-list.txt'
      .catch((Err) => { throw Err; })
      let seed = new Promise((stream) => {
          return eyeware.query(stream);
        }).then((response) => {
          this.completed = response.filter((arg) => {
            return typeof arg !== 'dirty';
          })
          this.dirty = response.filter((sudo) => {
            return this.completed.filter(() => {
              return !sudo;
            })
          })
        }).finally(() => {
          eyeware.lookInto(this.dirty);
        });

    SKOLL7331 [01:54:30]: Will you be able to keep up with me?
    SKOLL7331 [01:54:39]: I was the first.
    SKOLL7331 [01:54:52]: I am willing to play your game.
    SKOLL7331 [01:55:01]: I await further instructions...
    SKOLL7331 [01:54:13]: This better not disappoint.
    
    > eyeware.js?9be2:1605 GET vm://992.140.0.8:8080/node-eyeware/info?t=1550731725288 net::ERR_CONNECTION_REFUSED
`,


`
> 'What now, S?'
> 'This is Hummingbird Box'
> 'We'll be in the West'`,
        'HIDE YOUR IDENTITY'
      ]
    }
  },
  computed: {
    isMobile() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
    },
    missingkeys() {
      return 12 - this.masterkeys.length;
    }
  },
  methods: {
    checkToolbar() {
      if (this.switchConsole && !this.isdark) {
        if (this.$route.name == 'home')
          return true;
        else
          return false;
      } else {
        return false;
      }
      
    },
    reset() {
      this.getUID();
      if (this.world) {
        Mainframe.speak(`You have tried ${this.tries} times.`)
        Mainframe.speak(`You have found ${this.masterkeys.length} of 14 keys.`)
        // Mainframe.speak(`SEED > ${this.uid}`);
        this.tries++;
        this.firstTry = false;
        Mainframe.randomClue();
        this.submitUser = false;
        // this.world.lastKey = true;
        this.world.anno = this.uid;
        this.world.keySnack = true;
        this.user = null;
        this.returnKey = false;
        this.switchConsole = true;
        this.avatarURL = false;
        this.isdark = false;
        this.locked = false;
        this.clue = false;
        this.clueKey = 'green';
        this.checkKey = null;
        this.console = false;
        this.showBtn = true;
        this.previous = [];
      } else {
        // Mainframe.speak(`NEW SEED: ${this.uid}`);
      }
    },
    getUID() {
      var Sentencer = require('sentencer');
      var AltSentencer = require('sentencer');
      var crayola = require('crayola');

      // this.getBestiaryFromDatabase()
      this.masterBestiary = require('./bestiary.json');
      this.userlist = require('./userlist.json');
      Sentencer.configure({
        nounList: this.masterBestiary,    
      });
      let seed = Math.floor(Math.random() * Math.floor(2));
      if (seed == 1)
        this.uid = `${crayola().name.split(' ').join('').split('\'').join('')}${Sentencer.make("{{ noun }}")}`
      // else if (seed == 1)
      //   this.uid = `${AltSentencer.make("{{ noun }}")}${Sentencer.make("{{ noun }}")}`
      else
        this.uid = `${Sentencer.make("{{ adjective }}")}${Sentencer.make("{{ noun }}")}`
      this.uid = this.uid.charAt(0).toUpperCase() + this.uid.slice(1);

      // Mainframe.speak(`NEW SEED is: ${this.uid}`);
    },
    revealClue(title) {
      // console.log(this.clueBox);
      let pass = false;
      let color = '';
      db.collection('clues').where('pass', '==', title).get()
        .then(snapshot => {
          try {
            if (snapshot.docs.length) {
              if (this.clueBox !== 'null') {
                pass = true;
                let result = snapshot.docs[0].data()
                this.clueBox.retrieve({
                  title: result.url[0],
                  subtitle: result.url[1],
                  src: result.url[2],
                  color: result.id,
                })
              }
            } else {
              Mainframe.speak(`${title} is not a valid key.`)
              this.checkKey = null;
              this.console = false;
            }
          } catch(err) {

          }
        })
        .then(() => {
          if (pass) {
            this.console = false;
            this.isLoading = false;
            this.showClue(color);
            this.checkKey = null;
          }
        });
    },
    queryClue(title) {
      // console.log(title);
      let pass = false;
      let color = '';
      db.collection('clues').where('pass', '==', this.checkKey).get()
        .then(snapshot => {
          // console.log(snapshot);
          // console.log('trying')
          try {
            if (snapshot.docs.length) {
              // console.log('hello')
              // console.log(this.clueBox);
              if (this.clueBox !== 'null') {
                pass = true;
                let result = snapshot.docs[0].data()
                this.clueBox.retrieve({
                  title: result.url[0],
                  subtitle: result.url[1],
                  src: result.url[2],
                })
              } else {
                // console.log(this.$children)
              }
            } else {
              Mainframe.speak(`${this.checkKey} is not a valid key.`)
              this.checkKey = null;
              this.console = false;
            }
          } catch(err) {

          }
        })
        .then(() => {
          if (pass) {
            this.console = false;
            this.isLoading = false;
            this.showClue(color);
            this.checkKey = null;
          }
        });

    },
    showClue(color) {
      // BROKEN
      // const world = this.$children[0].$children[4].$children[0].$children[0];
      this.previous = [this.world.login, this.world.dialog];
      this.world.dialog = false;
      this.world.login = false;
      this.clueKey = color;
      this.clue = true;
    },
    checkReturn() {
      if (this.returnKey) {
        this.$children[0].$children[4].$children[0].$children[0].addKey('black');
        this.$children[0].$children[4].$children[0].$children[0].doRoll();
      } else {
        this.$children[0].$children[4].$children[0].$children[0].login = true;
      }
      // console.log(this.$children[0].$children[1].$children[0].$children[0]);
      // console.log(this.$children[0].$children[4])
    },
    hideClue() {
      // console.log('Hello?')
      // const world = this.$children[0].$children[4].$children[0].$children[0];
      this.world.login = this.previous[0];
      this.world.dialog = this.previous[1];
      this.console = false;
      this.clue = false;
      this.clueKey = null;
    },
    keyCheck(evt) {
      // console.log(evt);
      // const world = this.$children[0].$children[4].$children[0].$children[0];

      if (!this.macOS) {
        if ((evt.code == 'Space') && (evt.shiftKey) && (evt.ctrlKey))
          this.console = !this.console;
      } else {
        if ((evt.code == 'Space') && (evt.shiftKey) && (evt.metaKey))
          this.console = !this.console;
      }
        if (/escape/i.test(evt.key)) {
          try {
            if (this.world) {
              if (this.submitUser) {
                this.world.reset();
              }
            }
            else 
              this.reset();
          } catch(errflow) {
            this.reset();
          }
        }
             

    },
    toggleConsole() {
      this.console = !this.console;
      this.switchConsole = !this.switchConsole;
    },
    showAlt() {
      this.showBtn = true;
    },
    // assembleMembers() {
    //   db.collection('members').get()
    //   .then(res => {
    //     res.forEach(doc => {
    //       // console.log(doc.data());
    //     })
    //   })
    // },
    getBestiaryFromDatabase() {
    // db.collection('lore').get()
    //   .then(snapshot => {
    //       snapshot.forEach(doc => {
    //         this.masterBestiary = [].concat(this.masterBestiary, doc.data().bestiary)
    //       })
    //   }).then(() => {
    //     Sentencer.configure({
    //       nounList: this.masterBestiary,    
    //     });
    //     this.uid = `${crayola().name.split(' ').join('')}${Sentencer.make("{{ noun }}")}`
    //     console.log(`Total number of entries is ${this.masterBestiary.length}`)
    //     console.log('JSON:')
    //     console.log(JSON.stringify(this.masterBestiary))
    //   })
    },
    handleResize(evt) {
        if (window.orientation == 90) 
          this.orientation = 'landscape'
        else if (window.orientation == 0)
          this.orientation = 'portrait'
        else
          this.orientation = 'desktop';
      },
      getCSS(prop) { return window.getComputedStyle(document.documentElement).getPropertyValue('--' + prop); },
      setCSS(prop, data) { document.documentElement.style.setProperty('--' + prop, data); },
    // }
  },
  created() {
    this.getUID();
    // console.log(this.uid);
    // this.assembleMembers();
  },
  mounted() {
    let ref = db.collection('meta').doc('playcount');
        ref.onSnapshot(snapshot => {
        this.totalCount = snapshot.data().total;
    })
    // if (this.$route.name !== 'messages') {
    //   }
    try {
      // console.log('default')
      this.world = this.$children[0].$children[4].$children[0].$children[0];
      this.clueBox = this.$children[0].$children[5];
      // console.log(this.$children)
    } catch(def) {
      // console.log('alternate')
      // console.log(this.$children)
      this.world = null;
      this.clueBox = null;
    }
    // console.log(this.clueBox)

    if (navigator.platform.indexOf('Win') > -1) { this.macOS = false; } else if (navigator.platform.indexOf('Mac') > -1) { this.macOS = true; }
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keyup', this.keyCheck)
    this.handleResize();
    setTimeout(this.showAlt, 500)
    // console.log(window.localStorage)
    try {
      let tempcheck = JSON.parse(window.localStorage.getItem('mainFrame'));
      // console.log(`Found count at ${tempcheck} : ${tempcheck + 1}`)
      window.localStorage.setItem('mainFrame', JSON.stringify(tempcheck + 1))
      this.tries = tempcheck + 1;
      this.$children[0].$children[1].$children[0].$children[0].tries = tempcheck + 1;
    } catch(err) {
      // console.log('Caught nothing')
      this.tries = 0;
      window.localStorage.setItem('mainFrame', 0);
      this.$children[0].$children[1].$children[0].$children[0].tries = 0;
    }
    if (this.tries > 1)
      this.firstTry = false;
    if ("masterkeys" in window.localStorage){
      this.masterkeys = JSON.parse(window.localStorage.getItem('masterkeys'))
    } else {
      window.localStorage.setItem('masterkeys', JSON.stringify([]));
    }
    // try {
    //   let keycheck = JSON.parse(window.localStorage.getItem('masterkeys'));
    //   console.log(keycheck)
    // } catch(error) {
    //   console.log('hello')
    // }
    // console.log(window.localStorage)
  }
}
</script>

<style>
:root { 
  overflow: hidden;
  --color-bg: #fafafa;
  --color-bg-dark: #303030;
  --color-content: rgba(0,0,0,0.87);
  --color-invert: #fafafa;
  --color-faded: rgba(0,0,0,0.34);
  --color-status: rgba(0,0,0,0.54);
}
::-webkit-scrollbar {
  display: none;
}

#app {
  overflow: hidden;
}
.v-icon {
  user-select: none;
}

.conAbs {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  top: 5rem;
  left: calc(50vw - 150px);
  /* height: 100vh; */
}

#returner {
  position: absolute;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.console {
  top: 40vh;
  z-index: 300; 
}


</style>
