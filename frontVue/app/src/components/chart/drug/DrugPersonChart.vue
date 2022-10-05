<template>
    <div class="chart-container">
        <el-table
                :data="tableData"
                border
                stripe
                height="250px">
            <el-table-column
                    prop="person_id"
                    label="Person ID">
            </el-table-column>
            <el-table-column
                    prop="year_of_birth"
                    label="Birth Year">
            </el-table-column>
            <el-table-column
                    prop="month_of_birth"
                    label="Birth Month">
            </el-table-column>
            <el-table-column
                    prop="gender_source_value"
                    label="Gender">
            </el-table-column>
            <el-table-column
                    prop="quantity"
                    label="Quantity">
            </el-table-column>
            <el-table-column
                    label="Details">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"
                               v-on:click="clickPerson(scope.row.person_id)">상세 정보</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    function clickPerson(personId) {

        window.open('/engine/person/' + personId, '_blank');

    }

    export default {
        props: {
            tableData: Array
        },

        methods: {
            clickPerson
        }
    };
</script>

<style scoped>
    .chart-container {
        width: 100%;
        height: 100%;
    }
</style>
