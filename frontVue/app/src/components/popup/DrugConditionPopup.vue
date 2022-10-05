<template>

    <div class="drug__chart-container">
        <div id="drug__chart__togetherPcondition-container">

        <div id="drug__chart__togetherPcondition__title">{{condition}} 진단 시 {{institutionId}}와 병용 약물</div>
        <div class="divider-horizontal" />

        <div id="drug__chart__togetherPcondition__table-container">
            <div v-if="isLoading" class="loading-indicator" />
            <el-table
                    v-show="!isLoading"
                    :data="usedTogetherPerCondition"
                    border
                    stripe
                    height="300px">
                <el-table-column
                        prop="count"
                        label="병용 처방 횟수"
                        width="150"
                        :formatter ="(row,col,cellVal)=>cellVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')">
                </el-table-column>
                <el-table-column
                        prop="drug_concept_id"
                        label="OMOP Concept ID"
                        width="150">
                </el-table-column>
                <el-table-column
                    prop="drug_source_value"
                    :label="`${configs.institution_name} ID`"
                    width="90">
                </el-table-column>
                <el-table-column
                        prop="concept_name"
                        label="OMOP Concept Name">
                </el-table-column>
                <el-table-column
                        label="Details"
                        width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" v-on:click="clickDrug(scope.row.drug_concept_id, scope.row.drug_source_value)">상세 정보</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        </div>
    </div>
</template>

<script>
    import requests from '../../requests';
    import config from '../../config.json';

    async function loadData() {

        this.isLoading = true;
        await this.loadTogetherPerCondition();
        this.isLoading = false;
    }

    async function loadTogetherPerCondition() {

        try {

            this.usedTogetherPerCondition = await requests.drug.getDrugTogetherPerCondition(this.drugId, this.institutionId, this.condition.replace(/'/g, "''"));

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    function clickDrug(conceptId, institutionId) {

        window.open('/drug/' + conceptId + '/' + institutionId, '_blank');

    }

    export default {
        props: {
            drugId: String,
            institutionId: String,
            condition: String
        },

        data() {
            return {
                isLoading:false,
                usedTogetherPerCondition: [],
                configs: config
            }
        },

        mounted() {
            this.loadData();
        },

        methods: {
            clickDrug,
            loadData,
            loadTogetherPerCondition
        }
    };
</script>

<style scoped>
    .drug__chart-container {
        width: 100%;
        height: 100%;

        background-color: #FAFAFA
    }

    #drug__chart__togetherPcondition-container{
        height: 100%;
        margin-left: 15px;
        margin-right: 15px;

        flex: 1;
        display: flex;
        flex-direction: column;
        align-items:center;
        justify-content: center;
    }

    #drug__chart__togetherPcondition__title {
        font-weight: 700;
        font-size: 18px;
    }

    #drug__chart__togetherPcondition__table-container{
        width: 100%;
        height: 330px;

        display:flex;
        align-items: center;
        justify-content: center;
    }

    .el-table >>> .el-table__body-wrapper{
        height: 330px;
    }
</style>
