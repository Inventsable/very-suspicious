<template>
    <div>
        <div class="grid hidden-sm-and-down">
            <v-container style="z-index:300; height:50vh;">
                <v-expansion-panel>
                    <v-expansion-panel-content
                    v-for="(item,i) in list"
                    :key="i"
                    >
                    <v-icon slot="actions"
                        :color="item.reply ? 'primary' : 'grey'"
                        >{{item.reply ? 'chat' : 'contact_support'}}</v-icon>
                    <div slot="header" class="pr-1 mr-1">
                        <span class="subheading">{{item.message}}</span>
                    </div>
                    <v-card v-if="item.reply">
                        <v-card-text class="grey lighten-3">
                            <v-layout row wrap>
                                <v-flex xs3 sm2 md2 lg1>
                                    <v-avatar>
                                        <v-icon large>visibility</v-icon>
                                    </v-avatar>
                                </v-flex>
                                <v-flex xs9 sm10 md10 lg11 class="pt-3">
                                    {{item.reply}}
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-container>
            <v-container style="z-index:300; height: 45vh;">
                <v-card style="height: 100%;">
                    <v-card-text class="checkFlow pb-3" id="chatbox">
                        <v-list>
                            <v-list-tile
                                v-for="(item,index) in chatFin"
                                :key="index"
                                avatar
                                style="height: 40px;"
                            >
                                <v-list-tile-avatar>
                                    <v-icon>account_circle</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        <span class="subheader darken-1 font-weight-medium">{{item.name}}</span>
                                        <span class="font-weight-light caption mx-1">{{item.time + ': '}}</span>
                                        <span>{{item.msg}}</span>
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="inputLine">
                        <v-layout row wrap>
                            <v-flex xs1 class="autocenter">
                                <v-btn flat fab small @click="newUID">
                                    <v-icon>refresh</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs11 class="px-2">
                                <v-form @submit.prevent="sendMessage">
                                    <v-text-field
                                        v-model="message"
                                        :append-outer-icon="message ? 'send' : ''"
                                        clear-icon="cancel"
                                        :rules="[rules.required]"
                                        clearable
                                        type="text"
                                        @click:append-outer="sendMessage"
                                        @click:clear="clearMessage"
                                    >
                                        <template slot="label">
                                            <!-- <v-icon>account_circle</v-icon> -->
                                            <span class="ml-2">{{uid}}</span>
                                        </template>
                                    </v-text-field>
                                </v-form>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-container>
        </div>
        <div class="gridMobile hidden-md-and-up">
            <div class="mobileAsk hidden-sm-only">
                <v-expansion-panel>
                    <v-expansion-panel-content
                    v-for="(item,i) in treatedAsk"
                    :key="i"
                    >
                    <v-icon slot="actions"
                        :color="item.reply ? 'primary' : 'grey'"
                        >{{item.reply ? 'chat' : 'contact_support'}}</v-icon>
                    <div slot="header" class="pr-1 mr-1">
                        <span class="subheading">{{item.message}}</span>
                    </div>
                    <v-card v-if="item.reply">
                        <v-card-text class="grey lighten-3">
                            <v-layout row wrap>
                                <v-flex xs3 sm2 md2 lg1>
                                    <v-avatar>
                                        <v-icon large>visibility</v-icon>
                                    </v-avatar>
                                </v-flex>
                                <v-flex xs9 sm10 md10 lg11 class="pt-3">
                                    {{item.reply}}
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </div>
            <!-- <v-divider></v-divider> -->
            <div class="mobileChat hidden-xs-only mt-5">
                <v-card flat>
                    <v-card-text class="checkFlow pb-3 mt-4" id="chatboxMobile">
                        <v-list>
                            <v-list-tile
                                v-for="(item,index) in chatFin"
                                :key="index"
                                avatar
                                style="height: 40px;"
                            >
                                <v-list-tile-avatar>
                                    <v-icon>account_circle</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title :style="(/desecrator/i.test(uid) ? 'color: red;' : '')">
                                        <span class="subheader darken-1 font-weight-medium">{{item.name}}</span>
                                        <span class="font-weight-light caption mx-1">{{item.time + ': '}}</span>
                                        <span>{{item.msg}}</span>
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-card>
                <div class="inputLineMobile">
                        <v-layout row wrap>
                            <v-flex xs1 class="autocenter">
                                <v-btn flat fab small @click="newUID">
                                    <v-icon>refresh</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs11 class="px-2">
                                <v-form @submit.prevent="sendMessage">
                                    <v-text-field
                                        v-model="message"
                                        :append-outer-icon="message ? 'send' : ''"
                                        clear-icon="cancel"
                                        :rules="[rules.required]"
                                        clearable
                                        type="text"
                                        @click:append-outer="sendMessage"
                                        @click:clear="clearMessage"
                                    >
                                        <template slot="label">
                                            <!-- <v-icon>account_circle</v-icon> -->
                                            <span class="ml-2">{{uid}}</span>
                                        </template>
                                    </v-text-field>
                                </v-form>
                            </v-flex>
                        </v-layout>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
