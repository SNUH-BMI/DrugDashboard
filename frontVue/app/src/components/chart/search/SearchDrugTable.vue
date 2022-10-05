<template>
    <div class="chart-container">
        <el-table
                :data="tableData"
                border
                stripe>
            <el-table-column
                    prop="concept_id"
                    label="OMOP Concept ID"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="concept_name"
                    label="OMOP Concept Name">
            </el-table-column>
            <el-table-column
                    :prop="`${configs.institution_sourcename_column}`"
                    :label="`${configs.institution_name} ID`"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="source_name"
                    :label="`${configs.institution_name} Source Name`">
            </el-table-column>
            <el-table-column
                    prop="vocabulary_id"
                    label="Vocabulary"
                    width="200px">
            </el-table-column>
            <el-table-column
                prop="route"
                label="Route"
                width="100px">
            </el-table-column>
            <el-table-column
                prop="type"
                label="Type"
                width="100px">
            </el-table-column>
            <el-table-column
                    prop="use_count"
                    label="Usage Count"
                    width="200px"
                    :formatter ="(row,col,cellVal)=>cellVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')">
            </el-table-column>
            <el-table-column
                    label="Details"
                    width="150px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-on:click="clickDrug(scope.row.concept_id, scope.row[configs.institution_sourcename_column])" v-if="scope.row.use_count > 0">상세 정보</el-button>
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
                configs: config,
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
