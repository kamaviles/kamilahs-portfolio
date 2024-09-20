<template>
    <div>
        <h2>Resume Page</h2>
        <embed :src="resume" />
    </div>
</template>

<script>

import pdf from '../assets/resume.pdf'

export default {
    data() {
        return {
            resume: pdf
        }
    }
}
</script>

<style>

embed {
    width: 90vw;
    height: 100vh;
}
</style>