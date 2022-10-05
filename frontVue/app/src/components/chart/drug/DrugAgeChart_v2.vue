<template>
    <div class="chart-container">
        <div id="age-canvas"/>
        <div id="x-axis"/>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    function drawChart() {

        this.canvasElement.innerHTML = ''; // clear canvas
        this.axisElement.innerHTML = ''; // clear axis

        const canvasWidth = this.canvasElement.parentElement.clientWidth;
        const margin = {
            top: 50,
            right: 10,
            bottom: 0,
            left: 10,
            middle: 20
        };

        const sectorWidth = canvasWidth/2 - margin.middle;
        const leftBegin = sectorWidth - margin.left;
        const rightBegin = canvasWidth - margin.right - sectorWidth;

        const graphWidth = canvasWidth - (margin.left + margin.right);
        const graphHeight = canvasWidth - (margin.top + margin.bottom);

        const maleData = this.chartData.male;
        const femaleData = this.chartData.female;

        const canvas = d3.select('#age-canvas');

        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', graphHeight + 40);

        const xAxisSvg = d3.select('#x-axis')
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', 20)
            .append('g');

        const legend = svg.append('g')
            .attr('class', 'legend');

        legend.append('rect')
            .attr('class', 'bar male')
            .attr('x', graphWidth/2 - (margin.middle * 3))
            .attr('y', 12)
            .attr('width', 8)
            .attr('height', 8)
            .attr('fill', '#303F9F');

        legend.append('text')
            .attr('fill', '#000')
            .attr('x', graphWidth/2 - (margin.middle * 2))
            .attr('y', 18)
            .attr('dy', '0.28em')
            .text('Male')
            .attr('font-size', '12px');

        legend.append('rect')
            .attr('class', 'bar female')
            .attr('x', graphWidth/2 + (margin.middle * 2))
            .attr('y', 12)
            .attr('width', 8)
            .attr('height', 8)
            .attr('fill', '#C2185B');

        legend.append('text')
            .attr('fill', '#000')
            .attr('x', graphWidth/2 + (margin.middle * 3))
            .attr('y', 18)
            .attr('dy', '0.28em')
            .text('Female')
            .attr('font-size', '12px');

        const pyramid = svg.append('g')
            .attr('class', 'inner-region')
            .attr('transform', `translate(${margin.left*1.5}, ${margin.top})`);

        const maxValue = Math.ceil(Math.max(
            d3.max(maleData, d=>d.number),
            d3.max(femaleData, d=>d.number)
        ))*1.05;

        // scales
        const xScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, (sectorWidth-margin.middle)])
            .nice();
        
        const yScale = d3.scaleBand()
            .domain(maleData.map(d => d.age))
            .rangeRound([graphHeight, 0])
            .padding(0.1);

        // axes
        const xMAxis = d3.axisBottom()
            .scale(xScale.copy().range([leftBegin, 0]))
            .tickFormat(d3.format('~s'));

        const xFAxis = d3.axisBottom()
            .scale(xScale)
            .tickFormat(d3.format('~s'));

        const yMAxis = d3.axisRight()
            .scale(yScale)
            .tickSize(4, 0)
            .tickPadding(margin.middle -4);

        const yFAxis = d3.axisLeft()
            .scale(yScale)
            .tickSize(4, 0)
            .tickFormat('');

        // make groups for each side of chart
        const maleGroup = pyramid.append('g')
            .attr('transform', `translate(${leftBegin}, 0)scale(-1, 1)`);

        const femaleGroup = pyramid.append('g')
            .attr('transform', `translate(${rightBegin}, 0)`);

        // tooltip
        const tooltip = d3
            .select('body')
            .append('span')
            .attr('class','chart-tooltip')
            .style('font-size', '13px')
            .style('display','none');

        // draw axes
        pyramid.append('g')
            .attr('class', 'axis y male')
            .attr('transform', `translate(${leftBegin},0)`)
            .call(yMAxis)
            .selectAll('text')
            .style('text-anchor', 'middle');

        pyramid.append('g')
            .attr('class', 'axis y female')
            .attr('transform', `translate(${rightBegin}, 0)`)
            .call(yFAxis);
        // draw bars
        let box_height = (yScale.range()[0]/maleData.length) - margin.middle /2;
        if(box_height < 5) box_height = 5;
        maleGroup.selectAll('.bar.male')
            .data(maleData)
            .enter().append('rect')
            .attr('class', 'bar male')
            .attr('x', 0)
            .attr('y', d => yScale(d.age) + margin.middle/4)
            .attr('width', d => xScale(d.number))
            .attr('height', box_height)
            .attr('fill', '#303F9F')
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', (d) => {
                tooltip.style('left', (d3.event.pageX + 10) + 'px');
                tooltip.style('top', (d3.event.pageY - 10) + 'px');
                tooltip.html(
                    `남성<br>
                     ${d.age} 세<br>
                     ${d.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (명)`
                );
            });

        box_height = (yScale.range()[0]/femaleData.length) - margin.middle /2;
        if(box_height < 5) box_height = 5;
        femaleGroup.selectAll('.bar.female')
            .data(femaleData)
            .enter().append('rect')
            .attr('class', 'bar female')
            .attr('x', 0)
            .attr('y', d => yScale(d.age) + margin.middle /4)
            .attr('width', d => xScale(d.number))
            .attr('height', box_height)
            .attr('fill', '#C2185B')
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', (d) => {
                tooltip.style('left', (d3.event.pageX + 10) + 'px');
                tooltip.style('top', (d3.event.pageY - 10) + 'px');
                tooltip.html(
                    `여성<br>
                     ${d.age} 세<br>
                     ${d.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (명)`
                );
            });

        // draw fixed x axis
        let xAxisDom = xAxisSvg.selectAll('.x.axis')
        if(xAxisDom.empty()) {
            xAxisDom = xAxisSvg.append('g')
                .attr('class', 'axis x male')
                .attr('transform', `translate(${margin.left*1.5},0)`)
                .call(xMAxis);
        }

        xAxisSvg.append('g')
            .attr('class', 'axis x female')
            .attr('transform', `translate(${margin.left*1.5+rightBegin},0)`)
            .call(xFAxis);

        xAxisSvg.append('text')
            .attr('x', graphWidth/2 + 7)
            .attr('y', 13)
            .attr('font-size', 10)
            .attr('fill', '#000')
            .text('연령');


    }

    export default {
        props: {
            render: Boolean,
            chartData: Object,
            xAxis: String,
            yAxis: String
        },

        computed: {
            canvasElement() { return document.getElementById('age-canvas'); },
            axisElement() { return document.getElementById('x-axis'); }
        },

        watch: {
            render() { if(this.render) this.drawChart(); },
            chartData() { if(this.render) this.drawChart(); }
        },

        methods: {
            drawChart
        }
    };
</script>

<style scoped>
    .chart-container {
        width: 100%;
        height: 100%;
    }

    #age-canvas {
        height: 90%;
        overflow-y: scroll;
    }

    #age-canvas::-webkit-scrollbar {
        display: none;
    }
</style>
