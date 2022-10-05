<template>
    <div class="chart-container">
        <el-table
                :data="tableData"
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
</template>

<script>
    import config from '../../../config.json';
    function clickDrug(conceptId, institutionId) {

        window.open('/engine/drug/' + conceptId + '/' + institutionId, '_blank');

    }

    export default {
        props: {
            tableData: Array
        },

        data() {
            return {
                configs: config
            }
        },

        methods: {
            clickDrug
        }
    };
</script>

<style scoped>
    .chart-container {
        width: 100%;
        height: 100%;
    }
</style>
