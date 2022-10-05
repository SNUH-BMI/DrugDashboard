<template>
    <div id="main-parent">

        <div id="main__container">

            <div id="main__title-container">

                <img src="../../assets/logo_white.png" alt="logo" width="100" height="100">

                <span id="main__title__text">SCDM Drug Search Engine</span>

            </div>

            <div id="main__item-container">

                <a id="main__back__button" :href="configs.homepage">
                </a>

                <div class="main__item" v-on:click="clickQuerySearch">
                    <span class="main__item__title">Query Search</span>
                    <span class="main__item__text">이름, ID로<br>약물, 성분 검색</span>
                </div>

                <div class="main__item" v-on:click="clickConditionalSearch">
                    <span class="main__item__title">Conditional Search</span>
                    <span class="main__item__text">조건으로<br>약물 처방 검색</span>
                </div>

            </div>

        </div>

        <div id="main__bottom-container">

            <div>서울대학교병원 융합의학과 의생명정보학연구실</div>
            <a id="main__bottom-container__link" href="https://sites.google.com/view/snuh-bmi-lab" target="_blank">SNUH BMI Lab</a>

        </div>

        <div class="background">
            <ul class="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>

    </div>
</template>

<script>
    import config from '../../config.json';

    function clickQuerySearch() {

        const path = '/engine/query';
        if(this.$router.currentRoute.path !== path) this.$router.push(path);

    }

    function clickConditionalSearch() {

        const path = '/engine/conditional';
        if(this.$router.currentRoute.path !== path) this.$router.push(path);

    }

    function clickAbout() {

        const path = '/engine/about';
        if(this.$router.currentRoute.path !== path) this.$router.push(path);

    }

    function clickManual() {

        window.open('/engine/DrugDashbaord_manual.pdf', '_blank');

    }

    function clickHealthCheck() {

        const path = '/engine/check';
        if(this.$router.currentRoute.path !== path) this.$router.push(path);

    }

    export default {
        methods: {
            clickQuerySearch,
            clickConditionalSearch,
            clickAbout,
            clickManual,
            clickHealthCheck
        },
                data() {
            return {
                configs: config
            }
        },
    };
</script>

<style scoped>
    #main-parent {
        width: 100%;
        height: 100%;
    }

    #main__container {
        width: 100%;
        height: 100%;

        color: #FAFAFA;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #main__title-container {
        margin-bottom: 50px;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #main__title__text {
        font-size: 40px;
        font-weight: 700;

        margin-left: 30px;
    }

    #main__back__button {
        width: 0;
        height: 0;
        border-bottom: 40px solid transparent;
        border-top: 40px solid transparent;
        border-left: 40px solid transparent;
        border-right: 40px solid #EEEEEE;
    }

    #main__item-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .main__item {
        width: 200px;
        height: 200px;
        margin-left: 30px;
        margin-right: 30px;
        background-color: #FAFAFA;
        color: #009691;
        cursor: pointer;
        border-radius: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .main__item:hover {
        width: 250px;
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

    .main__item__title {
        font-size: 17px;
        font-weight: 700;

        margin-bottom: 30px;
    }

    .main__item__text {
        width: 150px;
        font-size: 15px;
        text-align: center;
    }

    #main__top-menu-container {
        position: absolute;
        top: 30px;
        right: 30px;
    }

    #main__bottom-container {
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;

        width: 350px;
        margin-left: auto;
        margin-right: auto;

        color: #FAFAFA;
        font-weight: bold;
        text-align: center;
    }

    #main__bottom-container__link {
        color: #004290;
        text-decoration: none;
    }

    /* background */
    .background{
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;

        width: 100vw;
        height: 100vh;

        background: #009691;
    }

    .circles{
        position: absolute;
        top: 0;
        left: 0;

        margin: 0;
        padding: 0;

        width: 100%;
        height: 100%;

        overflow: hidden;
    }

    .circles li{
        position: absolute;
        display: block;
        list-style: none;
        width: 20px;
        height: 20px;
        background: #29acaa;
        animation: animate 25s linear infinite;
        bottom: -150px;
    }

    .circles li:nth-child(1){
        left: 25%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
    }

    .circles li:nth-child(2){
        left: 10%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
    }

    .circles li:nth-child(3){
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
    }

    .circles li:nth-child(4){
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
    }

    .circles li:nth-child(5){
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
    }

    .circles li:nth-child(6){
        left: 75%;
        width: 110px;
        height: 110px;
        animation-delay: 3s;
    }

    .circles li:nth-child(7){
        left: 35%;
        width: 150px;
        height: 150px;
        animation-delay: 7s;
    }

    .circles li:nth-child(8){
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
    }

    .circles li:nth-child(9){
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
    }

    .circles li:nth-child(10){
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
    }

    @keyframes animate {

        0%{
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
        }

        100%{
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
        }

    }
</style>
