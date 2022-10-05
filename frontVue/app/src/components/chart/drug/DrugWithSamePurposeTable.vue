<template>
    <div class="chart-container">
        <el-table
            :data="tableData"
            border
            stripe
            height="300px">
            <el-table-column
                prop="conceptId"
                label="OMOP Concept ID">
            </el-table-column>
            <el-table-column
                prop="institutionId"
                :label="`${configs.institution_name} ID`">
            </el-table-column>
            <el-table-column
                label="Details"
                width="150px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-on:click="clickDrug(scope.row.conceptId, scope.row.institutionId)">상세 정보</el-button>
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
