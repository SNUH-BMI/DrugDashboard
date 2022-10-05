<template>
    <div id="drug-container">

        <div id="drug-content">

            <!-- Info Overview -->
            <div id="drug__info" class="card">
                <div id="drug__info__top">
                    <div id="drug__info__title">약물 정보</div>
                </div>
                <div class="divider-horizontal" />
                <div class="drug__info__item-container" style="margin-bottom: 15px;">
                    <div class="drug__info__item">
                        <div class="drug__info__item__title">OMOP Concept ID</div>
                        <div class="drug__info__item__text">{{drugInfo['concept_id']}}</div>
                    </div>
                    <div class="drug__info__item">
                        <div class="drug__info__item__title">OMOP Concept Name</div>
                        <div class="drug__info__item__text">{{drugInfo['concept_name']}}</div>
                    </div>
                    <div class="drug__info__item">
                        <div class="drug__info__item__title">Vocabulary</div>
                        <div class="drug__info__item__text">{{drugInfo['vocabulary_id']}}</div>
                    </div>
                </div>
                <div class="drug__info__item-container">
                    <div class="drug__info__item">
                        <div class="drug__info__item__title">{{`${configs.institution_name} ID`}}</div>
                        <div class="drug__info__item__text">{{drugInfo[configs.institution_sourcename_column]}}</div>
                    </div>
                    <div class="drug__info__item">
                        <div class="drug__info__item__title">{{`${configs.institution_name} Source Name`}}</div>
                        <div class="drug__info__item__text">{{drugInfo['source_name']}}</div>
                    </div>
                </div>
            </div>

            <!-- Charts -->
            <div class="drug__chart-container">

                <!-- Gender Chart -->
                <div id="drug__chart__gender-container" class="card">

                    <div id="drug__chart__gender__title">처방 별 성별 분포</div>
                    <div class="divider-horizontal" />

                    <div id="drug__chart__gender__canvas-container">
                        <div v-if="isLoadingCount" class="loading-indicator" />
                        <DrugGenderChart v-show="!isLoadingCount"
                                         v-bind:render="!isLoadingCount"
                                         v-bind:chartData="genderCount"
                                         xAxis="gender"
                                         yAxis="number of patients" />
                    </div>

                </div>

                <!-- Age Chart -->
                <div id="drug__chart__age-container" class="card">

                    <div id="drug__chart__age__title">처방 별 연령 분포</div>
                    <div class="divider-horizontal" />

                    <div id="drug__chart__age__canvas-container">
                        <div v-if="isLoadingCount" class="loading-indicator" />
                        <DrugAgeChart v-show="!isLoadingCount"
                                      v-bind:render="!isLoadingCount"
                                      v-bind:chartData="ageCount"
                                      xAxis="age"
                                      yAxis="number of patients" />
                    </div>

                </div>

            </div>

            <div class="drug__chart-container">

                <!-- Ingredient Table -->
                <div id="drug__chart__ingredient-container" class="card">

                    <div id="drug__chart__ingredient__title">성분</div>
                    <div class="divider-horizontal" />

                    <div id="drug__ingredient__table-container">
                        <div v-if="isLoadingInfo" class="loading-indicator" />
                        <DrugIngredientTable v-show="!isLoadingInfo"
                                             v-bind:tableData="drugIngredient" />
                    </div>

                </div>

                <!-- Together Table -->
                <div id="drug__chart__together-container" class="card">

                    <div id="drug__chart__together__title">병용 약물</div>
                    <el-checkbox v-model="include_solution" change="clickTogether">수액 포함</el-checkbox>
                    <div class="divider-horizontal" id="drug__chart__together-divider"/>

                    <div id="drug__chart__together__table-container">
                        <div v-if="isLoadingTogether" class="loading-indicator" />
                        <DrugTogetherTable v-show="!isLoadingTogether"
                                           v-bind:tableData="usedTogetherList" />
                    </div>

                </div>

            </div>

            <div class="drug__chart-container">

                <div id="drug__chart__condition-container" class="card">
                    <div id="drug__chart__condition__title">처방 당시 진단 명</div>
                    <div class="divider-horizontal" />

                    <div id="drug__chart__condition__canvas-container">
                        <div v-if="isLoadingCondition" class="loading-indicator" />
                        <DrugConditionChart v-show="!isLoadingCondition"
                                            v-bind:render="!isLoadingCondition"
                                            v-bind:chartData="drugConditionList"
                                            v-bind:drugId="drugId"
                                            v-bind:institutionId="institutionId"/>
                    </div>
                </div>

            </div>

            <div class="drug__chart-container">

                <!-- Purpose Table -->
                <div id="drug__chart__purpose-container" class="card">
                    <div id="drug__chart__purpose__title">처방 받은 ATC 코드</div>
                    <div class="divider-horizontal" />

                    <div id="drug__chart__purpose__table-container">
                        <div v-if="isLoadingPurpose" class="loading-indicator" />
                        <DrugPurposeTable v-show="!isLoadingPurpose"
                                          v-bind:tableData="drugPurposeList" />
                    </div>
                </div>

                <!-- Drugs With Same Purpose Table -->
                <div id="drug__chart__same-purpose-container" class="card">
                    <div id="drug__chart__same-purpose__title">동일한 ATC 코드로 처방 받은 약물</div>
                    <div class="divider-horizontal" />

                    <div id="drug__chart__same-purpose__table-container">
                        <div v-if="isLoadingPurpose" class="loading-indicator" />
                        <DrugWithSamePurposeTable v-show="!isLoadingPurpose"
                                                  v-bind:tableData="drugWithSamePurposeList" />
                    </div>
                </div>

                <!-- Drug Total Exposure Chart -->
                <div id="drug__chart__total-exposure-container" class="card">
                    <div id="drug__chart__total-exposure__title">약물들의 총 처방 횟수 비교</div>
                    <div class="divider-horizontal" />

                    <div id="drug__chart__total-exposure__table-container">
                        <div v-if="isLoadingPurpose" class="loading-indicator" />
                        <DrugTotalExposureChart v-show="!isLoadingPurpose"
                                                v-bind:render="!isLoadingPurpose"
                                                v-bind:chartData="drugTotalExposureList"
                                                xAxis="time"
                                                yAxis="number of exposures" />
                    </div>
                </div>

            </div>

        </div>

        <DrugExposureModal v-if="showDrugExposureModal"
                           v-on:close="showDrugExposureModal = false"
                           v-bind:drugId="drugId"
                           v-bind:institutionId="institutionId" />

    </div>
