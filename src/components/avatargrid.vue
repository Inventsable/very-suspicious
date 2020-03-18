<template>
  <v-layout row>
    <caution @submit="doOverwrite" :status="caution" :name="chosen" :wide="300" display="hidden-sm-and-up"/>
    <!-- <caution :status="caution" :name="chosen" :wide="500" display="hidden-md-and-down"/> -->
    <!-- <snackbar @done="hideSnack" v-if="hasSnack" :text="msg" :bg="'primary'" :index="0" :icon="keyicon" /> -->
    <v-container v-if="isInfiniteLoading">
        <div class="testSubject">
            <span class="title subject" style="display: flex;justify-content:center;">Your request is being processed</span>
            <wrench classname="loadwrench"/>
        </div>
        <div style="color: #303030;">{{secret}}</div>
    </v-container>
    <skullbar 
        @done="hideSnack" 
        v-if="hasSnack" 
        :anno="chainAnno" 
        color="grey darken-4"
    />
    <v-flex xs12 v-if="!hasMatch">
      <v-card>
        <v-toolbar flat>
          <v-btn icon @click="noBack">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="hidden-xs-only">
              <span class="px-3" v-for="title in titles" :key="title.text" :style="getStyle(title)">{{title.text}}</span>
          </v-toolbar-title>
          <v-toolbar-title class="hidden-sm-and-up" id="mobileNav">
              <div v-for="(tab, key) in titles" :key="key" class="px-1">
                <span v-if="tab.state" :style="getStyle(tab)">{{tab.text}}</span>
                <v-icon v-else>{{tab.icon}}</v-icon>
              </div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="customLine hidden-xs-only" v-if="colorList">
              <div v-for="(color, key) in colorList" :key="key" :style="checkOrb(color)"></div>
          </div>
          <div class="customLine hidden-sm-and-up" v-if="colorList">
              <div v-for="(color, key) in colorList" :key="key" :style="checkOrbMin(color)"></div>
          </div>
          <v-btn icon class="hidden-xs-only">
            <v-icon>{{titles[step].icon}}</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex v-for="(person,key) in list" :key="key" xs4 sm3 md2 lg1 xs1 class="customAvatar">
              <!-- <img :src="`https://randomuser.me/api/portraits/men/${i + 20}.jpg`" class="image" alt="lorem" width="100%" height="100%"> -->
                <v-btn outline fab large @click="select(person)">
                    <v-avatar size="70" class="grey lighten-2">
                        <img :src="(caution) ? './avatar-1.png' : person.avatar" alt="profile pic">
                    </v-avatar>
                </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
        <v-footer class="mt-2"></v-footer>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import db from '@/firebase/init'
import snackbar from './snackbar'
import caution from './caution'
import skullbar from './skullbar'
import wrench from './wrench'

