<template>
    <div id="analysis-container">

        <div id="analysis-content">

            <!-- Info Overview -->
            <div id="analysis__info" class="card">
                <div id="analysis__info__top">
                    <div id="analysis__info__title">약물 복용량 분석</div>
                </div>
                <div class="divider-horizontal" />
                <div class="analysis__info__item-container">
                    <div class="analysis__info__item">
                        <div class="analysis__info__item__title">OMOP Concept ID</div>
                        <div class="analysis__info__item__text">{{drugInfo['concept_id']}}</div>
                    </div>
                    <div class="analysis__info__item">
                        <div class="analysis__info__item__title">OMOP Concept Name</div>
                        <div class="analysis__info__item__text">{{drugInfo['concept_name']}}</div>
                    </div>
                    <div class="analysis__info__item">
                        <div class="analysis__info__item__title">Vocabulary</div>
                        <div class="analysis__info__item__text">{{drugInfo['vocabulary_id']}}</div>
                    </div>
                </div>
            </div>

            <div class="analysis__chart-container">

                <!-- Quantity Chart -->
                <div id="analysis__quantity__chart-container" class="card">

                    <div id="analysis__quantity__chart__canvas-container">
                        <div v-if="isLoadingQuantity" class="loading-indicator" />
                        <DrugQuantityChart v-show="!isLoadingQuantity"
                                           v-bind:render="!isLoadingQuantity"
                                           v-bind:chartData="quantityShow"
                                           v-bind:xAxis="`total quantity (${drugInfo['unit']})`"
                                           yAxis="number of patients" />
                    </div>

                    <div class="divider-vertical" />

                    <div id="analysis__quantity__controller-container">

                        <div class="analysis__quantity__controller__item">
                            <span class="analysis__quantity__controller__item__text">최저 복용량 :</span>
                            <el-input class="analysis__quantity__controller__item__input"
                                      v-model="quantityStart"
                                      v-on:keydown.native.enter="clickSearch" />
                        </div>

                        <div class="analysis__quantity__controller__item">
                            <span class="analysis__quantity__controller__item__text">최대 복용량 :</span>
                            <el-input class="analysis__quantity__controller__item__input"
                                      v-model="quantityEnd"
                                      v-on:keydown.native.enter="clickSearch" />
                        </div>

                        <span class="analysis__quantity__controller__max-text">최대 : {{maxQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}} {{drugInfo['unit']}}</span>

                        <el-button type="primary" v-on:click="clickSearch">검색</el-button>

                    </div>

                </div>

            </div>

            <div class="analysis__chart-container">

                <!-- Gender Chart -->
                <div id="analysis__chart__gender-container" class="card">

                    <div id="analysis__chart__gender__title">해당 구간의 환자 별 성별 분포</div>
                    <div class="divider-horizontal" />

                    <div id="analysis__chart__gender__canvas-container">
                        <div v-if="isLoadingPerson" class="loading-indicator" />
                        <DrugGenderChart v-show="!isLoadingPerson"
                                         v-bind:render="!isLoadingPerson"
                                         v-bind:chartData="genderCount"
                                         xAxis="gender"
                                         yAxis="number of patients" />
                    </div>

                </div>

                <!-- Birth Chart -->
                <div id="analysis__chart__birth-container" class="card">

                    <div id="analysis__chart__birth__title">해당 구간의 환자 별 출생 년도 분포</div>
                    <div class="divider-horizontal" />

                    <div id="analysis__chart__birth__canvas-container">
                        <div v-if="isLoadingPerson" class="loading-indicator" />
                        <DrugAgeChart v-show="!isLoadingPerson"
                                      v-bind:render="!isLoadingPerson"
                                      v-bind:chartData="birthCount"
                                      xAxis="patient birth year"
                                      yAxis="number of patients" />
                    </div>

                </div>

                <!-- Person Table -->
                <div id="analysis__chart__person-container" class="card">

                    <div class="analysis__chart__person__title" v-if="isLoadingPerson">검색중...</div>
                    <div class="analysis__chart__person__title" v-if="!isLoadingPerson">검색 결과 : {{personList.length}}건</div>

                    <div class="divider-horizontal" />

                    <div id="analysis__chart__person__table-container">

                        <div v-if="isLoadingPerson" class="loading-indicator" />

                        <DrugPersonChart
                                v-if="!isLoadingPerson"
                                v-bind:tableData="personShowList" />

                        <el-pagination
                                id="analysis__chart__person__table__pagination"
                                v-if="!isLoadingPerson"
                                background
                                layout="prev, pager, next"
                                :total="personList.length"
                                @current-change="changeTablePage" />

                    </div>

                </div>

            </div>

        </div>

    </div>
