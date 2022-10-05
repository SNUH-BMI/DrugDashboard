<template>
    <div class="chart-container">
        <el-table
            :data="tableData"
            border
            stripe
            height="300px">
            <el-table-column
                prop="code"
                label="ATC 코드">
            </el-table-column>
            <el-table-column
                prop="name"
                label="이름">
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
