<template>
    <div id="about-container">

        <span class="about__title">사이트 소개</span>

            <span>SCDM Drug Search Engine은 약물에 대한 데이터를 쉽게 볼 수 있는 웹사이트입니다.</span>

            <span><a href="https://sites.google.com/view/snuh-bmi-lab" target="_blank">서울대학교병원 융합의학과 의생명정보학연구실</a>에서 개발 중입니다.</span>

        <div style="margin-bottom: 50px;" />

        <span class="about__title">사이트 기능</span>

        <span class="about__title__sub">1. 쿼리 검색</span>

            <span>이름 또는 ID로 약물을 검색할 수 있습니다.</span>

            <img class="about__image" src="../../assets/about/1_query_search.png">

        <div style="margin-bottom: 30px;" />

        <span class="about__title__sub">2. 조건 검색</span>

            <span>환자의 나이, 성별, 질병, 약물, 동시에 복용한 약물의 개수 등으로 약물 처방을 검색할 수 있습니다.</span>

            <img class="about__image" src="../../assets/about/2_conditional_search.png">

        <div style="margin-bottom: 30px;" />

        <span class="about__title__sub">3. 약물 정보</span>

            <span>약물의 처방 분포, 병용 약물, 진단명 등을 볼 수 있습니다.</span>

            <img class="about__image" src="../../assets/about/3_drug.png">

        <div style="margin-bottom: 30px;" />

        <span class="about__title__sub">4. 약물 복용량 분석</span>

            <span>환자별 약물의 총 복용량을 상세하게 확인할 수 있습니다.</span>

            <img class="about__image" src="../../assets/about/4_drug_quantity_analysis.png">

        <div style="margin-bottom: 30px;" />

        <span class="about__title__sub">5. 성분 정보</span>

            <span>어떤 성분이 포함된 약물의 목록을 볼 수 있습니다.</span>

            <img class="about__image" src="../../assets/about/5_ingredient.png">

        <div style="margin-bottom: 30px;" />

        <span class="about__title__sub">6. 환자 정보</span>

            <span>환자의 방문 분포, 처방 기록, 성분 노출 타임라인 등을 볼 수 있습니다.</span>

            <img class="about__image" src="../../assets/about/6_person.png">

        <div style="margin-bottom: 50px;" />

        <span class="about__title">문의</span>

            <span>요청이나 문의사항은 아래 이메일로 전송해주세요.</span>

            <span>주영환 연구원 : <a href="mailto:rulyox@gmail.com">rulyox@gmail.com</a></span>

        <div style="margin-bottom: 50px;" />

    </div>
</template>

<script>
export default { };
</script>

<style scoped>
    #about-container {
        width: 100%;
        padding: 30px;

        display: flex;
        flex-direction: column;
    }

    .about__title {
        font-size: 30px;
        font-weight: 700;

        margin-bottom: 30px;
    }

    .about__title__sub {
        font-size: 20px;
        font-weight: 700;

        margin-bottom: 20px;
    }

    .about__image {
        width: 1000px;
        margin: 10px 0;
        border-radius: 20px;
        border: #222222 1px solid;
    }
</style>
