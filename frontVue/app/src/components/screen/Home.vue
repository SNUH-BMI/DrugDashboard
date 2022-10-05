<template>
    <div class="home-container">

        <Header />

        <div class="home__content">
            <router-view name="homeContent"></router-view>
        </div>

    </div>
</template>

<script>
    import Header from './Header';

    export default {
        components: {
            Header
        }
    };
</script>

<style scoped>
    .home-container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .home__content {
        flex: 1;
        overflow: auto;
        background-color: #EEEEEE;
        display: flex;
    }
</style>
