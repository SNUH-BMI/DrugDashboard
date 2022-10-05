<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <i id="drug-exposure__close" class="el-icon-close"
                       v-on:click="$emit('close')" />

                    <div id="drug-exposure__content">

                        <div id="drug-exposure__title">처방 기록</div>

                        <div id="drug-exposure__table-container">
                            <el-table
                                    :data="drugExposureList"
                                    border
                                    stripe
                                    height="500px">
                                <el-table-column
                                        prop="drug_exposure_id"
                                        label="ID">
                                </el-table-column>
                                <el-table-column
                                        prop="person_id"
                                        label="Person">
                                </el-table-column>
                                <el-table-column
                                        prop="provider_id"
                                        label="Provider">
                                </el-table-column>
                                <el-table-column
                                        prop="sig"
                                        label="SIG">
                                </el-table-column>
                                <el-table-column
                                        prop="drug_exposure_start_date"
                                        label="Start Date">
                                </el-table-column>
                                <el-table-column
                                        prop="drug_exposure_end_date"
                                        label="End Date">
                                </el-table-column>
                            </el-table>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import requests from '../../requests';

    async function loadList() {

        try {

            this.drugExposureList = await requests.drug.getDrugExposure(this.drugId, this.institutionId);

        } catch(error) {
            console.log(error);
            alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.');
        }

    }

    export default {
        props: {
            drugId: String,
            institutionId: String
        },

        data() {
            return {
                drugExposureList: []
            }
        },

        mounted() {
            this.loadList();
        },

        methods: {
            loadList
        }
    };
</script>

<style scoped>
    .modal-container {
        position: relative;
        width: 1300px;
        margin: 0 auto;
        background-color: #FAFAFA;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
    }

    #drug-exposure__close {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
    }

    #drug-exposure__content {
        padding: 50px;
        display: flex;
        flex-direction: column;
    }

    #drug-exposure__title {
        font-weight: 700;
        font-size: 20px;

        margin-bottom: 20px;
    }

    #drug-exposure__table-container {
        width: 1200px;
        height: 500px;
    }
</style>
