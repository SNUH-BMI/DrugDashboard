<template>
  <div class="chart-container">
      <div id="exposure-canvas"></div>
  </div>
</template>

<script>
    import * as d3 from 'd3';

    function drawChart() {

        this.canvasElement.innerHTML = ''; // clear canvas

        const canvasWidth = this.canvasElement.parentElement.clientWidth;
        const canvasHeight = this.canvasElement.parentElement.clientHeight;
        const paddingUp = 40;
        const paddingDown = 70;
        const paddingRight = 20;
        const paddingLeft = 90;
        const graphWidth = canvasWidth - paddingRight - paddingLeft;
        const graphHeight = canvasHeight - paddingUp - paddingDown;

        const data = this.chartData;

        const maxValue = Math.max(...data.map(i=>i.cumulative_dose));

        const dateFormat = d3.timeParse("%Y-%m-%d");

        const canvas = d3.select("#exposure-canvas");

        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight-10);

        const xScale = d3
            .scaleTime()
            .domain([d3.min(data, function(d) {return dateFormat(d.date);}),
                     d3.max(data, function(d) {return d3.timeDay.offset(dateFormat(d.date), 1);})
                     ])
            .range([0, graphWidth]);

        const yScale = d3
            .scaleLinear()
            .domain([0, maxValue])
            .range([graphHeight, 0]);

        const xAxis_year = d3
            .axisBottom(xScale);

        const xAxis_month = d3
            .axisBottom(xScale)
            .tickFormat(d3.timeYear.count(xScale.domain()[0], xScale.domain()[1]) !== 0 ?
                        d3.timeFormat("%m"): d3.timeFormat("%b"));

        const xAxis_day = d3
            .axisBottom(xScale);

        const yAxis = d3
            .axisLeft(yScale);

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
            .call(xAxis_year.ticks(d3.timeYear).tickPadding(20))
            .selectAll('.tick text')
            .attr('id', 'year')
            .attr('font-size', '15')
            .selectAll('.year')
            .attr('y', 10);

        svg
            .append('g')
            .attr('transform', `translate(${paddingLeft}, ${canvasHeight-paddingDown})`)
            .call(xAxis_month.ticks(d3.timeMonth))
            .selectAll('.tick text')
            .attr('class', 'month')
            .call(function() {
                if (d3.timeYear.count(xScale.domain()[0], xScale.domain()[1]) > 6){
                    svg
                        .selectAll('.tick .month')
                        .remove();
                }
            });

        svg
            .append('g')
            .attr('transform', `translate(${paddingLeft}, ${canvasHeight-paddingDown})`)
            .call(xAxis_day.ticks(d3.timeDay).tickFormat(d3.timeFormat("%d")).tickPadding(20))
            .selectAll('.tick')
            .attr('class', 'day')
            .call(function() {
                if (d3.timeYear.count(xScale.domain()[0], xScale.domain()[1]) !== 0 ||
                    d3.timeMonth.count(xScale.domain()[0], xScale.domain()[1]) > 1) {
                    svg
                        .selectAll('.day')
                        .remove();
                }
            });

        svg
            .append('g')
            .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
            .call(yAxis)

        // text
        svg
            .append('text')
            .attr('class', 'y axis title')
            .text(`단위: ${this.yAxis}`)
            .attr('x', 10)
            .attr('y', 25)
            .attr('font-size', '12px');

        // lines
        svg
            .append('path')
            .datum(data)
            .attr('class', 'cumulative dose')
            .attr('fill', 'none')
            .attr('stroke', '#303F9F')
            .attr('stroke-width', '1.5px')
            .attr('d', d3.line()
                .x((d) => xScale(dateFormat(d.date)) + paddingLeft)
                .y((d) => yScale(d.cumulative_dose) + paddingUp))

        // exposure point
        svg
            .selectAll('allDot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(dateFormat(d.date)))
            .attr('cy', (d) => yScale(d.cumulative_dose))
            .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
            .attr('r', 3)
            .attr('fill', function(d) {
                if (d.progress === 0) return'#303F9F';
                else return '#00000000';
            })
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', (d) => {
                tooltip.style('left', (d3.event.pageX+10) + 'px');
                tooltip.style('top', (d3.event.pageY-10) + 'px');
                tooltip.html(
                    `${d.date}</br>
                    처방 건수: ${d.order_count}</br>
                    당일 투여량: ${d.dose_per_day}</br>
                    누적 투여량: ${d.cumulative_dose}</br>
                    `

                )
            });

    }

    export default {
        props: {
            render: Boolean,
            chartData: Array,
            yAxis: String
        },

        computed: {
            canvasElement() {return document.getElementById('exposure-canvas');}
        },

        watch: {
            render() {if(this.render) this.drawChart();},
            chartData() {if(this.render) this.drawChart(); }
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
