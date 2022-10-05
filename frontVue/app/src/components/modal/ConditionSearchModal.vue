<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div id="condition-search__content">

                        <div id="condition-search__query">

                            <el-input class="condition-search__query__input" placeholder="여기에 입력하세요."
                                      v-model="searchText"
                                      v-on:keydown.native.enter="clickSearch" />

                            <el-button type="primary" v-on:click="clickSearch">검색</el-button>

                        </div>

                        <div id="condition-search__table-container">

                            <div class="condition-search__table__title" v-if="isLoading">검색중...</div>
                            <div class="condition-search__table__title" v-if="!isLoading">검색 결과 : {{searchNumber}}건</div>

                            <div v-if="isLoading" class="loading-indicator" />

                            <el-table
                                v-if="!isLoading"
                                :data="conditionShowList"
                                border
                                stripe>
                                <el-table-column
                                    prop="concept_id"
                                    label="OMOP Concept ID"
                                    width="150px">
                                </el-table-column>
                                <el-table-column
                                    prop="concept_name"
                                    label="Name">
                                </el-table-column>
                                <el-table-column
                                    label="Choose"
                                    width="100px">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="mini"
                                                   v-on:click="$emit('choose', scope.row.concept_id, scope.row.concept_name)">선택</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <el-pagination
                                id="condition-search__table__pagination"
                                background
                                layout="prev, pager, next"
                                :page-size="5"
                                :total="searchNumber"
                                @current-change="changeTablePage" />

                        </div>

                        <el-button id="condition-search__close" type="primary"
                                   v-on:click="$emit('close')">닫기</el-button>

                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import requests from '../../requests';

    async function clickSearch() {

        if(this.searchText.length < 2) {
            alert('2글자 이상 입력해주세요.');
            return;
        }

        this.isLoading = true;

        try {

            const conditionList = await requests.search.searchCondition(this.searchText);

            this.conditionList = conditionList.sort((a,b) => a.concept_name.length - b.concept_name.length || a['concept_name'].localeCompare(b['concept_name']));
            this.conditionShowList = this.conditionList.slice(0, 5);
            this.searchNumber = this.conditionList.length;

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

        this.isLoading = false;

    }

    function changeTablePage(val) {

        const start = (val-1) * 5;
        const end = start + 5;

        this.conditionShowList = this.conditionList.slice(start, end);

    }

    export default {
        data() {
            return {
                searchText: '',
                isLoading: false,
                conditionList: [],
                conditionShowList: [],
                searchNumber: 0
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

    #condition-search__content {
        padding: 50px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #condition-search__query {
        margin-bottom: 30px;

        display: flex;
        flex-direction: row;
    }

    .condition-search__query__input {
        width: 300px;
        margin-right: 30px;
    }

    #condition-search__table-container {
        width: 800px;
        margin-bottom: 30px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .condition-search__table__title {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 15px;
    }

    #condition-search__table__pagination {
        margin-top: 15px;
    }

    #condition-search__close {
        width: 100px;
    }
</style>
