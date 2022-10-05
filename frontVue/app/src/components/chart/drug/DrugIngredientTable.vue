<template>
    <div class="chart-container">
        <el-table
                :data="tableData"
                border
                stripe
                height="300px">
            <el-table-column
                    prop="concept_id"
                    label="OMOP Concept ID">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="성분명">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="양">
            </el-table-column>
            <el-table-column
                    prop="unit"
                    label="단위">
            </el-table-column>
            <el-table-column
                    label="Details"
                    width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-on:click="clickIngredient(scope.row.concept_id)">상세 정보</el-button>
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
