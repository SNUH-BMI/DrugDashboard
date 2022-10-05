<template>
    <div id="health-check-container">

        <span id="health-check__title">사이트 상태 검사</span>

        <div id="health-check__backend-container" class="card">
            <div class="health-check__name">
                <span class="health-check__name__text">Backend Server</span>
                <i class="el-icon-loading health-check__loading" v-if="isLoadingBackend" />
            </div>
        </div>

        <div id="health-check__database-container" class="card">
            <div class="health-check__name">
                <span class="health-check__name__text">CDM Database</span>
                <i class="el-icon-loading health-check__loading" v-if="isLoadingDatabase" />
            </div>
            <span id="health-check__database__time">
                <br>응답 시간 : {{databaseLoadingTime}}ms<br>(평균적인 응답 시간은 약 0.3초입니다. 오래 걸린다면 DB가 지연되고 있는 것입니다.)
            </span>
        </div>

      <span>두 항목이 모두 초록색이어야 사이트가 정상적으로 작동합니다.</span>

    </div>
</template>

<script>
    import requests from '../../requests';

    async function healthCheck() {

        // backend
        try {

            const checkBackend = await requests.check.checkBackend();

            this.isLoadingBackend = false;
            console.log(checkBackend);
            if(checkBackend.healthy) this.backendElement.style.backgroundColor = '#5bff65';
            else this.backendElement.style.backgroundColor = '#ff8574';

        } catch(error) {

            this.isLoadingBackend = false;

            this.backendElement.style.backgroundColor = '#ff8574';

            console.log(error);

        }

        // database
        const databaseInterval = setInterval(() => this.databaseLoadingTime += 10, 10);

        try {

            const checkDatabase = await requests.check.checkDatabase();

            clearInterval(databaseInterval);
            this.isLoadingDatabase = false;

            if(checkDatabase.healthy) this.databaseElement.style.backgroundColor = '#5bff65';
            else this.databaseElement.style.backgroundColor = '#ff8574';

        } catch(error) {

            clearInterval(databaseInterval);
            this.databaseLoadingTime = ' - ';
            this.isLoadingDatabase = false;

            this.databaseElement.style.backgroundColor = '#ff8574';

            console.log(error);

        }

    }

    export default {
        data() {
            return {
                isLoadingBackend: true,
                isLoadingDatabase: true,
                databaseLoadingTime: 0
            }
        },

        computed: {
            backendElement() { return document.getElementById('health-check__backend-container'); },
            databaseElement() { return document.getElementById('health-check__database-container'); }
        },

        mounted() {
            this.healthCheck();
        },

        methods: {
            healthCheck
        }
    };
</script>

<style scoped>
    #health-check-container {
        width: 100%;
        padding: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #health-check__title {
        font-size: 30px;
        font-weight: 700;

        margin-bottom: 50px;
    }

    #health-check__backend-container {
        width: 500px;
        margin-bottom: 30px;
    }

    #health-check__database-container {
        width: 500px;
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
    }

    .health-check__name {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .health-check__name__text {
        font-size: 15px;
        font-weight: 700;
    }

    .health-check__loading {
        margin-left: auto;
    }

    #health-check__database__time {
        font-size: 13px;
    }
</style>