</template>

<script>
    import requests from '../../requests';
    import DrugGenderChart from '../chart/drug/DrugGenderChart';
    import DrugAgeChart from '../chart/drug/DrugAgeChart';
    import DrugQuantityChart from '../chart/drug/DrugQuantityChart';
    import DrugPersonChart from '../chart/drug/DrugPersonChart';

    async function loadData() {

        this.isLoadingQuantity = true;
        this.isLoadingPerson= true;

        await this.loadInfo();

        await this.loadQuantity();
        this.isLoadingQuantity = false;

        await this.loadPerson();
        this.isLoadingPerson = false;

    }

    async function loadInfo() {

        try {

            const drugData = await requests.drug.getDrugData(this.drugId, this.institutionId);

            if(drugData.data === undefined) {
                alert("Error! There is no data for this drug.");
                window.close();
                return;
            }

            this.drugInfo = drugData.data;
            this.drugIngredient = drugData.ingredient;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function loadQuantity() {

        try {

            const drugQuantity = await requests.drug.getDrugQuantity(this.drugId, this.institutionId);

            const quantityList = drugQuantity.map( (v) => Number(v.quantity) ).sort((a, b) => a-b);
            const maxQuantity = quantityList[quantityList.length - 1];

            let quantityDistribution = {};

            for(let i = 1; i <= 100; i++) {

                quantityDistribution[Math.ceil(maxQuantity / 100) * i] = 0;

            }

            let index = 0;
            for(const item of quantityList) {

                while(item > Number(Object.keys(quantityDistribution)[index])) index += 1;
                quantityDistribution[ Object.keys(quantityDistribution)[index] ] += 1;

            }

            this.quantity = quantityDistribution;

            this.quantityStart = 0;
            this.quantityEnd = maxQuantity;
            this.maxQuantity = maxQuantity;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function loadPerson() {

        try {

            this.personList = await requests.drug.getPersonByQuantityRange(this.drugId, this.institutionId, this.quantityStart, this.quantityEnd);

            this.personShowList = this.personList.slice(0, 10);

            // gender, birth count
            let maleCount = 0;
            let femaleCount = 0;
            let maleBirthCount = {};
            let femaleBirthCount = {};
            let allBirthCount = {};

            for(const item of this.personList) {

                const gender = item.gender_source_value;
                const birth = item.year_of_birth;

                if(!(birth in allBirthCount)) allBirthCount[birth] = 0;
                if(!(birth in maleBirthCount)) maleBirthCount[birth] = 0;
                if(!(birth in femaleBirthCount)) femaleBirthCount[birth] = 0;

                if(gender === 'M') {

                    maleCount += 1;
                    maleBirthCount[birth] += 1;

                } else if(gender === 'F') {

                    femaleCount += 1;
                    femaleBirthCount[birth] += 1;

                }

                allBirthCount[birth] += 1;

            }

            let allBirthList = [];
            for(const key in allBirthCount) allBirthList.push({ age: Number(key), number: allBirthCount[key] });
            let maleBirthList = [];
            for(const key in maleBirthCount) maleBirthList.push({ age: Number(key), number: maleBirthCount[key] });
            let femaleBirthList = [];
            for(const key in femaleBirthCount) femaleBirthList.push({ age: Number(key), number: femaleBirthCount[key] });

            this.genderCount = {
                male: maleCount,
                female: femaleCount
            };
            this.birthCount = {
                all: allBirthList,
                male: maleBirthList,
                female: femaleBirthList
            };

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    function changedQuantityRange() {

        let quantityDistribution = {};

        for (const [key, value] of Object.entries(this.quantity)) {

            if(parseInt(key) >= parseInt(this.quantityStart) && parseInt(key) <= parseInt(this.quantityEnd)) quantityDistribution[key] = value;

        }

        let quantityShowList = [];
        for(const key in quantityDistribution) quantityShowList.push({ quantity: Number(key), number: quantityDistribution[key] });
        this.quantityShow = quantityShowList;

    }

    async function clickSearch() {

        this.personList = [];
        this.personShowList = [];

        this.isLoadingPerson = true;
        await this.loadPerson();
        this.isLoadingPerson = false;

    }

    function changeTablePage(val) {

        const start = (val-1) * 10;
        const end = start + 10;

        this.personShowList = this.personList.slice(start, end);

    }

    export default {
        props: {
            drugId: String,
            institutionId: String
        },

        data() {
            return {
                drugInfo: {},
                drugIngredient: [],

                quantityStart: 0,
                quantityEnd: 0,
                maxQuantity: 0,
                quantity: {},
                quantityShow: [],
                isLoadingQuantity: false,

                personList: [],
                personShowList: [],
                genderCount: {
                    male: 0,
                    female: 0
                },
                birthCount: {
                    all: 0,
                    male: 0,
                    female: 0
                },
                isLoadingPerson: false
            }
        },

        mounted() {
            this.loadData();
        },

        watch: {
            quantityStart() { this.changedQuantityRange(); },
            quantityEnd() { this.changedQuantityRange(); }
        },

        methods: {
            loadData,
            loadInfo,
            loadQuantity,
            loadPerson,
            changedQuantityRange,
            clickSearch,
            changeTablePage
        },

        components: {
            DrugGenderChart,
            DrugAgeChart,
            DrugQuantityChart,
            DrugPersonChart
        }
    };
</script>

<style scoped>
    #analysis-container {
        height: 100%;
        width: 100%;
    }

    #analysis-content {
        padding: 30px;
    }

    /* Info Overview */
    #analysis__info {
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
    }

    #analysis__info__top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    #analysis__info__title {
        font-weight: 700;
        font-size: 18px;
    }

    .analysis__info__item-container {
        display: flex;
        flex-direction: row;
    }

    .analysis__info__item {
        margin-right: 50px;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .analysis__info__item__title {
        margin-right: 20px;

        font-weight: 700;
        font-size: 16px;
    }

    .analysis__info__item__text {
        font-size: 14px;
    }

    .analysis__chart-container {
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
    }

    #analysis__quantity__chart-container {
        flex: 1;
        height: 300px;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    #analysis__quantity__chart__canvas-container {
        flex: 1;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #analysis__quantity__controller-container {
        width: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .analysis__quantity__controller__item {
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .analysis__quantity__controller__item__text {
        width: 100px;
    }

    .analysis__quantity__controller__item__input {
        width: 200px;
    }

    .analysis__quantity__controller__max-text {
        margin-bottom: 30px;
    }

    /* Gender Chart */
    #analysis__chart__gender-container {
        flex: 2;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #analysis__chart__gender__title {
        font-weight: 700;
        font-size: 18px;
    }

    #analysis__chart__gender__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Birth Chart */
    #analysis__chart__birth-container {
        flex: 2;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #analysis__chart__birth__title {
        font-weight: 700;
        font-size: 18px;
    }

    #analysis__chart__birth__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #analysis__chart__person-container {
        flex: 3;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .analysis__chart__person__title {
        font-weight: 700;
        font-size: 18px;
    }

    #analysis__chart__person__table-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #analysis__chart__person__table__pagination {
        margin-top: 15px;
    }
</style>
