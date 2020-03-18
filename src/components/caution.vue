<template>
    <v-dialog :class="display" v-model="status" persistent :max-width="wide + 'px'">
          <v-card
              class="elevation-16 mx-auto"
              :width="wide + 'px'"
          >
            <v-card-title
                class="headline grey darken-2"
                primary-title
                >
                Confirm Overwrite
            </v-card-title>
            <v-card-text class="my-2">
                <v-container grid-list-md>
                    <div class="placeholder"></div>
                    <v-layout>
                        <v-flex xs2 class="mr-2">
                            <v-icon large color="caution">warning</v-icon>
                        </v-flex>
                        <v-flex xs10>
                            {{name}} already exists.
                            <br>
                            Do you wish to replace it?
                        </v-flex>
                    </v-layout>
                    <div class="placeholder"></div>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-space-between">
                <v-btn
                    color="white"
                    flat
                    @click="$emit('submit')"
                    style="width: 112px;"
                >
                    <span>No</span>
                </v-btn>
                <v-btn
                    color="white"
                    flat
                    @click="$emit('submit')"
                    style="width: 112px;"
                >
                    <span>Yes</span>
                </v-btn>

                </v-card-actions>
            <!-- <v-divider></v-divider> -->
          </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'password',
    props: {
        status: Boolean,
        name: String,
        wide: Number,
        display: String,
    },
    data: () => ({
        password: null,
        
    }),
    methods: {

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
/* .v-text-field {
    padding-top: 0px !important;
} */

</style>
