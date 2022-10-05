<template>
    <div class="chart-container">
        <el-table
                :data="tableData"
                :default-sort="{prop: 'start_date'}"
                style="font-size: 12px"
                border
                stripe>
            <el-table-column
                    prop="drug_exposure_id"
                    label="ID"
                    width="100px">
            </el-table-column>
            <el-table-column
                    prop="sig"
                    label="SIG"
                    width="200px">
            </el-table-column>
            <el-table-column
                    prop="start_date"
                    label="Start Date"
                    width="150px">
            </el-table-column>
            <el-table-column
                    prop="days_supply"
                    label="Days"
                    width="80px">
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
    .el-table >>> .cell {
        white-space: pre;
    }
</style>
