<template>
    <v-snackbar v-model="show" :timeout="2500" top :color="color + ' darken-2'">
        <v-icon class="white--text">vpn_key</v-icon>
        <span style="margin-left:.5rem;">{{anno}}</span>
        <v-spacer />
    </v-snackbar>
</template>

<script>
export default {
    name: 'keybar',
    props: {
        anno: String,
        color: String,
    },
    data: () => ({
        show: true,
    }),
    mounted() {
        setTimeout(() => {
            this.$emit('done');
        }, 2500)
    }
    
}
</script>