</template>

<script>
    import requests from '../../requests';
    import DrugGenderChart from '../chart/drug/DrugGenderChart';
    import DrugAgeChart from '../chart/drug/DrugAgeChart_v2';
    import DrugIngredientTable from '../chart/drug/DrugIngredientTable';
    import DrugTogetherTable from '../chart/drug/DrugTogetherTable';
    import DrugConditionChart from '../chart/drug/DrugConditionChart';
    import DrugPurposeTable from '../chart/drug/DrugPurposeTable';
    import DrugWithSamePurposeTable from '../chart/drug/DrugWithSamePurposeTable';
    import DrugTotalExposureChart from '../chart/drug/DrugTotalExposureChart';
    import DrugExposureModal from '../modal/DrugExposureModal';
    import config from '../../config.json';

    async function loadData() {

        this.isLoadingInfo = true;
        this.isLoadingCount = true;
        this.isLoadingTogether = true;
        this.isLoadingCondition = true;
        this.isLoadingPurpose = true;

        await this.loadInfo();
        this.isLoadingInfo = false;

        await this.loadCount();
        this.isLoadingCount = false;

        await this.loadTogether();
        this.isLoadingTogether = false;

        await this.loadCondition();
        this.isLoadingCondition = false;

        await this.loadPurpose();
        this.isLoadingPurpose = false;

    }

    async function loadInfo() {

        try {

            const drugData = await requests.drug.getDrugData(this.drugId, this.institutionId);

            if(drugData.data === undefined) {
                alert('해당 약물의 데이터가 없습니다!');
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

    async function loadCount() {

        try {

            const _Count = await requests.drug.getDrugCount(this.drugId, this.institutionId);
            const drugCount = _Count.drugExposureCount;

            let totalCount = 0;
            let maleCount = 0;
            let femaleCount = 0;
            let maleAgeCount = {};
            let femaleAgeCount = {};
            let record_locationCount = {};
            let person_locationCount = {};

            for(const item of drugCount) {

                const gender = item.gender;
                const age = item.age;
                const location = item.location;
                const rec_count = Number(item.r_cnt);
                const man_count = Number(item.p_cnt);

                totalCount += rec_count;

                if(!(age in maleAgeCount)) maleAgeCount[age] = 0;
                if(!(age in femaleAgeCount)) femaleAgeCount[age] = 0;
                if(!(location in record_locationCount)) record_locationCount[location]= 0;
                if(!(location in person_locationCount)) person_locationCount[location] = 0;

                if(gender === 'M') {

                    maleCount += rec_count;
                    maleAgeCount[age] += rec_count;

                } else if(gender === 'F') {

                    femaleCount += rec_count;
                    femaleAgeCount[age] += rec_count;

                }

                record_locationCount[location] += rec_count;
                person_locationCount[location] += man_count;

            }

            let maleAgeList = [], femaleAgeList = [];
            for (let i=0; i<100; i=i+5) {
                maleAgeList.push({ age: String(i)+'-'+String(i+4), number: 0});
                femaleAgeList.push({ age: String(i)+'-'+String(i+4), number: 0});}
            maleAgeList.push({ age: "≥100", number: 0});
            femaleAgeList.push({ age: "≥100", number: 0});

            for(const key in maleAgeCount) {
                if (key < 0) continue;
                let index = Math.floor(key/5);
                if (index > 20)
                    maleAgeList[20].number += maleAgeCount[key];
                else
                    maleAgeList[index].number += maleAgeCount[key] ;}

            for(const key in femaleAgeCount) {
                if (key < 0) continue;
                let index = Math.floor(key/5);
                if (index > 20)
                    femaleAgeList[20].number += femaleAgeCount[key];
                else
                    femaleAgeList[index].number += femaleAgeCount[key] ;}


            let locationList = [];
            for(const key in record_locationCount)
                locationList.push({
                    location: String(key),
                    record: record_locationCount[key],
                    visitor: person_locationCount[key] });

            this.totalCount = totalCount;
            this.genderCount = {
                male: maleCount,
                female: femaleCount
            };
            this.ageCount = {
                male: maleAgeList,
                female: femaleAgeList
            };
            this.locationCount = locationList;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function loadTogether() {

        try {

            const usedTogether = await requests.drug.getDrugTogether(this.drugId, this.institutionId);
            const drugAllList = usedTogether["drugAllList"];

            for(const item of drugAllList) {
                const count = item.count;
                const ratio = (count / this.totalCount * 100).toFixed(1);
                item.count = `${count} (${ratio}%)`;
            }

            this.usedTogether = usedTogether;
            this.usedTogetherList = drugAllList.filter((v,i) => i<10);

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function loadCondition() {

        try {

            const drugCondition = await requests.drug.getDrugCondition(this.drugId, this.institutionId);

            let drugConditionList = []
            for (const item of drugCondition)
                drugConditionList.push({"concept_name": item.concept_name, "number": Number(item.number)});

            this.drugConditionList = drugConditionList;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function loadPurpose() {

        try {

            this.drugPurposeList = await requests.drug.getDrugPurpose(this.institutionId);

            this.drugTotalExposureList = await requests.drug.getDrugWithSamePurpose(this.institutionId);

            const drugWithSamePurposeList = [];

            for(const item of this.drugTotalExposureList) {

                drugWithSamePurposeList.push({
                    conceptId: item.conceptId,
                    institutionId: item.institutionId
                });

            }

            this.drugWithSamePurposeList = drugWithSamePurposeList;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    function clickTogether() {

        const include_solution = this.include_solution;

        const drugAllList = this.usedTogether["drugAllList"];
        const drugIVList = this.usedTogether["drugIVList"];

        if(include_solution)
            this.usedTogetherList = drugAllList.filter((v, i) => i<10);
        else {
            this.usedTogetherList = drugAllList.filter(v => !drugIVList.includes(v.drug_source_value)).slice(0,10);
        }

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
                isLoadingInfo: false,

                totalCount: 0,
                genderCount: {
                    male: 0,
                    female: 0
                },
                ageCount: {
                    male: 0,
                    female: 0
                },
                locationCount: [],
                isLoadingCount: false,

                include_solution: true,
                usedTogether: [],
                usedTogetherList: [],
                isLoadingTogether: false,

                drugConditionList: [],
                isLoadingCondition: false,

                drugPurposeList: [],
                drugWithSamePurposeList: [],
                drugTotalExposureList: [],
                isLoadingPurpose: false,

                showDrugExposureModal: false,
                configs: config
            }
        },

        mounted() {
            this.loadData();
        },

        watch: {
            include_solution() {this.clickTogether();}
        },

        methods: {
            clickTogether,
            loadData,
            loadInfo,
            loadCount,
            loadTogether,
            loadCondition,
            loadPurpose,
        },

        components: {
            DrugGenderChart,
            DrugAgeChart,
            DrugIngredientTable,
            DrugTogetherTable,
            DrugConditionChart,
            DrugPurposeTable,
            DrugWithSamePurposeTable,
            DrugTotalExposureChart,
            DrugExposureModal
        }
    };
</script>

<style scoped>
    #drug-container {
        height: 100%;
        width: 100%;
    }

    #drug-content {
        padding: 30px;
    }

    /* Info Overview */
    #drug__info {
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
    }

    #drug__info__top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    #drug__info__title {
        font-weight: 700;
        font-size: 18px;
    }

    .drug__info__item-container {
        display: flex;
        flex-direction: row;
    }

    .drug__info__item {
        margin-right: 50px;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .drug__info__item__title {
        margin-right: 20px;

        font-weight: 700;
        font-size: 16px;
    }

    .drug__info__item__text {
        font-size: 14px;
    }

    /* Charts */
    .drug__chart-container {
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
    }

    /* Gender Chart */
    #drug__chart__gender-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__gender__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__gender__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Age Chart */
    #drug__chart__age-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__age__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__age__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Quantity Chart */
    #drug__chart__quantity-container {
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__quantity__header {
        display: flex;
        flex-direction: row;
    }

    #drug__chart__quantity__title {
        font-weight: 700;
        font-size: 18px;

        margin-right: 30px;
    }

    #drug__chart__quantity__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #drug__chart__quantity__slider {
        width: 90%;
    }

    /* Ingredient Table */
    #drug__chart__ingredient-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__ingredient__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__ingredient__table-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Together Table */
    #drug__chart__together-container {
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__together__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__together__table-container {
        width: 100%;
        height: 300px;

        margin-top: -20px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #drug__chart__together-divider {
        transform: translate(0, -20px);
    }

    .el-checkbox >>>  {
        transform: translate(350px,-25px);
    }



    /* Drug Map */
    #drug__chart__map-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__map__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__map__canvas-container {
        width: 100%;
        height: 600px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    #drug__chart__condition-container {
        flex: 3;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #drug__chart__condition__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__condition__canvas-container {
        width: 100%;
        height: 600px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #drug__chart__purpose-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__same-purpose-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__total-exposure-container {
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug__chart__purpose__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__same-purpose__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__total-exposure__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__purpose__table-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #drug__chart__same-purpose__table-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #drug__chart__total-exposure__table-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
