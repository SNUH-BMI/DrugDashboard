<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div id="drug-search__content">

                        <div id="drug-search__query">

                            <el-input class="drug-search__query__input" placeholder="여기에 입력하세요."
                                      v-model="searchText"
                                      v-on:keydown.native.enter="clickSearch" />

                            <el-button type="primary" v-on:click="clickSearch">검색</el-button>

                        </div>

                        <div id="drug-search__table-container">

                            <div class="drug-search__table__title" v-if="isLoading">검색중...</div>
                            <div class="drug-search__table__title" v-if="!isLoading">검색 결과 : {{searchNumber}}건</div>

                            <div v-if="isLoading" class="loading-indicator" />

                            <el-table
                                v-if="!isLoading"
                                :data="drugShowList"
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
                                    label="Choose"
                                    width="100px">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="mini"
                                                   v-on:click="$emit('choose', scope.row[configs.institution_sourcename_column])"
                                                   v-if="scope.row.use_count > 0">선택</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <el-pagination
                                id="drug-search__table__pagination"
                                background
                                layout="prev, pager, next"
                                :page-size="5"
                                :total="searchNumber"
                                @current-change="changeTablePage" />

                        </div>

                        <el-button id="drug-search__close" type="primary"
                                   v-on:click="$emit('close')">닫기</el-button>

                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import requests from '../../requests';
    import config from '../../config.json';

    async function clickSearch() {

        if(this.searchText.length < 2) {
            alert('2글자 이상 입력해주세요.');
            return;
        }

        this.isLoading = true;

        try {

            this.drugList = await requests.search.searchDrug(this.searchText);
            this.drugShowList = this.drugList.slice(0, 5);
            this.searchNumber = this.drugList.length;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

        this.isLoading = false;

    }

    function changeTablePage(val) {

        const start = (val-1) * 5;
        const end = start + 5;

        this.drugShowList = this.drugList.slice(start, end);

    }

    export default {
        data() {
            return {
                searchText: '',
                isLoading: false,
                drugList: [],
                drugShowList: [],
                searchNumber: 0,
                configs: config
            }
        },

        methods: {
            clickSearch,
            changeTablePage
        }
    };
</script>

<style scoped>
    .modal-container {
        position: relative;
        width: 90%;
        margin: 0 auto;
        background-color: #FAFAFA;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
    }

    #drug-search__content {
        padding: 50px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #drug-search__query {
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
    }

    .drug-search__query__input {
        width: 300px;
        margin-right: 30px;
    }

    #drug-search__table-container {
        width: 100%;
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .drug-search__table__title {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 15px;
    }

    #drug-search__table__pagination {
        margin-top: 15px;
    }

    #drug-search__close {
        width: 100px;
    }
</style>
