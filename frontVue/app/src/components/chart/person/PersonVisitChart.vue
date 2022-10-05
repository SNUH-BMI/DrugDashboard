<template>
    <div class="chart-container">
        <div id="visit-canvas"></div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    function drawChart() {

        this.canvasElement.innerHTML = ''; // clear canvas

        const canvasWidth = this.canvasElement.parentElement.clientWidth;
        const canvasHeight = this.canvasElement.parentElement.clientHeight;
        const paddingUp = 10;
        const paddingDown = 100;
        const paddingRight = 70;
        const paddingLeft = 70;
        const graphWidth = canvasWidth - paddingRight - paddingLeft;
        const graphHeight = canvasHeight - paddingUp - paddingDown;

        const data = this.chartData;
       
        let maxNumber = Math.max(...data.map((v) => v.number));
        const maxNumberSize = Math.pow(10, maxNumber.toString().length - 1);
        const coefficient = maxNumber / maxNumberSize;
        maxNumber = Math.max(10, coefficient - Math.floor(coefficient) > 0.5 ? Math.ceil(maxNumber / maxNumberSize) * maxNumberSize : (Math.floor(maxNumber / maxNumberSize)+0.5) * maxNumberSize);
        
        const dateFormat = d3.timeFormat("%Y년 %m월");
        const dateParser = d3.timeParse("%Y-%m");
        
        const canvas = d3.select('#visit-canvas');

        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

        const xScale = d3
            .scaleTime()
            .domain([d3.min(data, d => d3.timeMonth.offset(dateParser(d.time), -1 )),
                    d3.max(data, d => dateParser(d.time))])
            .range([0,graphWidth]);

        const xAxis_year = d3
            .axisBottom(xScale);

        const xAxis_month = d3
            .axisBottom(xScale)
            .tickFormat(d3.timeYear.count(xScale.domain()[0], xScale.domain()[1]) !== 0 ?
                        d3.timeFormat("%m"): d3.timeFormat("%b"));

        const yScale = d3
            .scaleLinear()
            .domain([0, maxNumber])
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
            .call(xAxis_year.ticks(d3.timeYear).tickPadding(20))
            .selectAll('.tick text')
            .attr('font-size', '20');

        svg
            .append('g')
            .attr('transform', `translate(${paddingLeft}, ${canvasHeight-paddingDown})`)
            .call(xAxis_month.ticks(d3.timeMonth))
            .selectAll('.tick text')
            .attr('class', 'month')
            .call(function() {
                if (d3.timeYear.count(xScale.domain()[0], xScale.domain()[1]) > 7){
                    svg
                        .selectAll('.tick .month')
                        .remove();
                }
            });
        

        svg.append('text')
            .attr('class', 'x-axis')
            .attr('x', canvasWidth/2)
            .attr('y', canvasHeight - 35)
            .text(this.xAxis);

        svg
            .append('g')
            .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
            .call(yAxis)

        svg
            .append('text')
            .attr('class', 'y-axis')
            .attr('x', -canvasHeight/2)
            .attr('y', 20)
            .text(this.yAxis);

        
            
        svg
            .selectAll(".bar")
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('width', '10px')
            .attr('height', (d) => graphHeight - yScale(d.number))
            .attr('fill', '#fc6f00')
            .attr('x', (d) => xScale(dateParser(d.time))+paddingLeft - 5)
            .attr('y', (d) => yScale(d.number) + paddingUp)
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', (d) => {
                tooltip.style('left', (d3.event.pageX + 10) + 'px');
                tooltip.style('top', (d3.event.pageY - 10) + 'px');
                tooltip.html(
                    `${dateFormat(dateParser(d.time))}<br>
                    ${d.number}회`
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
            canvasElement() { return document.getElementById('visit-canvas'); }
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
