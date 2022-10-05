<template>
    <div id="header-container">

        <a id="header__title" v-on:click="clickHome">SCDM Drug Search Engine</a>

    </div>
</template>

<script>
    function clickHome() {
        const path = '/engine/';
        if(this.$router.currentRoute.path !== path) this.$router.push(path);
    }

    export default {
        methods: {
            clickHome
        }
    };
</script>

<style scoped>
    #header-container {
        width: 100%;
        height: 70px;
        background-color: #009691;
        z-index: 1;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #header__title {
        font-size: 20px;
        font-weight: 700;
        text-decoration: none;
        color: #FAFAFA;

        cursor: pointer;

        margin-left: 30px;
        margin-right: 100px;
    }
</style>
