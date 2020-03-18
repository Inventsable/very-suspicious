<template>
    <v-dialog v-model="status" persistent max-width="300px">
        
        <v-card
            class="elevation-16 mx-auto"
            width="300px"
        >
            <!-- <v-toolbar dense flat color="error">
                <v-toolbar-title>{{uid}}</v-toolbar-title>
            </v-toolbar> -->
            <!-- <v-card-title
                class="headline grey darken-2 white--text"
                primary-title
                >
                Error
            </v-card-title> -->
            <!-- <v-alert
                :value="true"
                color="warning"
                icon="priority_high"
                outline
                >
                You failed to obtain any keys.
            </v-alert> -->
            <v-alert
                :value="true"
                color="error"
                icon="warning"
                
                >
                Your activity has been flagged as suspicious.
            </v-alert>

            <v-card-text class="my-2">
                <v-container grid-list-md>
                    <div class="placeholder"></div>
                    <v-layout>
                        <v-flex xs3 class="pr-2">
                            <v-icon xLarge color="caution">search</v-icon>
                        </v-flex>
                        <v-flex xs9>
                            Failed to obtain any keys.
                        </v-flex>
                    </v-layout>
                    <!-- <v-flex xs12> -->
                    <span style="width:100%;display:flex;justify-content:flex-end;" class="font-weight-light mt-2 mb-0 pb-0 text-uppercase">{{uid}}</span>
                    <!-- </v-flex> -->
                    <div class="placeholder"></div>
                </v-container>
            </v-card-text>
            
            <v-divider></v-divider>
            <v-card-actions class="justify-space-between">
                <v-btn
                    color="error"
                    flat
                    @click="reload"
                    style="width: 112px;"
                >
                    <span>Sorry</span>
                </v-btn>
                <v-btn
                    color="error"
                    flat
                    @click="spamWindows"
                    style="width: 112px;"
                >
                    <span>Report</span>
                </v-btn>

                </v-card-actions>
            <!-- <v-divider></v-divider> -->
          </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'warning',
    props: {
        status: Boolean,
    },
    computed: {
        uid() {
            return this.$root.$children[0].uid;
        }
    },
    data: () => ({
        
    }),
    methods: {
        spamWindows() {
            // this.$router.push('link');
            this.$emit('sorry');
        },
        reload() {
            // location.reload();
            this.$emit('report');
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

.v-alert {
    /* margin-bottom: 6px; */
    padding: 4px 16px;
}
/* .v-text-field {
    padding-top: 0px !important;
} */

</style>
