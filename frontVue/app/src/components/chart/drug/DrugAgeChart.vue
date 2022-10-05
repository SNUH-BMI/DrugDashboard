<template>
    <div class="chart-container">
        <div id="age-canvas"></div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    function drawChart() {

        this.canvasElement.innerHTML = ''; // clear canvas

        const canvasWidth = this.canvasElement.parentElement.clientWidth;
        const canvasHeight = this.canvasElement.parentElement.clientHeight;
        const paddingUp = 10;
        const paddingDown = 50;
        const paddingRight = 70;
        const paddingLeft = 70;
        const graphWidth = canvasWidth - paddingRight - paddingLeft;
        const graphHeight = canvasHeight - paddingUp - paddingDown;

        const allData = this.chartData.all;
        const maleData = this.chartData.male;
        const femaleData = this.chartData.female;

        const minAge = Math.min(...allData.map((i) => i.age));
        const maxAge = Math.max(...allData.map((i) => i.age));
        let maxNumber = Math.max(...allData.map((i) => i.number));
        const maxNumberSize = Math.pow(10, maxNumber.toString().length - 1);
        const coefficient = maxNumber / maxNumberSize;
        maxNumber = coefficient - Math.floor(coefficient) > 0.5 ? Math.ceil(maxNumber / maxNumberSize) * maxNumberSize : (Math.floor(maxNumber / maxNumberSize)+0.5) * maxNumberSize;

        const canvas = d3.select('#age-canvas');

        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

        const xScale = d3
            .scaleLinear()
            .domain([minAge, maxAge])
            .range([0, graphWidth]);

        const xAxis = d3
            .axisBottom(xScale);

        const yScale = d3
            .scaleLinear()
            .domain([0, maxNumber])
            .range([graphHeight, 0]);

        const yAxis = d3
            .axisLeft(yScale);

        const line = d3
            .line()
            .x((d) => xScale(d.age) + paddingLeft)
            .y((d) => yScale(d.number) + paddingUp);

        const tooltip = d3
            .select('body')
            .append('span')
            .attr('class', 'chart-tooltip')
            .style('display', 'none');

        // background
        svg
            .append('rect')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .attr('fill', '#FAFAFA');

        // grid
        svg
            .selectAll('xTick')
            .data(xScale.ticks())
            .enter()
            .append('line')
            .style('stroke', '#DDDDDD')
            .attr('x1', (d) => xScale(d) + paddingLeft + 0.5)
            .attr('y1', () => paddingUp)
            .attr('x2', (d) => xScale(d) + paddingLeft + 0.5)
            .attr('y2', () => paddingUp + graphHeight);

        svg
            .selectAll('yTick')
            .data(yScale.ticks())
            .enter()
            .append('line')
            .style('stroke', '#DDDDDD')
            .attr('x1', () => paddingLeft)
            .attr('y1', (d) => yScale(d) + paddingUp + 0.5)
            .attr('x2', () => paddingLeft + graphWidth)
            .attr('y2', (d) => yScale(d) + paddingUp + 0.5);

        // axis
        svg
            .append('g')
            .attr('transform', `translate(${paddingLeft}, ${canvasHeight-paddingDown})`)
            .call(xAxis);

        svg
            .append('text')
            .attr('class', 'x-axis')
            .attr('x', canvasWidth/2)
            .attr('y', canvasHeight - 10)
            .text(this.xAxis);

        svg
            .append('g')
            .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
            .call(yAxis);

        svg
            .append('text')
            .attr('class', 'y-axis')
            .attr('x', -canvasHeight/2)
            .attr('y', 10)
            .text(this.yAxis);

        // legend
        svg
            .append('circle')
            .attr('cx', canvasWidth - 60)
            .attr('cy', canvasHeight/2 - 20)
            .attr('r', 4)
            .style('fill', '#388E3C')

        svg
            .append('text')
            .attr('x', canvasWidth - 50)
            .attr('y', canvasHeight/2 - 20)
            .style('font-size', '11px')
            .attr('alignment-baseline', 'middle')
            .text('All');

        svg
            .append('circle')
            .attr('cx', canvasWidth - 60)
            .attr('cy', canvasHeight/2)
            .attr('r', 4)
            .style('fill', '#303F9F')

        svg
            .append('text')
            .attr('x', canvasWidth - 50)
            .attr('y', canvasHeight/2)
            .style('font-size', '11px')
            .attr('alignment-baseline', 'middle')
            .text('Male');

        svg
            .append('circle')
            .attr('cx', canvasWidth - 60)
            .attr('cy', canvasHeight/2 + 20)
            .attr('r', 4)
            .style('fill', '#C2185B')

        svg
            .append('text')
            .attr('x', canvasWidth - 50)
            .attr('y', canvasHeight/2 + 20)
            .style('font-size', '11px')
            .attr('alignment-baseline', 'middle')
            .text('Female');

        // all
        svg
            .append('path')
            .datum(allData)
            .attr('fill', 'none')
            .attr('stroke', '#388E3C')
            .attr('stroke-width', '1.5px')
            .attr('d', line);

        svg
            .selectAll('allDot')
            .data(allData)
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d.age))
            .attr('cy', (d) => yScale(d.number))
            .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
            .attr('r', 3)
            .attr('fill', '#00000000')
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', (d) => {
                tooltip.style('left', (d3.event.pageX + 10) + 'px');
                tooltip.style('top', (d3.event.pageY - 10) + 'px');
                tooltip.html(
                    `All<br>
                    Age : ${d.age}<br>
                    Number : ${d.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                );
            });

        // male
        svg
            .append('path')
            .datum(maleData)
            .attr('fill', 'none')
            .attr('stroke', '#303F9F')
            .attr('stroke-width', '1.5px')
            .attr('d', line);

        svg
            .selectAll('allDot')
            .data(maleData)
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d.age))
            .attr('cy', (d) => yScale(d.number))
            .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
            .attr('r', 3)
            .attr('fill', '#00000000')
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', (d) => {
                tooltip.style('left', (d3.event.pageX + 10) + 'px');
                tooltip.style('top', (d3.event.pageY - 10) + 'px');
                tooltip.html(
                    `All<br>
                    Age : ${d.age}<br>
                    Number : ${d.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                );
            });

        // female
        svg
            .append('path')
            .datum(femaleData)
            .attr('fill', 'none')
            .attr('stroke', '#C2185B')
            .attr('stroke-width', '1.5px')
            .attr('d', line);

        svg
            .selectAll('allDot')
            .data(femaleData)
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d.age))
            .attr('cy', (d) => yScale(d.number))
            .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
            .attr('r', 3)
            .attr('fill', '#00000000')
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', (d) => {
                tooltip.style('left', (d3.event.pageX + 10) + 'px');
                tooltip.style('top', (d3.event.pageY - 10) + 'px');
                tooltip.html(
                    `All<br>
                    Age : ${d.age}<br>
                    Number : ${d.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                );
            });

    }

    export default {
        props: {
            render: Boolean,
            chartData: Object,
            xAxis: String,
            yAxis: String
        },

        computed: {
            canvasElement() { return document.getElementById('age-canvas'); }
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
</style>
