<template>
    <v-dialog v-model="status" persistent max-width="300px">
          <v-card
              class="elevation-16 mx-auto"
              width="300px"
          >
            <v-card-text class="grey lighten-4 text-truncate">
                <v-layout  row>
                    <v-flex  xs12>
                        <span class="font-weight-light text-uppercase text-truncate">{{uid}}</span>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <v-list two-line>
                        <template v-for="(color, index) in sublist">
                            <v-list-tile
                            :key="index"
                            avatar
                            @click="seeClue(color.title)"
                            >
                            <v-list-tile-avatar>
                                <v-icon large :color="color.value">vpn_key</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="color.title"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="color.subtitle"></v-list-tile-sub-title>
                            </v-list-tile-content>
                            </v-list-tile>
                        </template>
                        </v-list>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-space-between">
                <v-btn
                    color="primary"
                    flat
                    @click="reload"
                    style="width: 112px;"
                >
                    <span>Retry</span>
                </v-btn>
                <v-btn
                    color="primary"
                    flat
                    @click="newWatchWindow"
                    style="width: 112px;"
                >
                    <span>Watch</span>
                </v-btn>
                </v-card-actions>
          </v-card>
    </v-dialog>
</template>

<script>
import db from '@/firebase/init'

export default {
    name: 'password',
    props: {
        status: Boolean,
        list: Array,
    },
    mounted() {
        this.mainframe = this.$root.$children[0].$children[0].$children[0];
    },
    data: () => ({
        sublist: [],
        mainframe: {},
        isLoading: true,
    }),
    computed: {
        uid() {
            return this.$root.$children[0].uid;
        }
    },
    methods: {
        reload() {
            this.$parent.reset();
        },
        seeClue(pass) {
            // console.log(pass);
            this.$root.$children[0].revealClue(pass);
        },
        newWatchWindow() {
            window.open(`https://very-suspicio.us/link`);
        },
        launch() {
            if (this.list.length) {
                db.collection('passwords').doc(`sublist`).get()
                .then(snapshot => {
                    for (var i = 0; i < this.list.length; i++) {
                        var color = this.list[i];
                        let obj = snapshot.data();
                        this.sublist.push({
                            value: color,
                            title: obj[color][0],
                            subtitle: obj[color][1],
                            img: obj[color][2],
                            lat: obj[color][3],
                            lng: obj[color][4],
                        })
                        this.mainframe.speak(`
    ${obj[color][0]}
    [${obj[color][3]}, ${obj[color][4]}]                
`)

                    }
                }).then(() => {
                    this.sublist = this.sublist.filter((thing, index, self) =>
                        index === self.findIndex((t) => (
                            t.value === thing.value 
                            && t.title === thing.title 
                            && t.subtitle === thing.subtitle 
                            && t.img === thing.img 
                            && t.lat === thing.lat 
                            && t.lng === thing.lng 
                        ))
                    )
                })
            }
        },
    },
}
</script>

<style scoped>

</style>
