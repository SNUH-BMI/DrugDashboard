<template>
    <div class="chart-container">
        <div id="condition-canvas"></div>
        <div id="legend-container"></div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    function drawChart() {

        this.canvasElement.innerHTML = ''; // clear canvas

        const canvasWidth = this.canvasElement.clientWidth;
        const canvasHeight = this.canvasElement.clientHeight;
        const paddingUp = 10;
        const paddingDown = 50;
        const paddingRight = 10;
        const paddingLeft = 10;
        const graphWidth = canvasWidth - paddingRight - paddingLeft;
        const graphHeight = canvasHeight - paddingUp - paddingDown;

        const data = this.chartData;
        const drugId = this.drugId, institutionId = this.institutionId;
        const data_10 = data.slice(0,10);
        const reducer = (acc, cur) => acc + cur;
        const sum_total = data.map(i=>i.number).reduce(reducer, 0);
        const sum_part  = data_10.map(i=>i.number).reduce(reducer, 0);

        let data_11 = JSON.parse(JSON.stringify(data_10));
        data_11[10] = {concept_name: 'etc' , number: sum_total-sum_part};

        const color = d3.scaleOrdinal()
            .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf", "#000000"]);

        const pie = d3.pie()
            .value(d => d.number)
            .sort(null);

        const radius1 = Math.min(graphWidth, graphHeight)/2;
        const donutwidth = radius1 * 0.2;
        const radius2 = radius1 - donutwidth;

        const arcGenerator1 = d3.arc()
            .innerRadius(radius1 * 0.8)
            .outerRadius(radius1 * 0.6)
            .cornerRadius(3)
            .padAngle(0.015);

        const arcGenerator2 = d3.arc()
            .innerRadius(radius2 - donutwidth - 10)
            .outerRadius(radius2 * 0.5)
            .cornerRadius(3)
            .padAngle(0.015);

        const canvas = d3.select('#condition-canvas');
        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);


        const slices1 = svg.append('g')
                .attr('transform', 'translate('+(canvasWidth/2) +','+canvasHeight/2+')');
        const slices2 = svg.append('g')
                .attr('transform', 'translate('+(canvasWidth/2) +','+canvasHeight/2+')');

        slices1
            .append('g')
            .attr('class', 'slices')

        slices1
            .selectAll('path')
            .data(pie(data_11))
            .enter()
            .append('path')
            .attr('d', arcGenerator1)
            .attr('fill', d => color(d.data.concept_name));


        slices2
            .append('g')
            .attr('class', 'slices');

        slices2
            .datum(data_10).selectAll('path')
            .data(pie)
            .enter().append('path')
                .attr('fill', d => color(d.data.concept_name))
                .attr('d', arcGenerator2)
                .on('mouseover', function(d) {
                    slices2.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius1 * 0.38) // radius of tooltip circle
                        .style('fill', color(d.data.concept_name)) // colour based on category mouse is over
                        .style('fill-opacity', 0.35);

                    slices2.append('text')
                        .attr('class', 'toolCircle')
                        .html(`<tspan x="0">${d.data.concept_name}<tspan>
                               <tspan x="0" dy="1.2em">--<tspan/>
                               <tspan x="0" dy="1.2em">전체 진단 중  ${((d.data.number/sum_total)*100).toPrecision(2)}%</tspan>
                               <tspan x="0" dy="1.2em">--<tspan/>
                               <tspan x="0" dy="1.2em">상위 10개 진단 중 ${((d.data.number/sum_part)*100).toPrecision(2)}%</tspan>`)
                        .attr('y', -20)
                        .style('font-size', '0.8em')
                        .style('font-color', 'white')
                        .style('text-anchor', 'middle');

                })
                .on('mouseout', () => d3.selectAll('.toolCircle').remove());

        //legend
        const maxLen = Math.max(...data.map(i => (i.concept_name.length)));
        const containerWidth = maxLen*10;
        const containerHeight = data.length*15.1; //hard-coded

        let indexOfMaxLen;
        for (let i=0; i< data.length; i++) {
            if (data[i].concept_name.length == maxLen){
                indexOfMaxLen = i;
                break;}
        }

        svg.append('text')
            .text(`진단 명: ${(containerHeight/15.1).toLocaleString('en')} (개)`)
            .attr('transform',  'translate(10,50)')


        const legend_container = d3.select('#legend-container')
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight);

        const legend = legend_container
            .selectAll('legend-item')
            .data(pie(data))
            .enter().append('g')
                .attr('transform', function(d, i) {
                    return 'translate(' + (0) + "," + (i*15+20) + ")";
                })
            .attr('class', 'legend-item')


        legend.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', function(d, i) {
                if (i<10) return color(d.data.number);
                else return 'black';
            });

        legend.append('text')
            .text(function(d){
                return d.data.concept_name + " (" + d.data.number.toLocaleString('en')+")"
                })
            .style('font-size', 13)
            .style('cursor', 'pointer')
            .attr('y', 10)
            .attr('x', 15)
            .on('click', function(d) {window.open('/engine/drug/together/' + drugId + '/' + institutionId + '/' + d.data.concept_name, '_blank', 'width=900,height=500') });

        const bbox = document.getElementsByClassName('legend-item')[indexOfMaxLen].getBoundingClientRect();

        legend_container.attr('width', bbox.width);
    }

    export default {
        props: {
            render: Boolean,
            chartData: Array,
            drugId: String,
            institutionId: String
        },

        computed: {
            canvasElement() { return document.getElementById('condition-canvas'); },
            containerElement() {return document.getElementById('legend-container');}
        },

        watch: {
            render() { if(this.render) this.drawChart(); },
            chartData() { if(this.render) this.drawChart(); }
        },

        methods: {
            drawChart
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        height: 100%;
        min-width: 0;

        display: flex;
        flex-direction: row;
    }

    #condition-canvas {
        flex:1;
        height: 100%;
    }

    #legend-container {
        flex: 1;
        max-width: 550px;
        height: 100%;
        overflow: auto;
        white-space: nowrap;
    }
</style>
