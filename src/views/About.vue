<template>
  <v-layout row>
    <v-flex xs12 class="ma-3" style="z-index:103;">
      <v-card>
        <v-list subheader>
          <v-toolbar dense flat color="grey darken-2">
            <v-toolbar-title class="white--text">{{totalCount}} attempts</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon color="white" class="pr-2">visibility</v-icon>
          </v-toolbar>
          <v-container fluid grid-list-md v-if="list.length">
            <v-layout row wrap>
              <v-flex v-for="(person,key) in byTime" :key="key" xs4 sm4 md4 lg4 class="hidden-md-and-up">
                <!-- <img :src="`https://randomuser.me/api/portraits/men/${i + 20}.jpg`" class="image" alt="lorem" width="100%" height="100%"> -->
                  <div style="display:flex;justify-content: center;flex-wrap:wrap;">
                    <v-avatar size="50" class="grey lighten-2" style="width:100%;">
                        <img :src="(!person.avatar) ? './avatar-1.png' : person.avatar" alt="profile pic">
                    </v-avatar>
                    <v-subheader
                      style="width:100%;display:flex;justify-content:center;"
                      class="hidden-sm-only"
                      v-if="person.username"
                    >
                      {{ person.username }}
                    </v-subheader>
                    <v-subheader
                      style="width:100%;display:flex;justify-content:center;font-size:1.5rem;"
                      class="hidden-xs-only"
                      v-if="person.username"
                    >
                      {{ person.username }}
                    </v-subheader>
                  </div>
                  <!-- <span>{{person.password}}</span> -->
                  <v-spacer></v-spacer>

                  <div style="display:flex;justify-content: flex-end;">
                    <v-icon small v-for="(rate, num) in person.rating" :key="num" color="grey darken-1">visibility</v-icon>
                  </div>
                  <v-spacer></v-spacer>
                  <div style="display:flex;justify-content: flex-end;" class="mr-3">
                    <v-icon small v-for="(match, digit) in person.keyList" :key="digit" :color="match">vpn_key</v-icon>
                  </div>
                  <!-- <v-spacer></v-spacer> -->
                  <!-- <span style="display:flex;justify-content: flex-end;">{{person.tries}}</span> -->
              </v-flex>
              <v-flex v-for="(person,altkey) in byTime" :key="altkey + 'a'" xs4 sm4 md4 lg4 class="listItem hidden-sm-and-down">
                <!-- <img :src="`https://randomuser.me/api/portraits/men/${i + 20}.jpg`" class="image" alt="lorem" width="100%" height="100%"> -->
                  <v-avatar size="30" class="grey lighten-2">
                      <img :src="(!person.avatar) ? './avatar-1.png' : person.avatar" alt="profile pic">
                  </v-avatar>
                  <v-subheader
                    v-if="person.username"
                    :key="person.username"
                  >
                    {{ person.username }}
                  </v-subheader>
                  <!-- <span>{{person.password}}</span> -->
                  <v-spacer></v-spacer>

                  <div>
                    <v-icon small v-for="(rate, num) in person.rating" :key="num" color="grey darken-1">visibility</v-icon>
                  </div>
                  <v-spacer></v-spacer>
                  <div class="mr-3">
                    <v-icon small v-for="(match, digit) in person.keyList" :key="digit" :color="match">vpn_key</v-icon>
                  </div>
                  <!-- <span>{{person.tries}}</span> -->
                  <!-- <v-spacer></v-spacer> -->
              </v-flex>
            </v-layout>
          </v-container>
        </v-list>
      </v-card>
    </v-flex>
    <div id="hidden" class="mt-4">
      <v-btn outline color="teal" @click="hiddenKey">
        <v-icon>vpn_key</v-icon>
      </v-btn>
    </div>
    <keybar 
        @done="hideKeySnack" 
        v-if="foundKey" 
        anno="Obtained teal key" 
        color="teal"
    />
  </v-layout>
</template>

<script>
import db from '@/firebase/init'

export default {
  name: 'about',
  created() {
    this.list = require('@/masterPlays1.json');
    let ref = db.collection('plays').orderBy('time');
      ref.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type == 'added') {
            let doc = change.doc
            this.list.push({
              uid: doc.data().uid,
              masterkeys: doc.data().masterkeys,
              username: doc.data().username, 
              password: doc.data().password, 
              rating: doc.data().rating, 
              keyList: doc.data().keyList, 
              avatar: doc.data().avatar, 
              tries: doc.data().tries, 
              timeelapsed: doc.data().timeelapsed,
              timestart: doc.data().timestart,
              timeend: doc.data().timeend,
              time: doc.data().time,
            })
          }
        });
      })
  },
  computed: {
    byTime() {
      return this.list.sort((b, a) => b.time - a.time).reverse()
    },
    totalCount() {
      return this.$root.$children[0].totalCount;
    }
  },
  data: () => ({
    list: [],
    masterPlays: [],
    foundKey: false,
  }),
  mounted() {
    // this.getPlaysFromDatabase();
    // this.masterPlays = ;
  },
  methods: {
    // getPlaysFromDatabase() {
    // db.collection('plays').get()
    //   .then(snapshot => {
    //       snapshot.forEach(doc => {
    //         this.masterPlays = [].concat(this.masterPlays, doc.data())
    //       })
    //   }).then(() => {
    //     console.log(`Total number of entries is ${this.masterPlays.length}`)
    //     console.log('JSON:')
    //     console.log(JSON.stringify(this.masterPlays))
    //   })
    // },
    hideKeySnack() {
      this.foundKey = false;
    },
    hiddenKey() {
      // this.$root.$children[0].$children[0].$children[4].$children[0].$children[0].addKey('indigo')
      let doc = db.collection('clues').doc('teal').get()
        .then((res) => {
          Mainframe.speak(` //!// URGENT //!//
  YOUR ACTION IS REQUIRED > ${res.data().pass}`)
        });
    }
  }
}
</script>

<style>
.listItem {
  display: flex;
  align-items: baseline;
  padding: 0px 5px;
}

body {
  height: 100vh;
  overflow: scroll;
}

#hidden {
  z-index: 102;
  position: absolute;
  width: 100vw;
  height: 9.5vh;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
