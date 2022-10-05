<template>
    <div class="chart-container">
        <div id="total-exposure-canvas"></div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    const randomColor = () => {

        class Color {

            constructor(r, g, b) {
                this.r = r;
                this.g = g;
                this.b = b;
            }

            toString() {
                return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
            }

        }

        // save last colors to check similarity
        let lastColors = [];

        const colorDifference = (color1, color2) => Math.abs(color1.r - color2.r) + Math.abs(color1.g - color2.g) + Math.abs(color1.b - color2.b);

        const checkSimilarity = (color) => {

            if(lastColors[0] !== undefined && colorDifference(color, lastColors[0]) < 150) return true;
            else if(lastColors[1] !== undefined && colorDifference(color, lastColors[1]) < 150) return true;
            else if(lastColors[2] !== undefined && colorDifference(color, lastColors[2]) < 150) return true;
            else {
                lastColors[2] = lastColors[1];
                lastColors[1] = lastColors[0];
                lastColors[0] = color;
                return false;
            }

        }

        return () => {

            let color;

            // do until a dissimilar color is found
            do {

                // random numbers between 50 and 200
                const r = Math.floor((Math.random() * 150) + 50);
                const g = Math.floor((Math.random() * 150) + 50);
                const b = Math.floor((Math.random() * 150) + 50);

                color = new Color(r, g, b);

            } while (checkSimilarity(color));

            return color.toString();

        };

    };

    function processData() {

        for(const item of this.chartData) {

            const value = item.exposureList;

            const firstYear = value[0].year;
            const lastYear = value[value.length - 1].year;
            if(firstYear < this.firstYear) this.firstYear = firstYear;
            if(lastYear > this.lastYear) this.lastYear = lastYear;

            for(const item of value) {
                const count = Number(item.count);
                if(count > this.maxCount) this.maxCount = count;
            }

        }

    }

    function drawChart() {

        this.processData();

        this.canvasElement.innerHTML = ''; // clear canvas

        const canvasWidth = this.canvasElement.parentElement.clientWidth;
        const canvasHeight = this.canvasElement.parentElement.clientHeight;
        const paddingUp = 10;
        const paddingDown = 50;
        const paddingRight = 70;
        const paddingLeft = 70;
        const graphWidth = canvasWidth - paddingRight - paddingLeft;
        const graphHeight = canvasHeight - paddingUp - paddingDown;

        let maxCount = this.maxCount;
        const maxNumberSize = Math.pow(10, maxCount.toString().length - 1);
        const coefficient = maxCount / maxNumberSize;
        maxCount = coefficient - Math.floor(coefficient) > 0.5 ? Math.ceil(maxCount / maxNumberSize) * maxNumberSize : (Math.floor(maxCount / maxNumberSize)+0.5) * maxNumberSize;

        const canvas = d3.select('#total-exposure-canvas');

        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

        // background
        svg
            .append('rect')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .attr('fill', '#FAFAFA');

        const xScale = d3
            .scaleTime()
            .domain([new Date(this.firstYear, 0), new Date(this.lastYear, 11)])
            .range([0, graphWidth]);

        const xAxis = d3
            .axisBottom(xScale);

        const yScale = d3
            .scaleLinear()
            .domain([0, maxCount])
            .range([graphHeight, 0]);

        const yAxis = d3
            .axisLeft(yScale);

        const line = d3
            .line()
            .x((d) => xScale(new Date(d.year, d.month-1)) + paddingLeft)
            .y((d) => yScale(Number(d.count)) + paddingUp);

        const tooltip = d3
            .select('body')
            .append('span')
            .attr('class', 'chart-tooltip')
            .style('display', 'none');

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
            .call(xAxis.ticks(d3.timeYear).tickPadding(10));

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

        let index = 1;

        const colorGenerator = randomColor();

        for(const item of this.chartData) {

            const color = colorGenerator();

            // line
            svg
                .append('path')
                .datum(item.exposureList)
                .attr('fill', 'none')
                .attr('stroke', color)
                .attr('stroke-width', '1.5px')
                .attr('d', line);

            // dot
            svg
                .selectAll(item.institutionId)
                .data(item.exposureList)
                .enter()
                .append('circle')
                .attr('cx', (d) => xScale(new Date(d.year, d.month-1)))
                .attr('cy', (d) => yScale(d.count))
                .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
                .attr('r', 3)
                .attr('fill', '#00000000')
                .on('mouseover', () => tooltip.style('display', 'block'))
                .on('mouseout', () => tooltip.style('display', 'none'))
                .on('mousemove', (d) => {
                    tooltip.style('left', (d3.event.pageX + 10) + 'px');
                    tooltip.style('top', (d3.event.pageY - 10) + 'px');
                    tooltip.html(
                        `${item.institutionId}<br>
                        Time : ${d.year} / ${d.month}<br>
                        Count : ${d.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    );
                });

            // legend
            svg
                .append('circle')
                .attr('cx', canvasWidth - 60)
                .attr('cy', 20 * index)
                .attr('r', 4)
                .style('fill', color)

            svg
                .append('text')
                .attr('x', canvasWidth - 50)
                .attr('y', 20 * index)
                .style('font-size', '11px')
                .attr('alignment-baseline', 'middle')
                .text(item.institutionId);

            index += 1;

        }

    }

    export default {
        props: {
            render: Boolean,
            chartData: Array,
            xAxis: String,
            yAxis: String,
        },

        data() {
            return {
                firstYear: 9999,
                lastYear: 0,
                maxCount: 0
            }
        },

        computed: {
            canvasElement() { return document.getElementById('total-exposure-canvas'); }
        },

        watch: {
            render() { if(this.render) this.drawChart(); },
            chartData() { if(this.render) this.drawChart(); }
        },

        methods: {
            processData,
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
