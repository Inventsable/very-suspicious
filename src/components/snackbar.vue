<template>
    <v-snackbar v-model="show" :timeout="3000" top :color="bg">
        <v-icon v-if="icon" class="white--text">{{icon}}</v-icon>
        <span style="margin-left:.5rem;">{{text}}</span>
        <v-spacer />
        <!-- <v-btn flat fab color="white" @click="snackbar = !snackbar">
            <v-icon>close</v-icon>
        </v-btn> -->
    </v-snackbar>
</template>

<script>
export default {
    name: 'snackbar',
    props: {
        // show: Boolean,
        icon: String,
        text: String,
        bg: String,
        index: Number,
    },
    data: () => ({
        show: true,
    }),
    mounted() {
        setTimeout(() => {
            this.$emit('done');
        }, 3000)
        // console.log(this.index)
    }
    
}
</script>