export default {
    name: 'avatargrid',
    components: {
        snackbar,
        wrench,
        caution,
        skullbar,
    },
    data: () => ({
        list: [],
        // total: [],
        step: 0,
        hasSnack: false,
        secret: 'Hello world',
        hasMatch: false,
        keyicon: 'vpn_key',
        isInfiniteLoading: false,
        msg: '',
        chainAnno: [],
        colorList: [],
        chain: [],
        caution: false,
        chainColor: ['primary', 'accent', 'error'],
        titles: [
            {
                text: 'Find',
                state: true,
                color: 'primary',
                icon: 'search',
            },
            {
                text: 'Save',
                state: false,
                color: 'primary',
                icon: 'save_alt',

            },
            {
                text: 'Overwrite',
                state: false,
                color: 'error',
                icon: 'cancel',
            }
        ]
    }),
    created() {
        let avatarcount = 0;
        console.log('Avatar grid is created')
        // this.getUserListFromDatabase();
        this.getUserListFromJSON()
    },
    computed: {
        chosen() {
            if (this.chain.length == 3)
                return this.chain[2];
            else
                return 'This user'
        },
        userlist() {
            return this.$root.$children[0].userlist;
        }
    }, 
    methods: {
        getUserListFromJSON() {
            this.userlist.forEach(user => {
                this.list.push({
                    name: user.name,
                    avatar: user.avatar,
                    state: false,
                }) 
            })
        },
        // getUserListFromDatabase() {
        //     db.collection('userlist').get()
        //     .then(snapshot => {
        //         snapshot.forEach(doc => {
        //             avatarcount++;
        //             console.log(`avatar reads: ${avatarcount}`)
        //             let member = {
        //                 name: doc.id,
        //                 avatar: doc.data().avatar,
        //             }
        //             this.list.push(member);
        //         })
        //     }).then(() => {
        //         this.total = this.list;
        //         console.log(JSON.stringify(this.total));
        //     })
        // },
        doOverwrite() {
            this.caution = false;
            this.hasMatch = true; 
            this.isInfiniteLoading = true;
            // this.$route.push('touchpad');
            // location.reload();
        },
        arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length)
                return false;
            for (var i = arr1.length; i--;) {
                if(arr1[i] !== arr2[i])
                    return false;
            }

            return true;
        },
        seek() {
            this.colorList.push('white');
            // console.log(this.chain)
            // let match = null;
            // if (this.chain.length == 3) {
            //     this.hasMatch = false;
            //         // .then(snapshot => {
            //     // db.collection('passwords').document('finder').get()
            //     db.collection('passwords').doc('finder').get()
            //         .then(snapshot => {
            //             console.log(snapshot.data())
            //             if (this.arraysEqual(snapshot.data().beta, this.chain)) {
            //                 // console.log('matching')
            //                 match = 'red';
            //             } else if (this.arraysEqual(snapshot.data().gamma, this.chain)) {
            //                 // console.log('matching')
            //                 match = 'blue';
            //             }
            //         }).then(() => {
            //             if (match) {
            //                 this.colorList.push(match);
            //             }
            //             this.chain = [];
            //         })
            // }
            // console.log(this.chain)



            // db.collection('passwords').get()
            // .then(snapshot => {
            //     snapshot.forEach(doc => {
            //         console.log(doc)
            //         let result = doc.data();
            //         if (doc.id == 'finder') {
            //             if (this.chain[this.step - 1] == result.beta[this.step - 1])
            //                 match = 'red'
            //             if (this.chain[this.step - 1] == result.gamma[this.step - 1])
            //                 match = 'green'
            //             console.log(match)
            //         }
            //     })
            // }).then(() => {
            //     this.colorList.push(match)
            // })
        },
        checkOrb(color) {
            return `
                border-radius: 24px;
                width: 16px;
                height: 16px;
                margin: 0px 10px;
                background-color: ${color};
            `
        },
        checkOrbMin(color) {
            return `
                border-radius: 24px;
                width: 16px;
                height: 16px;
                margin: 0px 2px;
                background-color: ${color};
            `
        },
        findChain() {
            let anno = [];
            // console.log(`${this.step}`)
            for (var i = 0; i <= this.step; i++) {
                anno.push({
                    text: `${this.chain[i]}`,
                    icon: `${this.titles[i].icon}`,
                })
                // var  = this.step
            }
            return anno;
        },
        noBack() { alert('No going back now.') },
        hideSnack() { this.hasSnack = false; },
        clearSelected() {
            for (var e = 0; e < this.titles.length; e++) {
                var title = this.titles[e];
                title.state = false;
            }
            for (var i = 0; i < this.list.length; i++) {
                var child = this.list[i];
                child.state = false;
            }
        },
        select(person) {
            if (this.step !== this.chainColor.length - 1)
                this.msg += `${this.titles[this.step].text} ${person.name} : `;
            else
                this.msg += `${this.titles[this.step].text} ${person.name}`;
            // this.titles[0].state = false;
            this.chain.push(person.name);
            this.chainAnno = this.findChain();
            // console.log(this.chainAnno);
            this.seek();
            this.clearSelected();
            if (this.step == this.chainColor.length - 1) {
                this.caution = true;
            } else {
                this.hasSnack = true;
                person.state = true;
                this.step++;
                this.titles[this.step].state = true;
                // console.log(this.step);
            }
        },
        getStyle(title) {
            return `
                text-decoration: ${(title.state) ? 'underline' : 'none'};
            `;
        },
        colorify(person) {
            let err = 0;
            for (var i = 0; i < this.chain.length; i++) {
                var link = this.chain[i];
                if (link.name == person.name)
                    err = i;
            }
            if (err) {
                person.color = this.chainColor[err];
            } else {
                person.color = 'white';
            }
        }
    }

}
</script>

<style>
#mobileNav {
    width: 200px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    /* direction: column; */
}
.customAvatar {
    display: flex;
    justify-content: center;
    align-items: center;
}

.testSubject {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.subject {
    width: 100%;
}

.loadwrench {
    width: 300px;
}

.customLine {
    display: flex;
    justify-content: center;
}
</style>
