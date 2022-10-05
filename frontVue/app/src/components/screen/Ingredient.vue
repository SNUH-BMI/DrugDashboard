<template>
    <div id="ingredient-container">

        <div id="ingredient-content">

            <!-- Info Overview -->
            <div id="ingredient__info" class="card">
                <div id="ingredient__info__top">
                    <div id="ingredient__info__title">성분 정보</div>
                </div>
                <div class="divider-horizontal" />
                <div class="ingredient__info__item-container">
                    <div class="ingredient__info__item">
                        <div class="ingredient__info__item__title">OMOP Concept ID</div>
                        <div class="ingredient__info__item__text">{{ingredientInfo['concept_id']}}</div>
                    </div>
                    <div class="ingredient__info__item">
                        <div class="ingredient__info__item__title">OMOP Concept Name</div>
                        <div class="ingredient__info__item__text">{{ingredientInfo['concept_name']}}</div>
                    </div>
                    <div class="ingredient__info__item">
                        <div class="ingredient__info__item__title">Vocabulary</div>
                        <div class="ingredient__info__item__text">{{ingredientInfo['vocabulary_id']}}</div>
                    </div>
                </div>
            </div>

<!--            <div class="ingredient__chart-container">-->

<!--                &lt;!&ndash; Quantity Chart &ndash;&gt;-->
<!--                <div id="ingredient__chart__quantity-container" class="card">-->

<!--                    <div id="ingredient__chart__quantity__header">-->
<!--                        <div id="ingredient__chart__quantity__title">환자 별 총 복용량 분포</div>-->
<!--                    </div>-->
<!--                    <div class="divider-horizontal" />-->

<!--                    <div id="ingredient__chart__quantity__chart">-->

<!--                        <div id="ingredient__chart__quantity__canvas-container">-->
<!--                            <div v-if="isLoadingQuantity" class="loading-indicator" />-->
<!--                            <DrugQuantityChart v-show="!isLoadingQuantity"-->
<!--                                               v-bind:render="!isLoadingQuantity"-->
<!--                                               v-bind:chartData="quantityShow"-->
<!--                                               xAxis="total quantity"-->
<!--                                               yAxis="number of patients" />-->
<!--                        </div>-->

<!--                        <div class="divider-vertical" />-->

<!--                        <div id="ingredient__chart__quantity__controller-container">-->

<!--                            <div class="ingredient__chart__quantity__controller__item">-->
<!--                                <span class="ingredient__chart__quantity__controller__text">최저 복용량 :</span>-->
<!--                                <el-input class="ingredient__chart__quantity__controller__input"-->
<!--                                          v-model="quantityStart"-->
<!--                                          v-on:keydown.native.enter="clickSearch" />-->
<!--                            </div>-->

<!--                            <div class="ingredient__chart__quantity__controller__item">-->
<!--                                <span class="ingredient__chart__quantity__controller__text">최대 복용량 :</span>-->
<!--                                <el-input class="ingredient__chart__quantity__controller__input"-->
<!--                                          v-model="quantityEnd"-->
<!--                                          v-on:keydown.native.enter="clickSearch" />-->
<!--                            </div>-->

<!--                            <span class="ingredient__chart__quantity__controller__max-text">최대 : {{maxQuantity}}</span>-->

<!--                            <el-button type="primary" v-on:click="clickSearch">검색</el-button>-->

<!--                        </div>-->

<!--                    </div>-->

<!--                </div>-->

<!--            </div>-->

<!--            <div class="ingredient__chart-container">-->

<!--                &lt;!&ndash; Gender Chart &ndash;&gt;-->
<!--                <div id="ingredient__chart__gender-container" class="card">-->

<!--                    <div id="ingredient__chart__gender__title">해당 구간의 환자 별 성별 분포</div>-->
<!--                    <div class="divider-horizontal" />-->

<!--                    <div id="ingredient__chart__gender__canvas-container">-->
<!--                        <div v-if="isLoadingPerson" class="loading-indicator" />-->
<!--                        <DrugGenderChart v-show="!isLoadingPerson"-->
<!--                                         v-bind:render="!isLoadingPerson"-->
<!--                                         v-bind:chartData="genderCount"-->
<!--                                         xAxis="gender"-->
<!--                                         yAxis="number of patients" />-->
<!--                    </div>-->

