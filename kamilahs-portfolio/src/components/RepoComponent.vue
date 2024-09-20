<template>
    <div>
        <h2>
            <a :href="htmlUrl" target="_blank">{{ title }} </a>
            <img :src="getImage" alt="image">
        </h2>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        htmlUrl: String,
        id: Number
    },
    computed: {
        getImage() {
            return new URL(`../assets/images/${this.title}.png`, import.meta.url);
        }
    }
}
</script>

<style>

</style>