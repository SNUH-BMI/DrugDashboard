<template>
    <div class="chart-container">
        <div id="gender-canvas"></div>
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
        const paddingRight = 10;
        const paddingLeft = 70;
        const graphWidth = canvasWidth - paddingRight - paddingLeft;
        const graphHeight = canvasHeight - paddingUp - paddingDown;

        const data = this.chartData;
        let maxValue = data.male > data.female ? data.male : data.female;
        const maxValueSize = Math.pow(10, maxValue.toString().length - 1);
        maxValue = Math.ceil(maxValue / maxValueSize) * maxValueSize;

        const canvas = d3.select('#gender-canvas');

        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

        const xScale = d3
            .scaleBand()
            .domain(['male', 'female'])
            .range([0, graphWidth]);

        const xAxis = d3
            .axisBottom(xScale);

        const yScale = d3
            .scaleLinear()
            .domain([0, maxValue])
            .range([graphHeight, 0]);

        const yAxis = d3
            .axisLeft(yScale);

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
            .attr('x', (canvasWidth - paddingLeft - paddingRight)/2 + paddingLeft)
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

        // male
        svg
            .append('rect')
            .attr('width', '100px')
            .attr('height', graphHeight - yScale(data.male))
            .attr('fill', '#303F9F')
            .attr('x', paddingLeft + xScale('male') + graphWidth/4 - 50)
            .attr('y', yScale(data.male) + paddingUp)
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', () => {
                tooltip.style('left', (d3.event.pageX + 10) + 'px');
                tooltip.style('top', (d3.event.pageY - 10) + 'px');
                tooltip.html(
                    `Male<br>
                    Value : ${data.male.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                );
            });

        // female
        svg
            .append('rect')
            .attr('width', '100px')
            .attr('height', graphHeight - yScale(data.female))
            .attr('fill', '#C2185B')
            .attr('x', paddingLeft + xScale('female') + graphWidth/4 - 50)
            .attr('y', yScale(data.female) + paddingUp)
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', () => {
                tooltip.style('left', (d3.event.pageX + 10) + 'px');
                tooltip.style('top', (d3.event.pageY - 10) + 'px');
                tooltip.html(
                    `Female<br>
                    Value : ${data.female.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
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
            canvasElement() { return document.getElementById('gender-canvas'); }
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
