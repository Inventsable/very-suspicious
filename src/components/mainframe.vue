<template>
    <div></div>
</template>

<script>
import { format } from 'date-fns'
import db from '@/firebase/init'

export default {
    name: 'mainframe',
    data: () => ({
        collected: [],
        count: [],
        isLoading: false,
        questions: [],
        random: [],
        isAuth: false,
        lastMsg: null,
    }),
    computed: {
        uid() {
            return this.$root.$children[0].uid;
        }
    },
    created() {
        this.isLoading = true;
        // this.speak(`ONLINE: SEED > ${this.$root.$children[0].uid}`);
        db.collection('dialogue').doc('clue').get()
            .then(snapshot => {
                this.random = snapshot.data().random;
            })
        setTimeout(() => {
            this.isLoading = false;
        }, 1000)
        let ref = db.collection('console')
            ref.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type == 'added') {
                    if (!this.isLoading) {
                        let message = change.doc.data();
                        if (message.timestamp < this.getMoment()) {
                            if (message !== this.lastMsg) {
                                if (!message.auth)
                                    this.speak(message.content, message.name)
                                else    
                                    this.speak(message.content, message.name, true);
                                this.lastMsg = message;
                            }
                        }
                    }
                }
            });
        })
    },
    methods: {
        speak(...args) {           
            if (arguments.length > 1) {
                if (arguments.length == 2)
                    return console.log(`${args[1]} [${this.getTime()}]: ${args[0]}`)
                else
                    return console.log(`GM [${this.getTime()}]: ${args[0]}`) 
            } else {
                return console.log(`GM [${this.getTime()}]: ${args[0]}`)
            }
        },
        console(...args) {
            let child = {
                name: this.uid,
                timestamp: Date.now(),
                time: this.getTime(),
                content: args[0],
            }
            if (args.length > 1)
                child.auth = true;
            else
                child.auth = false;
            db.collection('console').add(child).then(() => {
                // Was done
            }).catch(err => {console.log(`${err}`)});
        },
        randomClue() {
            let rand = this.getRandom(this.random.length);
            this.speak(this.random[rand]);
            this.speak(`SEED > ${this.uid}`);
        },
        getMoment() {
            return Date.now();
        },
        findMe() {
            if (navigator.geolocation) {
            // console.log(navigator.geolocation.getCurrentPosition())
                navigator.geolocation.getCurrentPosition(pos => {
                    this.lat = pos.coords.latitude;
                    this.lng = pos.coords.longitude;
                    this.ifKeyLocation();
            }, (err) => {
                    console.log(err);
                    // this.noLocation();
                }, { maximumAge: 60000, timeout: 3000 })
            } else {
            alert('WHOIS GRANDMAINFRA.ME')
            }
        },
        ifKeyLocation() {
            const self = this;
            let count = 0;
            db.collection('passwords').doc('location').get()
            .then(doc => {
                let result = doc.data();
                if (doc.id == 'location') {
                    if ((result.beta[0] == self.lat) && (result.beta[1] == self.lng)) {
                        this.unlocked = true;
                        this.$root.$children[0].world.addKey('indigo');
                    }
                }
            }).then(() => {
                this.speak(`Your current location is [lat: ${this.lat}, lng: ${this.lng}]`);
            })
        },
        ask(content) {
            if (content) {
                db.collection('ask').add({
                    message: content,
                    time: this.getTime(),
                    reply: null,
                    timestamp: Date.now(),
                    name: this.$root.$children[0].uid,
                }).then(() => {
                    console.log(`[${this.getTime()}]: ${content} > GM`)
                }).catch(err => {console.log(`GM [${this.getTime()}]: ${err}`)});
            } else {
                console.log(`GM [${this.getTime()}]: Your message was empty.`)
            }
        },
        override() {
            console.log('You are not yet authorized to override.')
        },
        // find(name) {
        //     if (/obelus/i.test(name)) {
        //         console.log('WE CANNOT FIND OBELUS.')
        //     } else {
        //         this.speak(`Dispatching listeners for ${name}...`)
        //     }
        // },
        hint() {
            if (this.count.length < 9) {
                let rand = this.getRandom(10);
                this.count.push(rand);
                if (rand !== 0) {
                    console.log(`GM [${this.getTime()}]:
                           ${this.$root.$children[0].hints[rand]}`)
                } else {
console.log(`GM [${this.getTime()}]:
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@&%(*,,.....,*/#%@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@&(........................*#@@@@@@@@@@@@@@@@
@@@@@@@@@@@&/................................,#@@@@@@@@@@@@
@@@@@@@@&*..................,,,..................#@@@@@@@@@
@@@@@@%................#@@@@@@@@@@&*...............*@@@@@@@
@@@@#...............,@@@@@@@@@@@@@@@@#...............*@@@@@
@@&................#@@@@@@@@@@@@@@@@@@@,...............(@@@
@(................#@@@@@@&,.....(@@@@@@@.................&@
,.................@@@@@@#........,@@@@@@#.................#
.................,@@@@@@*.........&@@@@@%..................
(.................&@@@@@%........*@@@@@@(.................&
@%................/@@@@@@@#,...*&@@@@@@&................*@@
@@@/...............*@@@@@@@@@@@@@@@@@@%................%@@@
@@@@@,...............#@@@@@@@@@@@@@@@,...............#@@@@@
@@@@@@@/...............,#@@@@@@@@&/................%@@@@@@@
@@@@@@@@@%,.....................................(@@@@@@@@@@
@@@@@@@@@@@@&*..............................,#@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@,...................../%@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@&%######%%&@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`)
                }
            } else {
                console.log(`GM [${this.getTime()}]: ....................................`)
            }
            // console.log(this.$root.isdark)
        },
        getRandom(max) {
            let num = Math.floor((Math.random() * max));
            this.collected = this.count.filter(digit => {
                return num == digit;
            })
            let result = null;
            if (this.collected.length) {
                result = this.getRandom(max)
            } else {
                result = num;
            }
            return result;
        },
        getTime() {
            return format(new Date(), 'HH[:]mm[:]ss[.]SSS')
        }
    }
}
</script>
