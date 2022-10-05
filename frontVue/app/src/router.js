import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './components/screen/Home';
import Main from './components/screen/Main';
import Search from './components/screen/search/Search';
import ConditionalSearch from './components/screen/search/ConditionalSearch';
import About from './components/screen/About';
import HealthCheck from './components/screen/HealthCheck';
import Drug from './components/screen/Drug';
import Ingredient from './components/screen/Ingredient';
import DrugAnalysis from './components/screen/DrugAnalysis';
import Person from './components/screen/Person';
import DrugConditionPopup from './components/popup/DrugConditionPopup';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/engine',
            components: { 'appContent': Main }
        },
        {
            path: '/engine',
            components: { 'appContent': Home },
            children: [
                {
                    path: '/engine/query',
                    components: { 'homeContent': Search }
                },
                {
                    path: '/engine/conditional',
                    components: { 'homeContent': ConditionalSearch }
                },
                {
                    path: '/engine/about',
                    components: { 'homeContent': About }
                },
                {
                    path: '/engine/check',
                    components: { 'homeContent': HealthCheck }
                },
                {
                    path: '/engine/drug/ingredient/:ingredientId',
                    components: { 'homeContent': Ingredient },
                    props: { 'homeContent': true }
                },
                {
                    path: '/engine/drug/together/:drugId/:/:condition',
                    components: { 'homeContent': DrugConditionPopup},
                    props: {'homeContent': true}
                },
                {
                    path: '/engine/drug/analysis/drug/:drugId/:institutionId',
                    components: { 'homeContent': DrugAnalysis },
                    props: { 'homeContent': true }
                },
                {
                    path: '/engine/drug/:drugId/:institutionId',
                    components: { 'homeContent': Drug },
                    props: { 'homeContent': true }
                },
                {
                    path: '/engine/person/:personId',
                    components: { 'homeContent': Person },
                    props: { 'homeContent': true }
                }
            ]
        }
    ]
});

export default router;
