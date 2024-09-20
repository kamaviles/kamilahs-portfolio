<template>
    <div>
        <h2>Portfolio Page</h2>
        <div class="repos">
            <div class="column" v-for="project in data" :key="project.id"> </div>
                <repo-component 
                :title="project.name"
                :htmlUrl="project.html_url"
                :id="project.id"
                ></repo-component>
        </div>
    </div>
</template>

<script>
import RepoComponent from '../components/RepoComponent.vue'
import githubService from '../services/GithubService'

export default {
    components: {
        RepoComponent
    },
    data() {
        return {
            data: null
        }
    },
    created() {
        githubService.getRepos()
        .then((response) => {
            console.log(response.data);
            this.data = response.data.filter(project => {
                return (
                    project.name === 'Encrypt-Bit'
                )
            })
        })
    }
}
</script>
<style>

</style>