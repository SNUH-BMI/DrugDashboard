<template>
    <div class="chart-container">
        <el-table
                :data="tableData"
                border
                stripe>
            <el-table-column
                    prop="drug_exposure_id"
                    label="ID"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="drug_concept_id"
                    label="Drug ID"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="drug_name"
                    label="Drug Name"
                    width="400px">
            </el-table-column>
            <el-table-column
                    prop="provider_id"
                    label="Provider"
                    width="100px">
            </el-table-column>
            <el-table-column
                    prop="sig"
                    label="SIG">
            </el-table-column>
            <el-table-column
                    prop="start_date"
                    label="Start Date"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="days_supply"
                    label="Days Supply"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="condition_name"
                    label="Condition Name">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        props: {
            tableData: Array
        }
    };
</script>

<style scoped>
    .chart-container {
        width: 100%;
        height: 100%;
    }
</style>
