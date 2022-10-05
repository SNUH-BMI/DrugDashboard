<template>
    <div id="search-container">

        <div id="search__query-container" class="card">

            <div id="search__query__title">검색</div>

            <div class="divider-vertical" />

            <el-select v-model="category">
                <el-option
                    v-for="item in categoryList"
                    v-bind:key="item.value"
                    v-bind:label="item.label"
                    v-bind:value="item.value">
                </el-option>
            </el-select>

            <el-input class="search__query__input" placeholder="여기에 입력하세요."
                      v-model="searchText"
                      v-on:keydown.native.enter="clickSearch" />

            <el-button type="primary" v-on:click="clickSearch">검색</el-button>

        </div>

        <!-- Table -->
        <div id="search__table-container" class="card">

            <div class="search__table__title" v-if="isLoading">검색중...</div>
            <div class="search__table__title" v-if="!isLoading">검색 결과 : {{searchNumber}}건</div>

            <div class="divider-horizontal" />

            <div v-if="isLoading" class="loading-indicator" />

            <SearchDrugTable
                v-if="!isLoading && (category === 'drug')"
                v-bind:tableData="drugShowList" />

            <SearchIngredientTable
                v-if="!isLoading && (category === 'ingredient')"
                v-bind:tableData="ingredientShowList" />

            <el-pagination
                id="search__table__pagination"
                background
                layout="prev, pager, next"
                :total="searchNumber"
                @current-change="changeTablePage" />

        </div>

    </div>
</template>

<script>
    import requests from '../../../requests';
    import SearchDrugTable from '../../chart/search/SearchDrugTable';
    import SearchIngredientTable from '../../chart/search/SearchIngredientTable';

    async function clickSearch() {

        if(this.searchText.length < 2) {
            alert('2글자 이상 입력해주세요.');
            return;
        }

        this.reset();
        this.isLoading = true;

        try {

            if(this.category === 'drug') {

                this.drugList = await requests.search.searchDrug(this.searchText);
                this.drugShowList = this.drugList.slice(0, 10);
                this.searchNumber = this.drugList.length;

            } else if(this.category === 'ingredient') {

                this.ingredientList = await requests.search.searchIngredient(this.searchText);
                this.ingredientShowList = this.ingredientList.slice(0, 10);
                this.searchNumber = this.ingredientList.length;

            }

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

        this.isLoading = false;

    }

    function changeTablePage(val) {

        const start = (val-1) * 10;
        const end = start + 10;

        if(this.category === 'drug') this.drugShowList = this.drugList.slice(start, end);
        else if(this.category === 'ingredient') this.ingredientShowList = this.ingredientList.slice(start, end);

    }

    function reset() {

        this.searchNumber = 0;
        this.drugList = [];
        this.drugShowList = [];
        this.ingredientList = [];
        this.ingredientShowList = [];

    }

    export default {
        data() {
            return {
                category: 'drug',
                categoryList: [
                    {
                        value: 'drug',
                        label: '약물'
                    },
                    {
                        value: 'ingredient',
                        label: '성분'
                    }
                ],
                searchText: '',
                searchNumber: 0,
                drugList: [],
                drugShowList: [],
                ingredientList: [],
                ingredientShowList: [],
                isLoading: false
            }
        },

        watch: {
            category() { this.reset(); }
        },

        methods: {
            clickSearch,
            changeTablePage,
            reset
        },

        components: {
            SearchDrugTable,
            SearchIngredientTable
        }
    };
</script>

<style scoped>
    #search-container {
        height: 100%;
        width: 100%;

        overflow: auto;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #search__query-container {
        height: 50px;
        margin: 30px 0;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    #search__query__title {
        font-weight: 700;
        font-size: 18px;
    }

    .search__query__input {
        width: 400px;
        margin-left: 15px;
        margin-right: 15px;
    }

    #search__table-container {
        width: 90%;
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .search__table__title {
        font-weight: 700;
        font-size: 18px;
    }

    #search__table__pagination {
        margin-top: 15px;
    }
</style>