<!--                </div>-->

<!--                &lt;!&ndash; Birth Chart &ndash;&gt;-->
<!--                <div id="ingredient__chart__birth-container" class="card">-->

<!--                    <div id="ingredient__chart__birth__title">해당 구간의 환자 별 출생 년도 분포</div>-->
<!--                    <div class="divider-horizontal" />-->

<!--                    <div id="ingredient__chart__birth__canvas-container">-->
<!--                        <div v-if="isLoadingPerson" class="loading-indicator" />-->
<!--                        <DrugAgeChart v-show="!isLoadingPerson"-->
<!--                                      v-bind:render="!isLoadingPerson"-->
<!--                                      v-bind:chartData="birthCount"-->
<!--                                      xAxis="patient birth year"-->
<!--                                      yAxis="number of patients" />-->
<!--                    </div>-->

<!--                </div>-->

<!--                &lt;!&ndash; Person Table &ndash;&gt;-->
<!--                <div id="ingredient__chart__person-container" class="card">-->

<!--                    <div class="ingredient__chart__person__title" v-if="isLoadingPerson">검색중...</div>-->
<!--                    <div class="ingredient__chart__person__title" v-if="!isLoadingPerson">검색 결과 : {{personList.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}건</div>-->

<!--                    <div class="divider-horizontal" />-->

<!--                    <div id="ingredient__chart__person__table-container">-->

<!--                        <div v-if="isLoadingPerson" class="loading-indicator" />-->

<!--                        <DrugPersonChart-->
<!--                                v-if="!isLoadingPerson"-->
<!--                                v-bind:tableData="personShowList" />-->

<!--                        <el-pagination-->
<!--                                id="ingredient__chart__person__table__pagination"-->
<!--                                v-if="!isLoadingPerson"-->
<!--                                background-->
<!--                                layout="prev, pager, next"-->
<!--                                :total="personList.length"-->
<!--                                @current-change="changePersonTablePage" />-->

<!--                    </div>-->

<!--                </div>-->

<!--            </div>-->

            <!-- Table -->
            <div id="ingredient__search-table" class="card">

                <div class="ingredient__search-table__title" v-if="isLoading">검색중...</div>
                <div class="ingredient__search-table__title" v-if="!isLoading">이 성분을 포함하는 약물 : {{drugList.length}}건</div>

                <div class="divider-horizontal" />

                <div v-if="isLoading" class="loading-indicator" />

                <el-table
                        v-if="!isLoading"
                        :data="drugShowList"
                        border
                        stripe>
                    <el-table-column
                            prop="concept_id"
                            label="OMOP Concept ID"
                            width="150px">
                    </el-table-column>
                    <el-table-column
                            :prop= "`${configs.institution_sourcename_column}`"
                            :label= "`${configs.institution_name} ID`"
                            width="150px">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="OMOP Concept Name">
                    </el-table-column>
                    <el-table-column
                            prop="amount"
                            label="Amount"
                            width="150px">
                    </el-table-column>
                    <el-table-column
                            prop="unit"
                            label="Unit"
                            width="150px">
                    </el-table-column>
                    <el-table-column
                            label="Details"
                            width="150px">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" v-on:click="clickDrug(scope.row.concept_id, scope.row[configs.institution_sourcename_column])">상세 정보</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                        id="ingredient__search-table__pagination"
                        background
                        layout="prev, pager, next"
                        :total="drugList.length"
                        @current-change="changeDrugTablePage" />

            </div>

        </div>

    </div>
</template>

<script>
    import requests from '../../requests';
    import config from '../../config.json';
    // import DrugQuantityChart from '../chart/drug/DrugQuantityChart';
    // import DrugGenderChart from '../chart/drug/DrugGenderChart';
    // import DrugAgeChart from '../chart/drug/DrugAgeChart';
    // import DrugPersonChart from '../chart/drug/DrugPersonChart';

    async function loadData() {

        try {

            this.isLoading = true;
            this.isLoadingQuantity = true;
            this.isLoadingPerson = true;

            this.ingredientInfo = await requests.ingredient.getIngredientData(this.ingredientId);

            this.drugList = await requests.ingredient.getIngredientContainList(this.ingredientId);
            this.drugShowList = this.drugList.slice(0, 10);

            this.isLoading = false;

            // await this.loadQuantity();
            // this.isLoadingQuantity = false;
            //
            // await this.loadPerson();
            // this.isLoadingPerson = false;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function loadQuantity() {

        try {

            const ingredientQuantity = await requests.ingredient.getIngredientQuantity(this.ingredientId);

            const quantityList = ingredientQuantity.map( (v) => Number(v.quantity) ).sort((a, b) => a-b);
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

            this.personList = await requests.ingredient.getPersonByIngredientQuantityRange(this.ingredientId, this.quantityStart, this.quantityEnd);

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

    function changePersonTablePage(val) {

        const start = (val-1) * 10;
        const end = start + 10;

        this.personShowList = this.personList.slice(start, end);

    }

    function clickDrug(conceptId, institutionId) {

        window.open('/engine/drug/' + conceptId + '/' + institutionId, '_blank');

    }

    function changeDrugTablePage(val) {

        const start = (val-1) * 10;
        const end = start + 10;

        this.drugShowList = this.drugList.slice(start, end);

    }

    export default {
        props: {
            ingredientId: String
        },

        data() {
            return {
                isLoading: false,
                ingredientInfo: {},
                drugList: [],
                drugShowList: [],

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
                isLoadingPerson: false,
                configs: config
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
            loadQuantity,
            loadPerson,
            changedQuantityRange,
            clickSearch,
            changePersonTablePage,
            clickDrug,
            changeDrugTablePage
        },

        components: {
            // DrugQuantityChart,
            // DrugGenderChart,
            // DrugAgeChart,
            // DrugPersonChart
        }
    };
</script>

<style scoped>
    #ingredient-container {
        height: 100%;
        width: 100%;
    }

    #ingredient-content {
        padding: 30px;
    }

    /* Info Overview */
    #ingredient__info {
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
    }

    #ingredient__info__top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    #ingredient__info__title {
        font-weight: 700;
        font-size: 18px;
    }

    .ingredient__info__item-container {
        display: flex;
        flex-direction: row;
    }

    .ingredient__info__item {
        margin-right: 50px;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .ingredient__info__item__title {
        margin-right: 20px;

        font-weight: 700;
        font-size: 16px;
    }

    .ingredient__info__item__text {
        font-size: 14px;
    }

    /* Charts */
    .ingredient__chart-container {
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
    }

    /* Quantity Chart */
    #ingredient__chart__quantity-container {
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #ingredient__chart__quantity__header {
        display: flex;
        flex-direction: row;
    }

    #ingredient__chart__quantity__title {
        font-weight: 700;
        font-size: 18px;

        margin-right: 30px;
    }

    #ingredient__chart__quantity__chart {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #ingredient__chart__quantity__canvas-container {
        flex: 1;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #ingredient__chart__quantity__controller-container {
        width: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .ingredient__chart__quantity__controller__item {
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .ingredient__chart__quantity__controller__text {
        width: 100px;
    }

    .ingredient__chart__quantity__controller__input {
        width: 200px;
    }

    .ingredient__chart__quantity__controller__max-text {
        margin-bottom: 30px;
    }

    /* Gender Chart */
    #ingredient__chart__gender-container {
        flex: 2;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #ingredient__chart__gender__title {
        font-weight: 700;
        font-size: 18px;
    }

    #ingredient__chart__gender__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Birth Chart */
    #ingredient__chart__birth-container {
        flex: 2;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #ingredient__chart__birth__title {
        font-weight: 700;
        font-size: 18px;
    }

    #ingredient__chart__birth__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #ingredient__chart__person-container {
        flex: 3;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .ingredient__chart__person__title {
        font-weight: 700;
        font-size: 18px;
    }

    #ingredient__chart__person__table-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #ingredient__chart__person__table__pagination {
        margin-top: 15px;
    }

    #ingredient__search-table {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .ingredient__search-table__title {
        font-weight: 700;
        font-size: 18px;
    }

    #ingredient__search-table__pagination {
        margin-top: 15px;
    }
</style>
