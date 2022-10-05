<template>
    <div id="conditional-search-container">

        <div id="conditional-search__conditions-container" class="card">

            <span class="conditional-search__conditions__title">조건으로 약물 처방 검색</span>

            <div id="conditional-search__conditions__person-container">

                <span class="conditional-search__conditions__title">환자 조건</span>

                <div class="conditional-search__conditions__item">

                    <el-checkbox class="conditional-search__conditions__item__check" v-model="itemAgeChecked" />

                    <span class="conditional-search__conditions__item__title">나이</span>

                    <div class="conditional-search__conditions__item__content-container">
                        <el-input class="conditional-search__conditions__item__content__age-input" v-model="ageMin" />
                        <span style="margin-left: 10px; margin-right: 10px;">~</span>
                        <el-input class="conditional-search__conditions__item__content__age-input" v-model="ageMax" />
                    </div>

                </div>

                <div class="conditional-search__conditions__item">

                    <el-checkbox class="conditional-search__conditions__item__check" v-model="itemGenderChecked" />

                    <span class="conditional-search__conditions__item__title">성별</span>

                    <div class="conditional-search__conditions__item__content-container">
                        <el-checkbox v-model="manChecked">남자</el-checkbox>
                        <el-checkbox v-model="womanChecked">여자</el-checkbox>
                    </div>

                </div>

                <div class="conditional-search__conditions__item">

                    <el-checkbox class="conditional-search__conditions__item__check" v-model="itemConditionChecked" />

                    <span class="conditional-search__conditions__item__title">
                        Condition
                        <el-tooltip class="item" effect="dark" placement="top"
                                    content="한 번이라도 이 Condition들을 가진 적이 있는 환자 중에서 검색합니다." style="margin-left: 10px;">
                            <el-button icon="el-icon-thumb" size="mini" circle />
                        </el-tooltip>
                    </span>

                    <el-select class="conditional-search__conditions__item__type" v-model="conditionType">
                        <el-option
                            v-for="item in typeList"
                            v-bind:key="item.value"
                            v-bind:label="item.label"
                            v-bind:value="item.value">
                        </el-option>
                    </el-select>

                    <div class="conditional-search__conditions__item__content-container">
                        <el-button type="primary" icon="el-icon-plus" circle
                                   v-on:click="showConditionSearchModal = true" />
                    </div>

                    <div class="conditional-search__conditions__item__button-container">
                        <el-button v-for="condition in conditionList" v-bind:key="condition.id"
                                   v-html="condition.name"
                                   v-on:click="clickCondition(condition)" round />
                    </div>

                </div>

            </div>

            <div id="conditional-drug-container">

                <span class="conditional-search__conditions__title">약물 조건</span>

                <div class="conditional-search__conditions__item">

                    <el-checkbox class="conditional-search__conditions__item__check" v-model="itemDrugChecked" />

                    <span class="conditional-search__conditions__item__title">
                        약물 코드
                        <el-tooltip class="item" effect="dark" placement="top" style="margin-left: 10px;">
                            <div slot="content">
                                이 약물들에 대한 처방들을 검색합니다.
                                <br><br>
                                - AND 조건은 해당 약물들을 모두 복용한 적이 있는 경우
                                <br>
                                - OR 조건은 해당 약물중 하나라도 복용한 경우
                                <br><br>
                                "동시 복용만 검색"을 선택하면 약물 간 복용 기간이 겹치는 경우만 검색합니다.
                            </div>
                            <el-button icon="el-icon-thumb" size="mini" circle />
                        </el-tooltip>
                    </span>

                    <el-select class="conditional-search__conditions__item__type" v-model="drugType">
                        <el-option
                            v-for="item in typeList"
                            v-bind:key="item.value"
                            v-bind:label="item.label"
                            v-bind:value="item.value">
                        </el-option>
                    </el-select>

                    <el-checkbox class="conditional-search__conditions__item__check-simultaneous" v-model="itemDrugSimultaneousChecked">동시 복용만 검색</el-checkbox>

                    <div class="conditional-search__conditions__item__content-container">
                        <el-button type="primary" icon="el-icon-plus" circle
                                   v-on:click="showDrugSearchModal = true" />
                    </div>

                    <div class="conditional-search__conditions__item__button-container">
                        <el-button v-for="drug in drugList" v-bind:key="drug"
                                   v-html="drug"
                                   v-on:click="clickDrug(drug)" round />
                    </div>

                </div>

                <div class="conditional-search__conditions__item">

                    <el-checkbox class="conditional-search__conditions__item__check" v-model="itemAtcChecked" />

                    <span class="conditional-search__conditions__item__title">
                        ATC 코드
                        <el-tooltip class="item" effect="dark" placement="top" style="margin-left: 10px;">
                            <div slot="content">
                                이 ATC 코드들에 해당되는 처방들을 검색합니다.
                                <br><br>
                                - AND 조건은 ATC 코드에 해당하는 약물들을 모두 복용한 적이 있는 경우
                                <br>
                                - OR 조건은 ATC 코드에 해당하는 약물중 하나라도 복용한 경우
                                <br><br>
                                "동시 복용만 검색"을 선택하면 약물 간 복용 기간이 겹치는 경우만 검색합니다.
                            </div>
                            <el-button icon="el-icon-thumb" size="mini" circle />
                        </el-tooltip>
                    </span>

                    <el-select class="conditional-search__conditions__item__type" v-model="atcType">
                        <el-option
                            v-for="item in typeList"
                            v-bind:key="item.value"
                            v-bind:label="item.label"
                            v-bind:value="item.value">
                        </el-option>
                    </el-select>

                    <el-checkbox class="conditional-search__conditions__item__check-simultaneous" v-model="itemAtcSimultaneousChecked">동시 복용만 검색</el-checkbox>

                    <div class="conditional-search__conditions__item__content-container">
                        <el-button type="primary" icon="el-icon-plus" circle
                                   v-on:click="showAtcSearchModal = true" />
                    </div>

                    <div class="conditional-search__conditions__item__button-container">
                        <el-button v-for="code in atcList" v-bind:key="code"
                                   v-html="code"
                                   v-on:click="clickAtc(code)" round />
                    </div>

                </div>

                <div class="conditional-search__conditions__item">

                    <el-checkbox class="conditional-search__conditions__item__check" v-model="itemNumberChecked" />

                    <span class="conditional-search__conditions__item__title">
                        동시 복용 약물 개수
                        <el-tooltip class="item" effect="dark" placement="top" style="margin-left: 10px;">
                            <div slot="content">
                                n개 이상의 약물을 동시에 처방 받은 경우에 대해서 검색합니다.
                                <br>
                                (처방 시작 시간이 달라도 복용 기간이 겹치면 검색 가능)
                            </div>
                            <el-button icon="el-icon-thumb" size="mini" circle />
                        </el-tooltip>
                    </span>

                    <div class="conditional-search__conditions__item__content-container">
                        <el-input class="conditional-search__conditions__item__content__age-input" v-model="number" />
                    </div>

                </div>

            </div>

            <el-button type="primary" icon="el-icon-search"
                       v-on:click="clickSearch">검색</el-button>

        </div>

        <div id="conditional-search__table-container" class="card">

            <div class="conditional-search__table__title" v-if="isLoading">검색중...</div>
            <div class="conditional-search__table__title" v-if="!isLoading">검색 결과 : {{searchNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}건</div>

            <div class="divider-horizontal" />

            <div v-if="isLoading" class="loading-indicator" />

            <el-table
                v-if="!isLoading"
                :data="exposureShowList"
                border
                stripe>
                <el-table-column
                    prop="drug_exposure_id"
                    label="ID"
                    width="150px">
                </el-table-column>
                <el-table-column
                    prop="person_id"
                    label="Person ID"
                    width="150px">
                </el-table-column>
                <el-table-column
                    prop="gender_source_value"
                    label="Gender"
                    width="100px">
                </el-table-column>
                <el-table-column
                    prop="age"
                    label="Age"
                    width="100px">
                </el-table-column>
                <el-table-column
                    prop="drug_source_value"
                    :label="`${configs.institution_name} ID`"
                    width="150px">
                </el-table-column>
                <el-table-column
                    prop="drug_concept_id"
                    label="OMOP Concept ID"
                    width="150px">
                </el-table-column>
                <el-table-column
                    prop="atc_cd"
                    label="ATC Code"
                    width="150px">
                </el-table-column>
                <el-table-column
                    prop="start_date"
                    label="Start Date"
                    width="150px">
                </el-table-column>
                <el-table-column
                    prop="sig"
                    label="SIG">
                </el-table-column>
                <el-table-column
                    label="Details"
                    width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini"
                                   v-on:click="clickDetailsDrug(scope.row.drug_concept_id, scope.row.drug_source_value)">약물 정보</el-button>
                        <el-button type="primary" size="mini"
                                   v-on:click="clickDetailsPerson(scope.row.person_id)">환자 정보</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                id="conditional-search__table__pagination"
                background
                layout="prev, pager, next"
                :total="searchNumber"
                @current-change="changeTablePage"
                v-if="!isLoading" />

        </div>

        <!-- Charts -->
        <div class="conditional-search__chart-container">

            <!-- Gender Chart -->
            <div id="conditional-search__chart__gender-container" class="card">

                <div id="conditional-search__chart__gender__title">처방 별 성별 분포</div>
                <div class="divider-horizontal" />

                <div id="conditional-search__chart__gender__canvas-container">
                    <div v-if="isLoadingCount" class="loading-indicator" />
                    <DrugGenderChart v-show="!isLoadingCount"
                                     v-bind:render="!isLoadingCount"
                                     v-bind:chartData="genderCount"
                                     xAxis="gender"
                                     yAxis="number of patients" />
                </div>

            </div>

            <!-- Age Chart -->
            <div id="conditional-search__chart__age-container" class="card">

                <div id="conditional-search__chart__age__title">처방 별 연령 분포</div>
                <div class="divider-horizontal" />

                <div id="conditional-search__chart__age__canvas-container">
                    <div v-if="isLoadingCount" class="loading-indicator" />
                    <DrugAgeChart v-show="!isLoadingCount"
                                  v-bind:render="!isLoadingCount"
                                  v-bind:chartData="ageCount"
                                  xAxis="age"
                                  yAxis="number of patients" />
                </div>

            </div>

            <!-- Person Table -->
            <div id="conditional-search__chart__person-container" class="card">

                <div id="conditional-search__chart__person__title">환자 : {{personCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}명</div>
                <div class="divider-horizontal" />

                <div id="conditional-search__chart__person__canvas-container">
                    <div v-if="isLoading" class="loading-indicator" />

                    <el-table
                        v-if="!isLoading"
                        :data="personShowList"
                        border
                        stripe
                        height="300px">
                        <el-table-column
                            prop="person_id"
                            label="Person ID"
                            width="150px">
                        </el-table-column>
                        <el-table-column
                            prop="gender_source_value"
                            label="Gender"
                            width="100px">
                        </el-table-column>
                        <el-table-column
                            prop="age"
                            label="Age"
                            width="100px">
                        </el-table-column>
                        <el-table-column
                            label="Details"
                            width="150px">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini"
                                           v-on:click="clickDetailsPerson(scope.row.person_id)">환자 정보</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination
                        id="conditional-search__person__pagination"
                        background
                        layout="prev, pager, next"
                        :total="personCount"
                        @current-change="changePersonPage"
                        v-if="!isLoading" />

                </div>

            </div>

        </div>

        <ConditionSearchModal v-if="showConditionSearchModal"
                              v-on:choose="chosenCondition"
                              v-on:close="showConditionSearchModal = false" />

        <DrugSearchModal v-if="showDrugSearchModal"
                         v-on:choose="chosenDrug"
                         v-on:close="showDrugSearchModal = false" />

        <AtcSearchModal v-if="showAtcSearchModal"
                        v-on:choose="chosenAtc"
                        v-on:close="showAtcSearchModal = false" />

    </div>
</template>

<script>
    import requests from '../../../requests';
    import DrugGenderChart from '../../chart/drug/DrugGenderChart';
    import DrugAgeChart from '../../chart/drug/DrugAgeChart_v2';
    import ConditionSearchModal from '../../modal/ConditionSearchModal';
    import DrugSearchModal from '../../modal/DrugSearchModal';
    import AtcSearchModal from '../../modal/AtcSearchModal';
    import config from '../../../config.json';

    function chosenCondition(conceptId, conceptName) {

        this.conditionList.push({
            id: conceptId,
            name: conceptName
        });
        this.showConditionSearchModal = false;
        this.itemConditionChecked = true;

    }

    function clickCondition(conceptId) {

        // remove drugId
        this.conditionList.splice(this.conditionList.indexOf(conceptId), 1);

    }

    function chosenDrug(drugId) {

        this.drugList.push(drugId);
        this.showDrugSearchModal = false;
        this.itemDrugChecked = true;

    }

    function clickDrug(drugId) {

        // remove drugId
        this.drugList.splice(this.drugList.indexOf(drugId), 1);

    }

    function chosenAtc(code) {

        this.atcList.push(code);
        this.showAtcSearchModal = false;
        this.itemAtcChecked = true;

    }

    function clickAtc(code) {

        // remove drugId
        this.atcList.splice(this.atcList.indexOf(code), 1);

    }

    async function clickSearch() {

        if(!this.itemConditionChecked && !this.itemDrugChecked && !this.itemAtcChecked && !this.itemNumberChecked) {

            alert('Condition, 약물 코드, ATC 코드, 동시 복용 약물 개수 중 하나는 반드시 선택하십시오.');
            return;

        }

        if(!this.itemAgeChecked && !this.itemConditionChecked && !this.itemDrugChecked && !this.itemAtcChecked && this.itemNumberChecked) {

            alert('동시 복용 약물 개수는 나이, Condition, 약물 코드, ATC 코드 중 하나와 반드시 같이 선택되어야 합니다.');
            return;

        }

        let age;
        let gender;
        let conditionType;
        let conditionList;
        let drugType;
        let drugList;
        let drugSimultaneous;
        let atcType;
        let atcList;
        let atcSimultaneous;
        let simultaneousNumber;

        if(this.itemAgeChecked) {

            age = [this.ageMin, this.ageMax];

        }

        if(this.itemGenderChecked) {

            if(this.manChecked && !this.womanChecked) gender = 'M';
            else if(!this.manChecked && this.womanChecked) gender = 'F';

        }

        if(this.itemConditionChecked) {

            conditionType = this.conditionType;
            conditionList = this.conditionList.map((v) => v.id);

        }

        if(this.itemDrugChecked) {

            drugType = this.drugType;
            drugList = this.drugList;
            drugSimultaneous = this.itemDrugSimultaneousChecked;

        }

        if(this.itemAtcChecked) {

            atcType = this.atcType;
            atcList = this.atcList;
            atcSimultaneous = this.itemAtcSimultaneousChecked;

        }

        if(this.itemNumberChecked) {

            simultaneousNumber = this.number;

        }

        try {

            this.isLoading = true;
            this.isLoadingCount = true;
            this.exposureList = [];
            this.exposureShowList = [];
            this.searchNumber = 0;
            this.personCount = 0;

            this.exposureList = await requests.search.conditionalSearch(age, gender, conditionType, conditionList, drugType, drugList, drugSimultaneous, atcType, atcList, atcSimultaneous, simultaneousNumber);
            this.exposureShowList = this.exposureList.slice(0, 10);
            this.searchNumber = this.exposureList.length;

            const personListObj = {};
            const personList = [];
            let personCount = 0;

            for(const item of this.exposureList) {
                if(!(item.person_id in personListObj)) {
                    personListObj[item.person_id] = { gender_source_value: item.gender_source_value, age: item.age };
                    personCount += 1;
                }
            }

            for (const [key, value] of Object.entries(personListObj)) {
                personList.push({
                    person_id: key,
                    gender_source_value: value.gender_source_value,
                    age: value.age
                })
            }

            this.personList = personList;
            this.personShowList = this.personList.slice(0, 10);
            this.personCount = personCount;

            this.isLoading = false;

            await this.loadCount(age, gender, conditionType, conditionList, drugType, drugList, drugSimultaneous, atcType, atcList, atcSimultaneous, simultaneousNumber);

            this.isLoadingCount = false;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function loadCount(age, gender, conditionType, conditionList, drugType, drugList, drugSimultaneous, atcType, atcList, atcSimultaneous, simultaneousNumber) {

        try {

            const drugCount = await requests.search.conditionalSearchChart(age, gender, conditionType, conditionList, drugType, drugList, drugSimultaneous, atcType, atcList, atcSimultaneous, simultaneousNumber);

            let totalCount = 0;
            let maleCount = 0;
            let femaleCount = 0;
            let maleAgeCount = {};
            let femaleAgeCount = {};
            let allAgeCount = {};

            for(const item of drugCount) {

                const gender = item.gender;
                const age = item.age;
                const count = Number(item.count);

                totalCount += count;

                if(!(age in allAgeCount)) allAgeCount[age] = 0;
                if(!(age in maleAgeCount)) maleAgeCount[age] = 0;
                if(!(age in femaleAgeCount)) femaleAgeCount[age] = 0;
                if(gender === 'M') {

                    maleCount += count;
                    maleAgeCount[age] += count;

                } else if(gender === 'F') {

                    femaleCount += count;
                    femaleAgeCount[age] += count;

                }

                allAgeCount[age] += count;

            }

            let allAgeList = [];
            for(const key in allAgeCount) allAgeList.push({ age: Number(key), number: allAgeCount[key] });
            let maleAgeList = [];
            for(const key in maleAgeCount) maleAgeList.push({ age: Number(key), number: maleAgeCount[key] });
            let femaleAgeList = [];
            for(const key in femaleAgeCount) femaleAgeList.push({ age: Number(key), number: femaleAgeCount[key] });

            this.totalCount = totalCount;
            this.genderCount = {
                male: maleCount,
                female: femaleCount
            };
            this.ageCount = {
                all: allAgeList,
                male: maleAgeList,
                female: femaleAgeList
            };
            console.log(this.ageCount);
        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    function clickDetailsDrug(drugId, institutionId) {

        window.open('/engine/drug/' + drugId + '/' + institutionId, '_blank');

    }

    function clickDetailsPerson(personId) {

        window.open('/engine/person/' + personId, '_blank');

    }

    function changeTablePage(val) {

        const start = (val-1) * 10;
        const end = start + 10;

        this.exposureShowList = this.exposureList.slice(start, end);

    }

    function changePersonPage(val) {

        const start = (val-1) * 10;
        const end = start + 10;

        this.personShowList = this.personList.slice(start, end);

    }

    export default {
        data() {
            return {
                typeList: [
                    {
                        value: 'and',
                        label: 'AND'
                    },
                    {
                        value: 'or',
                        label: 'OR'
                    }
                ],

                itemAgeChecked: false,
                ageMin: 0,
                ageMax: 100,

                itemGenderChecked: false,
                manChecked: true,
                womanChecked: true,

                itemConditionChecked: false,
                conditionType: 'and',
                conditionList: [],

                itemDrugChecked: false,
                drugType: 'and',
                itemDrugSimultaneousChecked: false,
                drugList: [],

                itemAtcChecked: false,
                atcType: 'and',
                itemAtcSimultaneousChecked: false,
                atcList: [],

                itemNumberChecked: false,
                number: 10,

                isLoading: false,
                exposureList: [],
                exposureShowList: [],
                searchNumber: 0,

                personCount: 0,
                personList: [],
                personShowList: [],

                isLoadingCount: false,
                totalCount: 0,
                genderCount: {
                    male: 0,
                    female: 0
                },
                ageCount: {
                    all: 0,
                    male: 0,
                    female: 0
                },

                showConditionSearchModal: false,
                showDrugSearchModal: false,
                showAtcSearchModal: false,
                configs: config
            }
        },

        methods: {
            chosenCondition,
            clickCondition,
            chosenDrug,
            clickDrug,
            chosenAtc,
            clickAtc,
            clickSearch,
            loadCount,
            clickDetailsDrug,
            clickDetailsPerson,
            changeTablePage,
            changePersonPage
        },

        components: {
            ConditionSearchModal,
            DrugSearchModal,
            AtcSearchModal,
            DrugGenderChart,
            DrugAgeChart
        }
    };
</script>

<style scoped>
    #conditional-search-container {
        height: 100%;
        width: 100%;

        overflow: auto;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #conditional-search__conditions-container {
        width: 90%;
        margin: 30px 0;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .conditional-search__conditions__title {
        font-weight: 700;
        font-size: 18px;
    }

    #conditional-search__conditions__person-container {
        width: 90%;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    #conditional-drug-container {
        width: 90%;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .conditional-search__conditions__item {
        width: 100%;
        margin-top: 15px;
        margin-bottom: 15px;
        border-radius: 20px;
        background-color: #EEEEEE;

        display: flex;
        flex-direction: row;
    }

    .conditional-search__conditions__item__check {
        height: 100px;
        margin-left: 30px;
        margin-right: 0;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .conditional-search__conditions__item__title {
        width: 200px;
        margin-left: 30px;
        font-weight: 700;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .conditional-search__conditions__item__type {
        width: 100px;
        margin-left: 30px;

        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .conditional-search__conditions__item__check-simultaneous {
        height: 100px;
        margin-left: 30px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .conditional-search__conditions__item__content-container {
        margin-left: 30px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .conditional-search__conditions__item__content__age-input {
        width: 70px;
    }

    .conditional-search__conditions__item__button-container {
        margin-left: 30px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    #conditional-search__table-container {
        width: 90%;
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .conditional-search__table__title {
        font-weight: 700;
        font-size: 18px;
    }

    #conditional-search__table__pagination {
        margin-top: 15px;
    }

    /* Charts */
    .conditional-search__chart-container {
        width: 90%;
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
    }

    /* Gender Chart */
    #conditional-search__chart__gender-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #conditional-search__chart__gender__title {
        font-weight: 700;
        font-size: 18px;
    }

    #conditional-search__chart__gender__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Age Chart */
    #conditional-search__chart__age-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #conditional-search__chart__age__title {
        font-weight: 700;
        font-size: 18px;
    }

    #conditional-search__chart__age__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* Person Table */
    #conditional-search__chart__person-container {
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #conditional-search__chart__person__title {
        font-weight: 700;
        font-size: 18px;
    }

    #conditional-search__chart__person__canvas-container {
        width: 100%;
        height: 300px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #conditional-search__person__pagination {
        margin-top: 15px;
    }
</style>
