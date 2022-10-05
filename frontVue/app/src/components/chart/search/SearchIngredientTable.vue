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
                    prop="vocabulary_id"
                    label="Vocabulary"
                    width="200px">
            </el-table-column>
            <el-table-column
                    prop="drug_count"
                    label="Drug Count"
                    width="200px">
            </el-table-column>
            <el-table-column
                    label="Details"
                    width="150px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"
                               v-on:click="clickIngredient(scope.row.concept_id)"
                               v-if="scope.row.drug_count > 0">상세 정보</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    function clickIngredient(conceptId) {

        window.open('/engine/drug/ingredient/' + conceptId, '_blank');

    }

    export default {
        props: {
            tableData: Array
        },

        methods: {
            clickIngredient
        }
    };
</script>

<style scoped>
    .chart-container {
        width: 100%;
        height: 100%;
    }
</style>
