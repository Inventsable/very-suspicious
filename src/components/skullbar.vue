<template>
    <v-snackbar v-model="show" :timeout="2500" top :color="bg" :anno="anno">
        <div v-for="(item, key) in anno" :key="key" class="mr-3">
            <v-icon class="white--text">{{item.icon}}</v-icon>
            <span style="margin-left:.5rem;">{{item.text}}</span>
            <!-- <v-spacer v-if="key !== (anno.length - 1)" /> -->
        </div>
    </v-snackbar>
</template>

<script>
export default {
    name: 'skullbar',
    props: {
        // show: Boolean,
        anno: Array,
        bg: String,
    },
    data: () => ({
        show: true,
    }),
    mounted() {
        // console.log(this.anno)
        setTimeout(() => {
            this.$emit('done');
        }, 2500)
    }
    
}
</script>
