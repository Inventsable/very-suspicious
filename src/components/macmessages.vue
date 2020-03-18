<template>
    <div>
        <div class="gridMobile hidden-md-and-up">
            
            <!-- <v-divider></v-divider> -->
            <div class="mobileChat mt-5">
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
                    
                </v-card>
                <div class="inputLineMobile">
                        <v-layout row wrap>
                            <v-flex xs12 class="px-2">
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
import { format } from 'date-fns'

export default {
    name: 'messages',
    data: () => ({
        message: null,
        list: [],
        chatlist: [],
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
       treated() {
           return this.chatlist.sort((a,b) => { b.timestamp - a.timestamp; }).slice().reverse();
        //    const reverse = order => order.map(Array.prototype.pop, [...order])
        //    return reverse;
       },
       treatedAsk() {
           return this.list.sort((a,b) => { b.timestamp - a.timestamp; });
       },
    },
    methods: {
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
            // console.log('Check this')
            // console.log(this.chatlist);
            // this.chatFin = this.chatlist.sort((a,b) => { a.timestamp - b.timestamp; });
            // return this.chatlist.sort((b,a) => {a.timestamp - b.timestamp});
            return this.chatlist.sort(compare)
        },
        checkChat() {
            while (this.chatlist.length > 10) {
                this.chatlist.shift();
            }
            // console.log('Initial check:')
            // console.log(this.resortChat());
            return this.resortChat();
        },
        getTime() {
            return format(new Date(), '[[]HH[:]mm[:]ss[]]')
        },
        sendMessage() {
            
            let child = {
                name: this.uid,
                timestamp: Date.now(),
                time: this.getTime(),
                msg: this.message,
            }
            db.collection('chat').add(child).then(() => {
                // resort chat
                // console.log('successful')
                // console.log(child)
                this.chatFin = this.checkChat();

                // console.log(`[${this.getTime()}]: ${content} > GM`)
            }).catch(err => {console.log(`${err}`)});
            // console.log(child)
            this.message = ' ';
        },
        clearMessage() {
            this.message = null;
        },
        getAsks() {
            // console.log('retrieving asks')
            this.list = [];
            let ref = db.collection('ask').orderBy('timestamp');
                ref.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let doc = change.doc
                        this.list.push(doc.data())
                    }
                });
            })
        },
        getChats() {
            // console.log('retrieving chat')
            this.chatlist = [];
            let refx = db.collection('chat').orderBy('timestamp', 'desc').limit(10);
                refx.onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let doc = change.doc
                        this.chatlist.unshift(doc.data())
                        let chatbox = document.getElementById("chatbox");
                        chatbox.scrollTop = chatbox.scrollHeight;
                        let mchatbox = document.getElementById("chatboxMobile");
                        mchatbox.scrollTop = mchatbox.scrollHeight;
                        this.chatFin = this.resortChat();
                        // console.log(chatbox)
                        // console.log(chatbox.scrollTop);
                        // console.log(chatbox.scrollHeight);
                    }
                });
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
