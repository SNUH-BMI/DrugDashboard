<template>
    <div class="chart-container">
        <div id="quantity-canvas"></div>
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

        const data = this.chartData;

        const minQuantity = Math.min(...data.map((i) => i.quantity));
        const maxQuantity = Math.max(...data.map((i) => i.quantity));
        let maxNumber = Math.max(...data.map((v) => v.number));
        const maxNumberSize = Math.pow(10, maxNumber.toString().length - 1);
        const coefficient = maxNumber / maxNumberSize;
        maxNumber = coefficient - Math.floor(coefficient) > 0.5 ? Math.ceil(maxNumber / maxNumberSize) * maxNumberSize : (Math.floor(maxNumber / maxNumberSize)+0.5) * maxNumberSize;

        const canvas = d3.select('#quantity-canvas');

        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

        const xScale = d3
            .scaleLinear()
            .domain([minQuantity, maxQuantity])
            .range([0, graphWidth]);

        const xAxis = d3
            .axisBottom(xScale)
            .tickFormat(d3.format('~s'));

        const yScale = d3
            .scaleLinear()
            .domain([0, maxNumber])
            .range([graphHeight, 0]);

        const yAxis = d3
            .axisLeft(yScale);

        const line = d3
            .line()
            .x((d) => xScale(d.quantity) + paddingLeft)
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

        // data
        svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#7B1FA2')
            .attr('stroke-width', '1.5px')
            .attr('d', line);

        svg
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d.quantity))
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
                    `Quantity : ${d.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<br>
                    Number : ${d.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                );
            });

    }

    export default {
        props: {
            render: Boolean,
            chartData: Array,
            xAxis: String,
            yAxis: String
        },

        computed: {
            canvasElement() { return document.getElementById('quantity-canvas'); }
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