// import firebase from 'firebase'
import { format } from 'date-fns'

export default {
    name: 'messages',
    data: () => ({
        message: null,
        list: [],
        chatlist: [],
        sendCount: 0,
        rules: { required: value => !!value || 'Cannot send empty message.', },
        chatFin: [],
        chat: [
            {
                name: 'cofferedSaevion',
                msg: 'Hello there how are you',
                timestamp: 152654735432,
                time: '[15:11:54]',
            }
        ],
    }),
    computed: {
       uid() { return this.$root.$children[0].uid; },
       treated() { return this.chatlist.sort((a,b) => { b.timestamp - a.timestamp; }).slice().reverse(); },
       treatedAsk() { return this.list.sort((a,b) => { b.timestamp - a.timestamp; }); },
    },
    methods: {
        newUID() { this.$root.$children[0].getUID(); },
        resortChat() {
            function compare(a, b) {
                const timeA = a.timestamp;
                const timeB = b.timestamp;
                
                let comparison = 0;
                if (timeA > timeB) {
                    comparison = 1;
                } else if (timeA < timeB) {
                    comparison = -1;
                }
                return comparison;
            };
            // this.clearAndReplaceDatabase();
            // console.log('Check this')
            // console.log(this.chatlist);
            // this.chatFin = this.chatlist.sort((a,b) => { a.timestamp - b.timestamp; });
            // return this.chatlist.sort((b,a) => {a.timestamp - b.timestamp});
            this.forceScroll();
            return this.chatlist.sort(compare)
        },
        clearAndReplaceDatabase() {
            // var batch = firebase.firestore().batch()
            // firebase.firestore().collection('chat').listDocuments().then(val => {
            //     val.map((val) => {
            //         batch.delete(val)
            //     })
            //     batch.commit()
            // })
            // .then(() => {
            //     this.chatlist.forEach((doc) => {
            //         db.collection('chat').add(doc).then(() => {
            //         }).catch(err => {console.log(`${err}`)});
            //     })
            // })
        },
        checkChat() {
            while (this.chatlist.length > 10) {
                this.chatlist.shift();
            }
            return this.resortChat();
        },
        getTime() {
            return format(new Date(), '[[]HH[:]mm[:]ss[]]')
        },
        complexicon() {
            let phrases = [
                [`\.{1,}`,''],
                [`\s*`,''],
                [`(\s\d\s)*`,''],
                [`what`, 'Terrenus'],
                ['What', 'Terrenus'],
                ['Who', 'What'],
                ['who', 'what'],
                ['bomb', 'what'],
                ['DON\'', 'DO'],
                ['REPLY', 'GET KEY'],
                ['replies', 'OBELUS'],
                ['reply', 'OBELUS'],
                ['WHAT', 'WE\'VE'],
                ['IS', 'BEEN'],
                ['type', 'Grand Mainframe'],
                ['TESTING', 'BOMBING'],
                ['test', 'bomb'],
                ['red', 'gold'],
                ['blue', 'silver'],
                ['green', 'brown'],
                ['purple', 'green'],
                ['orange', 'teal'],
                ['amber', 'violet'],
                ['key', 'magitech'],
                ['LOL', 'BOMB'],
                ['Lol', 'Bomb'],
                ['ha ', 'bomb'],
                ['lol', 'bomb'],
                ['HAPPENING', 'WATCHING YOU'],
                ['GOING ON', 'WATCHING YOU'],
                ['didn\'t', 'join'],
                ['saying', 'hacking'],
                ['you\'re', 'I\'m'],
                ['you', 'we'],
                ['write', 'Grand Mainframe'],
                ['that', 'soon'],
                ['text', 'obey'],
                ['hello', 'obey'],
                ['fuck', 'bomb'],
                ['happening', 'under attack'],
                ['name', 'attack'],
                ['color', 'bomb'],
                ['weird', 'a bomb'],
                ['console', 'magitech'],
                ['incognito', 'magitech'],
                ['tool', 'magitech'],
                ['browser', 'magitech'],
                ['message', 'attack'],
                ['fuck', 'rubbery'],
                ['talk', 'prayer'],
                ['These', 'What is'],
                ['these', 'Genesaris'],
                ['replace', 'optimize'],
                ['mixing', 'optimizing'],
                ['changing', 'optimizing'],
                ['replacing', 'optimizing'],
                ['switches', 'optimizes'],
                ['switched', 'optimized'],
                ['thread', 'bomb'],
                ['find', 'replace'],
                ['know', `get a key`],
                ['trippy', 'nice'],
                [`\show`, 'can'],
                ['mean', 'attack'],
                ['this', 'Grand Mainframe'],
                ['name', 'duty'],
                [`understand`, 'Grand Mainframe'],
                [`get`, 'Grand Mainframe'],
                [`don\'t`, 'love'],
                ['ask', 'overthrow'],
                ['question', 'Saint-King'],
                [`dont`, 'love'],
                // ['make', 'this'],
                ['sense', 'Grand Mainframe'],
                ['DON\'T', 'SWEAR'],
                ['UNDERSTAND', 'ALLEGIANCE'],
                ['THIS', 'TO GRAND MAINFRAME'],
                ['MIXING', 'OPTIMIZING'],
                ['WORDS', 'ALLIANCE'],
                ['You', 'Terrenus'],
                ['we\s', 'trust\s'],
                ['words', 'recruitment'],
                ['anything', 'OBELUS'],
                ['not', 'true'],
                ['I(?=\s)', 'we'],
                ['\'re', '\'st'],
                ['\'m', '\'re'],
                [`wrong`, 'right'],
                [`speak`, 'know'],
                [`writing`, 'obeying'],
            ]
            let original = this.message;
            for (var i = 0; i < phrases.length; i++) {
                let phrase = phrases[i];
                let rx = new RegExp(phrase[0], 'gim');
                if (rx.test(this.message)) {
                    let match = this.message.match(rx);
                    if (match.length) {
                        for (var e = 0; e < match.length; e++) {
                            var match = match[e];
                            this.message = this.message.replace(phrase[0], phrase[1]);
                        }
                    }
                }
            }
            console.log(`${original} => ${this.message}`);
        },
        sendMessage() {
            this.sendCount++;
            let fake = {
                name: this.uid,
                timestamp: Date.now(),
                time: this.getTime(),
                msg: this.message,
            }
            this.chatFin.push(fake);
            if (!/desecrator|king|eye|inquisitor|storyteller|suan|coconino|duende|mundi|oracle|shadow|tickle/i.test(this.uid)) {
                this.complexicon();
            }
            if (/gutterfiend|prowler|peace|terran|elf|sovereign|prime|rain|tree|forest|snatcher|enrele/i.test(this.uid)) {
                this.message = `WE'VE BEEN WATCHING YOU`
            }
            let child = {
                name: this.uid,
                timestamp: Date.now(),
                time: this.getTime(),
                msg: this.message,
            }
            db.collection('chat').add(child).then(() => {
                this.chatFin = this.checkChat();
            }).catch(err => {console.log(`${err}`)});
            this.message = ' ';
        },
        clearMessage() {
            this.message = null;
        },
        getAsks() {
            // console.log('retrieving asks')
            this.list = [];
            let countasks = 0;
            let ref = db.collection('ask').orderBy('timestamp');
                ref.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    countasks++;
                    // console.log(`Database reads for Q/A: ${countasks}`)
                    if (change.type == 'added') {
                        let doc = change.doc
                        if (doc.data().name !== this.uid)
                           this.list.push(doc.data())
                    }
                });
            })
        },
        forceScroll() {
            let chatbox = document.getElementById("chatbox");
            chatbox.scrollTop = chatbox.scrollHeight + chatbox.clientHeight;
            let mchatbox = document.getElementById("chatboxMobile");
            mchatbox.scrollTop = mchatbox.scrollHeight + mchatbox.clientHeight;
            let scrollCheck = chatbox.scrollHeight - chatbox.scrollTop === chatbox.clientHeight;
            let MscrollCheck = chatbox.scrollHeight - chatbox.scrollTop === chatbox.clientHeight;
            // console.log(`${scrollCheck} : ${MscrollCheck} : ${chatbox.scrollHeight} - ${chatbox.scrollTop} === ${chatbox.clientHeight}`)

        },
        getChats() {
            // console.log('retrieving chat')
            let countchat = 0;
            this.chatlist = [];
            let refx = db.collection('chat').orderBy('timestamp', 'desc').limit(10);
                refx.onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        // console.log(change)
                        countchat++
                        // console.log(`Database reads for chat: ${countchat}`)
                        let doc = change.doc
                        if (doc.data().name !== this.uid) {
                            this.chatlist.unshift(doc.data())
                            let chatbox = document.getElementById("chatbox");
                            chatbox.scrollTop = chatbox.scrollHeight;
                            let mchatbox = document.getElementById("chatboxMobile");
                            mchatbox.scrollTop = mchatbox.scrollHeight;
                            this.chatFin = this.resortChat();
                        }
                        // console.log(chatbox)
                        // console.log(chatbox.scrollTop);
                        // console.log(chatbox.scrollHeight);
                    }
                    this.forceScroll();
                })
            })
            
        }
    },
    created() {
        this.getAsks();
        this.getChats();        
    },
    mounted() {
        // console.log(this.list);
        setTimeout(() => {
            this.$root.$children[0].showBtn = false;
            // console.log(this.uid)
            let chatbox = document.getElementById("chatbox");
            chatbox.scrollTop = chatbox.scrollHeight;
        }, 500);
        // console.log(this.uid)
    }
}
</script>

<style>
.checkFlow::-webkit-scrollbar {
    width: 20px;
}

.autocenter {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}

.checkFlow {
    overflow-y: scroll;
    height: 32vh;
}

.inputLine {
    bottom: 0px;
    position: absolute;
    width: 100%;
    margin-bottom: 0px;
    padding-bottom: 0px;
}

.inputLineMobile {
    /* top: -px; */
    top: 0;
    z-index: 1000;
    position: absolute;
    width: 100%;
    margin-bottom: 0px;
    padding-bottom: 0px;
    /* order: 1; */
}

.grid {
    display: grid;
    width: 100vw;
    height: 100vh;
}
.mobileAsk, .mobileChat {
    max-height: 85vh;
    width: 100vw;
}

.mobileAsk {
    order: 1;
    overflow: scroll;
    padding-bottom: 20px;
}

#chatbox {
    /* height: auto; */
    padding-bottom: 4rem;
}

#chatboxMobile {
    box-sizing: border-box;
    height: 75vh;
    
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 10px;
}

.gridMobile {
    display: grid;
    width: 100vw;
    height: 94vh;
}
</style>
