<template>
    <v-card
    class="mt-3 mx-auto"
    
  >
    <v-sheet
      class="mx-auto"
      color="cyan"
      max-width="calc(100% - 32px)"
    >
        <GChart
            type="ColumnChart"
            :data="chartData"
            :options="chartOptions"
        />
      <!-- <v-sparkline
        :labels="labels"
        :value="value"
        color="white"
        type="bar"
        line-width="2"
        padding="16"
      ></v-sparkline> -->
    </v-sheet>

    <v-card-text class="pt-3">
      <div class="title font-weight-light mb-2">User Registrations</div>
      <div class="subheading font-weight-light grey--text">Last Campaign Performance</div>
      <v-divider class="my-2"></v-divider>
      <v-icon
        class="mr-2"
        small
      >
        mdi-clock
      </v-icon>
      <span class="caption grey--text font-weight-light">Total Keys</span>
    </v-card-text>
  </v-card>
</template>

<script>
import { GChart } from 'vue-google-charts'
import db from '@/firebase/init'

export default {
    name: 'graph',
    components: {
        GChart,
    },
    data: () => ({
        plays: [],
        chartData: [
            ['Year', 'Sales', 'Expenses', 'Profit'],
            ['2014', 1000, 400, 200],
            ['2015', 1170, 460, 250],
            ['2016', 660, 1120, 300],
            ['2017', 1030, 540, 350]
        ],
        chartOptions: {
            chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017',
            }
        },
        labels: [
            '12am',
            '3am',
            '6am',
            '9am',
            '12pm',
            '3pm',
            '6pm',
            '9pm'
        ],
        value: [
            200,
            675,
            410,
            390,
            310,
            460,
            250,
            240
        ],
        playerList: [],
    }),
    mounted() {
        this.getPlaysFromJSON();
    },
    computed: {
        
    },
    methods: {
        getPlayers() {
            let mirror = [];
            // console.log('Hello?')
            this.plays.forEach((user) => {
                

            })
            
        },
        removeDuplicates(names) {
            var uniq = names
            .map((name) => {
                return {count: 1, name: name}
            })
            .reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count
                return a
            }, {})
            return Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b]);
        },
        getPlaysFromDB() {
            let ref = db.collection('plays')
            ref.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let play = change.doc.data();
                        this.plays.push(play);
                    }
                });
            })
        },
        getPlaysFromJSON() {
            this.plays = require('@/masterPlays1.json');
            console.log(this.plays)
            // console.log(this.players);
            this.getPlayers();
        }
    }

}
</script>

<style>

</style>
