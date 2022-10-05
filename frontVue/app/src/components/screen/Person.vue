<template>
    <div id="person-container">

        <div id="person-content">

            <!-- Info Overview -->
            <div id="person__info" class="card">
                <div id="person__info__title">환자 정보</div>
                <div class="divider-horizontal" />
                <div class="person__info-container">
                    <div class="person__info__item">
                        <div class="person__info__item__title">ID</div>
                        <div class="person__info__item__text">{{personId}}</div>
                    </div>
                    <div class="person__info__item">
                        <div class="person__info__item__title">성별</div>
                        <div class="person__info__item__text">{{personInfo.gender_source_value}}</div>
                    </div>
                    <div class="person__info__item">
                        <div class="person__info__item__title">출생</div>
                        <div class="person__info__item__text">{{personInfo.year_of_birth}}년 {{personInfo.month_of_birth}}월</div>
                    </div>
                    <div class="person__info__item">
                        <div class="person__info__item__title">지역</div>
                        <div class="person__info__item__text">{{personInfo.location_source_value}}</div>
                    </div>
                </div>
            </div>


            <!-- Charts -->
            <div class="person__chart-container">

                <!-- Condition List -->

                <div id="person__chart__condition-container" class="card">
                    <div class="person__chart__title">진단 명</div>
                    <div class="divider-horizontal" />
                    <div id="person__chart__condition__listbox">
                        <div>
                            <el-input
                                style="width: 75%; padding-right: 7px"
                                placeholder="Filter keyword"
                                v-model="filterCondition" />
                            <el-button type="primary" v-on:click="selectedCondition">적용</el-button>
                        </div>
                        <el-scrollbar style="height:90%">
                            <el-tree
                                v-model="selectedCondition"
                                style="background-color: #FAFAFA"
                                :data="personConditionShow"
                                show-checkbox
                                node-key="id"
                                ref="tree"
                                :filter-node-method="filterNode" />
                        </el-scrollbar>
                    </div>
                </div>

                <!-- Visit Chart -->
                <div id="person__chart__visit-container" class="card">

                    <div class="person__chart__title">병원 방문 분포</div>
                    <div class="divider-horizontal" />
                    <div id="person__chart__visit__canvas-container">
                        <div v-if="isLoadingVisit" class="loading-indicator" />
                        <PersonVisitChart v-show="!isLoadingVisit"
                                           v-bind:render="!isLoadingVisit"
                                           v-bind:chartData="personVisitShow"
                                           xAxis="time"
                                           yAxis="number of visits" />
                    </div>

                </div>

            </div>

            <div class="person__chart-container">

                <!-- Exposure Table -->
                <div class="person__table__exposure-container card">

                    <div class="person__chart__title">약물 처방 기록</div>
                    <div class="divider-horizontal" />

                    <div v-if="isLoadingExposure" class="loading-indicator" />

                    <PersonExposureTable
                            v-if="!isLoadingExposure"
                            v-bind:tableData="personExposureShow_table" />

                    <el-pagination
                            id="person__table__exposure__pagination"
                            v-if="!isLoadingExposure"
                            background
                            layout="prev, pager, next"
                            :total="personExposureList.length"
                            @current-change="changeTablePage" />

                </div>

            </div>

            <div class="person__chart-container">

                <!-- drug ingredient list -->
                <div id="person__chart__ingredient-container" class="card">
                    <div class="person__chart__title">노출된 약물 성분</div>
                    <div class="divider-horizontal" />

                    <div id="person__chart__ingredient__canvas-container">
                        <div v-if="isLoadingEra" class="loading-indicator" />

                        <el-transfer
                            v-if="!isLoadingEra"
                            filterable
                            filter-placeholder="ingredient name"
                            v-model="ingredient"
                            @change="selectedIngredient"
                            :data="personIngredientShow"
                            :titles="['Source', 'Target']"
                            :right-default-checked="[0]">
                        </el-transfer>
                    </div>
                </div>

                <!-- person drug era chart -->
                <div id="person__chart__era-container" class="card">
                    <div class="person__chart__title">약물 성분 노출 타임라인</div>
                    <div class="divider-horizontal" />

                    <div id="person__chart__era__canvas-container">
                        <div v-if="isLoadingEra" class="loading-indicator" />
                        <PersonEraChart
                            v-show="!isLoadingEra"
                            v-bind:render="!isLoadingEra"
                            v-bind:chartData="personEraShow" />
                    </div>
                </div>

            </div>

            <div class="person__chart-container">
                <!-- Exposure Chart -->
                <div id="person__chart__exposure-container" class="card">
                    <div class="person__chart__title">약물 투여량</div>
                    <div class="divider-horizontal" />

                    <div id="person__chart__exposure__canvas-container">
                        <el-select
                            v-model="filterDrug"
                            filterable
                            placeholder="Select"
                            @change="selectedDrug">
                            <el-option-group
                                v-for="group in drugOptions"
                                :key="group.label"
                                :label="group.label"
                                :value="group.label" >
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.key"
                                    :label="item.label"
                                    :value="item.key">
                                </el-option>
                            </el-option-group>
                        </el-select>
                        <PersonExposureChart
                            v-show="!isLoadingExposure"
                            v-bind:render="!isLoadingExposure"
                            v-bind:chartData="personExposureShow_chart"
                            v-bind:yAxis="dose_unit_source_value"/>
                    </div>

                </div>

                <!-- Exposure Table -->
                <div class="person__table__exposure-container card">

                    <div class="person__chart__title">{{filterDrug}} 처방 기록</div>
                    <div class="divider-horizontal" />

                    <div id="person__table__exposure__canvas-container2">
                        <div v-if="isLoadingExposure" class="loading-indicator" />
                        <PersonExposureTable_small
                                v-if="!isLoadingExposure"
                                v-show="!isLoadingExposure"
                                v-bind:tableData="filteredExposureList" />
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
    import requests from '../../requests';
    import PersonVisitChart from '../chart/person/PersonVisitChart';
    import PersonExposureTable from '../chart/person/PersonExposureTable';
    import PersonEraChart from '../chart/person/PersonEraChart';
    import PersonExposureChart from '../chart/person/PersonExposureChart';
    import PersonExposureTable_small from '../chart/person/PersonExposureTable_small';

    async function getPersonData() {

        try {

            this.isLoadingVisit = true;
            this.isLoadingExposure = true;
            this.isLoadingEra = true;

            this.personInfo = await requests.person.getPersonData(this.personId);

            await this.getPersonCondition();
            await this.getPersonVisit();
            this.isLoadingVisit = false;

            await this.getPersonExposure();
            this.isLoadingExposure = false;

            await this.getPersonEra();
            this.isLoadingEra = false;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function getPersonCondition() {

        try {

            const personCondition = await requests.person.getPersonCondition(this.personId);

            let conditionList = {};
            for (const item of personCondition) {
                conditionList[item['concept_id']] = item['concept_name'];
            }

            let personConditionShow = [];
            personConditionShow.push({id:0, label:'ALL', children:[]});
            for (const [key, value] of Object.entries(conditionList))
                personConditionShow[0]['children'].push({id: Number(key), label: String(value.toLowerCase())});

            this.personConditionShow = personConditionShow; // 진단 명 리스트

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function getPersonVisit() {

        try {

            const personVisit = await requests.person.getPersonVisit(this.personId, this.personConditionShow[0]['children'].map(x=> x.id));
            
            let visitDistribution = {}; // max(number of visits) per month can't exceed 31
            for(const item of personVisit) {
                const ymd = item.visit_start_date.substr(0,10); // ex)'2010-02-10'
                const ym = item.visit_start_date.substr(0,7); // ex) '2010-02'
                if(!(ym in visitDistribution)) visitDistribution[ym] = [];
                if(!visitDistribution[ym].includes(ymd)) visitDistribution[ym].push(ymd);
            }
    
            let personVisitShow = [];
            for(const key in visitDistribution) personVisitShow.push({ time: String(key), number: visitDistribution[key].length });
            
            this.$refs.tree.setCheckedKeys([0]);
            this.personVisit = personVisit;
            this.personVisitShow = personVisitShow;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }


    async function getPersonExposure() {

        try {

            const personExposure = await requests.person.getPersonDrugExposure(this.personId);
            let exposureList = personExposure['exposureList'];
            let ingredientList = personExposure['ingredientList'];

            // 약물 투여량 그래프 드롭다운
            const routeSources = ['경구', '주사'];
            let drugOptions = []
            for (let i=0; i<routeSources.length; i++) {
                drugOptions.push({label: routeSources[i], options: []});
                const applicable = exposureList.filter(exp => exp.route_source_value === routeSources[i]);
                for (const a of applicable) {
                    const options = [... new Set(drugOptions[i]['options'].map(i => i.key))]
                    if (options.includes(a.drug_source_value)) continue;
                    drugOptions[i]['options'].push({
                        key: a.drug_source_value,
                        label: a.drug_name
                    });
                }

            }

            this.personExposure = exposureList;
            this.personExposureList = exposureList;
            this.personExposureShow_table = exposureList.slice(0, 10);
            this.personIngredient = ingredientList;
            this.drugOptions = drugOptions;
            this.filterDrug = drugOptions[0]['options'][0]['key'];

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    async function getPersonEra() {

        try {

            const personEra = await requests.person.getPersonDrugEra(this.personId);

            let personEraList = [];
            for(const item of personEra) {
                personEraList.push({
                    drug_concept_id:Number(item.drug_concept_id),
                    concept_name: String(item.concept_name),
                    start_date: String(item.drug_era_start_date.substr(0,10)),
                    end_date: String(item.drug_era_end_date.substr(0,10))});
            }

            let personIngredientList = [];
            const distinct_ingredient = [...new Set(personEraList.map(i=> i.concept_name))];
            for(const item of distinct_ingredient) {
                const concept_id = personEraList.find(v => v.concept_name === item).drug_concept_id;
                personIngredientList.push({key: distinct_ingredient.indexOf(item), label: item, concept_id: concept_id});
            }

            this.personEraList = personEraList;
            this.personIngredientList = personIngredientList;
            this.personIngredientShow = personIngredientList;
            this.personEraShow = personEraList.filter(era => era.concept_name == personIngredientList[0].label);

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    function changeTablePage(val) {

        const start = (val-1) * 10;
        const end = start + 10;

        this.personExposureShow_table = this.personExposureList.slice(start, end);
    }


    function filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
    }
    
    function selectedCondition() {

       const selected = this.$refs.tree.getCheckedKeys();

        // render a new visit chart
        let visitDistribution = {};
        for (const condition of Object.values(selected)) {
            if (condition == 0) continue;
            const selectedVisit = this.personVisit.filter(visit => visit.condition_concept_id === condition);

            for(const item of selectedVisit) {
                const ymd = item.visit_start_date.substr(0,10); // ex)'2010-02-10'
                const ym = item.visit_start_date.substr(0,7); // ex) '2010-02'
                if(!(ym in visitDistribution)) visitDistribution[ym] = [];
                if(!visitDistribution[ym].includes(ymd)) visitDistribution[ym].push(ymd);
            }
        }

        let personVisitShow = [];
        for(const key in visitDistribution) personVisitShow.push({ time: String(key), number: visitDistribution[key].length });

        // render a new drug exposure table
        let personExposureList = this.personExposure.filter(exp => selected.includes(exp.condition_concept_id));
        personExposureList = personExposureList.sort(function (a, b) {
            return a.drug_exposure_id < b.drug_exposure_id? -1: a.drug_exposure_id > b.drug_exposure_id? 1:0;
        });

        // render a new transfer
        let filteredDrug = [... new Set(personExposureList.map(i => i.drug_concept_id))];
        let filteredIngredient = this.personIngredient.filter(v => filteredDrug.includes(v.drug)).map(v => v.ingredient);
        let personIngredientShow = this.personIngredientList.filter(v => filteredIngredient.includes(v.concept_id));

        this.personVisitShow = personVisitShow;
        this.personExposureList = personExposureList;
        this.personExposureShow_table = personExposureList.slice(0,10);
        this.personIngredientShow = personIngredientShow;
        this.ingredient = personIngredientShow.length === 0 ? []: [this.personIngredientShow[0].key];
        this.personEraShow = personIngredientShow.length === 0 ? [] : this.personEraList.filter(era => era.concept_name == personIngredientShow[0].label);

    }
    function selectedIngredient() {
        const selected = this.personIngredientList.filter((v,i) => this.ingredient.includes(i)).map(v => v.label);
        const personEraShow = this.personEraList.filter(era =>selected.includes(era.concept_name));

        this.personEraShow = personEraShow;
    }

    function selectedDrug() {
        const selected = this.filterDrug;
        const exposureList = this.personExposure.filter(i => i.drug_source_value === selected);
        const dose_unit_source_value = exposureList[0].dose_unit_source_value;

        // data for rendering a exposure chart
        
        // drop duplicates: condition 때문에 데이터가 중복 됨. drug_exposure_id 기준으로 중복 제거
        let selectedExposure = [];
        let drug_exposure_ids = []; // function like set()
        let filteredExposureList = [];
        for(const exp of exposureList) {
            if (!drug_exposure_ids.includes(exp.drug_exposure_id)) {
                // for chart
                drug_exposure_ids.push(exp.drug_exposure_id); 
                selectedExposure.push({
                    start_date: String(exp.start_date),
                    days_supply: Number(exp.days_supply),
                    dose_per_day: Number(exp.quantity/exp.days_supply)
                });

                // for table
                filteredExposureList.push({
                    drug_exposure_id : String(exp.drug_exposure_id),
                    start_date: String(exp.start_date),
                    sig: String(exp.sig),
                    days_supply: String(exp.days_supply),
                    condition_name: exposureList.filter(x => x.drug_exposure_id == exp.drug_exposure_id).map(x=>x.condition_name).join("\r\n")
                })
            }
        }

        let personExposureShow_chart = [];
        for(const exp of selectedExposure) {
            const start_date = exp.start_date;
            const days_supply = exp.days_supply;
            let dose_per_day = exp.dose_per_day;

            for(let day=0; day<days_supply; day++) { // 약물 복용 몇 일차?

                let next_day = new Date(start_date);
                next_day.setDate(next_day.getDate() + day); // next_day = start_date + day
                next_day = next_day.toISOString().slice(0,10);

                let former_dose = 0;    // 기존 복용량
                let order_cnt = 1;      // 처방 건수
                if (personExposureShow_chart.map(i => i.date).includes(next_day)) {     // 해당 날짜에 이미 같은 약을 복용하고 있는 경우
                    former_dose = personExposureShow_chart.filter(i => i.date === String(next_day))[0].dose_per_day;    // 해당 날짜의 기존 약물 복용량을 구해 놓는다.
                    personExposureShow_chart = personExposureShow_chart.filter(i => i.date !== String(next_day));       // 업데이트 된 복용량으로 차트를 그리기 위해 해당 날짜의 기록은 삭제한다.
                    order_cnt++;    // 처방 건수는 1만큼 증가 시켜준다.
                }
                personExposureShow_chart.push({
                    date: String(next_day), 
                    dose_per_day: Number(dose_per_day+former_dose), // 업데이트 된 당일 복용량
                    order_count: Number(order_cnt),
                    progress: Number(day)
                })
            }
        }

        // cumulative count
        personExposureShow_chart = personExposureShow_chart.sort((a,b) => new Date(a.date) - new Date(b.date));
        let sum = 0;
        for(let i=0; i<personExposureShow_chart.length; i++) {
            sum += personExposureShow_chart[i].dose_per_day;
            personExposureShow_chart[i].cumulative_dose = sum;
        }

        this.filteredExposureList = filteredExposureList;
        this.personExposureShow_chart = personExposureShow_chart;
        this.dose_unit_source_value = dose_unit_source_value;
    }

    export default {
        props: {
            personId: String
        },

        data() {
            return {
                filterCondition: '',
                filterDrug: '',
                drugOptions:[],
                dose_unit_source_value: '',

                personInfo: {},

                personConditionShow: [],

                personVisit: {},
                personVisitShow: [],
                isLoadingVisit: false,

                personExposure: [],
                personExposureList: [],
                personExposureShow_table: [],
                isLoadingExposure: false,

                filteredExposureList: [],
                personExposureShow_chart: [],


                ingredient: [0],
                personIngredient: [],
                personIngredientList: [],
                personIngredientShow: [],

                personEraList: [],
                personEraShow: [],
                isLoadingEra: false
            }
        },

        watch: {
            filterCondition(value) {
                this.$refs.tree.filter(value);
            },
            filterDrug() {this.selectedDrug();},
            ingredient() {this.selectedIngredient();}


        },

        mounted() {
            this.getPersonData();
        },

        methods: {
            getPersonData,
            getPersonCondition,
            getPersonVisit,
            getPersonExposure,
            getPersonEra,
            changeTablePage,
            filterNode,
            selectedCondition,
            selectedIngredient,
            selectedDrug
        },

        components: {
            PersonVisitChart,
            PersonExposureTable,
            PersonEraChart,
            PersonExposureChart,
            PersonExposureTable_small
        }
    };
</script>

<style scoped>
    .person__chart__title {
        font-weight: 700;
        font-size: 18px;
    }

    #person-container {
        height: 100%;
        width: 100%;
    }

    #person-content {
        padding: 30px;
    }

    /* Info Overview */
    #person__info {
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
    }

    #person__info__title {
        font-weight: 700;
        font-size: 20px;
    }

    .person__info-container {
        display: flex;
        flex-direction: row;
    }

    .person__info__item {
        margin-right: 50px;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .person__info__item__title {
        margin-right: 20px;

        font-weight: 700;
        font-size: 16px;
    }

    .person__info__item__text {
        font-size: 14px;
    }

    /* Charts */
    .person__chart-container {
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
    }

    #person__chart__condition-container {
        width: 20%;

        display: flex;
        flex-direction: column;
        align-items: center;

        margin-right: 20px;
    }

    #person__chart__condition__listbox {
        width: 100%;
        height: 300px;
    }

    .el-scrollbar >>> .el-scrollbar__wrap {
        overflow: auto;
    }

    .el-tree >>> .el-tree-node__label {
        font-size: 12px;
    }

    #person__chart__visit-container {
        width: 80%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #person__chart__visit__canvas-container {

        width: 100%;
        height: 300px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .person__table__exposure-container {
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #person__table__exposure__pagination {
        margin-top: 15px;
    }

    #person__chart__ingredient-container {
        flex: 1.1;
        height: 500px;
        margin-right: 30px;

        display:flex;
        flex-direction: column;
        align-items:  center;
        justify-content: flex-start;
    }

    #person__chart__ingredient__canvas-container {
        width: 100%;
        height: 100%;

        display:flex;
        flex-direction: column;
        align-items:  center;
        justify-content: center;
    }

    .el-transfer >>> .el-transfer__buttons {
        display: inline-flex;
        flex-direction: column;

        padding: 0px 10px;

    }

    .el-transfer >>> .el-transfer__button {
        margin-left: 0px;
        padding: 5px;
    }

    .el-transfer >>> .el-checkbox__label {
        width: fit-content;
        font-size: 12px;
    }

    .el-transfer >>> .el-transfer-panel__body {
        height: 380px;
    }

    .el-transfer >>> .el-transfer-panel__list.is-filterable {
        height: 330px;
    }

    #person__chart__era-container {
        flex:3;
        height: 500px;

        display:flex;
        flex-direction: column;
        align-items:  center;
    }

    #person__chart__era__canvas-container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }


    #person__chart__exposure-container {
        flex: 1;
        margin-right: 30px;

        display: flex;
        flex-direction: column;
        align-items:center;

    }

    #person__chart__exposure__canvas-container {
        width: 100%;
        height: 500px;
    }

    .el-select >>> .el-input__inner {
        width: 300px;
    }

    #person__table__exposure__canvas-container2 {
        width: 100%;
        height: 500px;
        overflow-y: scroll;

        display: flex;
        flex-direction: column;
        align-items:center;
        justify-content: center;
    }
</style>
