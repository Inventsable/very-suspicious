<template>
  <v-layout row justify-center>
    <v-dialog v-model="status" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card v-if="!isLoading">
        <v-toolbar dark :color="clue.color">
          <v-toolbar-title>{{clue.title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- <v-btn dark flat @click="$emit('close')">Save</v-btn> -->
            <v-btn icon dark @click="$emit('close')">
                <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader v-html="clue.subtitle"></v-subheader>
            <v-container fluid>
                <v-layout justify-space-around>
                    <!-- <v-flex xs12>
                        <div class="title mb-1">More tools > Sensors</div>
                        <v-layout column>
                            <v-img src="https://picsum.photos/510/300?random" aspect-ratio="1.7"></v-img>
                        </v-layout>
                    </v-flex> -->
                <iframe :src='clue.src' frameborder='0' scrolling='no' allowfullscreen width='640' height='404'></iframe>
                </v-layout>
            </v-container>
        </v-list>
      </v-card>
      <v-card v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
            ></v-progress-circular>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

export default {
    name: 'clue',
    props: {
        status: Boolean,
        keycolor: String,
    },
    data: () => ({
        isLoading: null,
        password: null,
        clue: {
            title: null,
            subtitle: null,
            src: null,
            color: null,
        }
        // widgets: true,
    }),
    methods: {
        retrieve(clue) {
            this.clue = clue;
        },
    }
}
</script>
