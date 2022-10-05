<template>
  <div class="chart-container">
      <div id="era-canvas"></div>
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
        const data_oneday = data.filter(era => era.start_date === era.end_date);

        const dateFormat = d3.timeParse("%Y-%m-%d");

        const categories = [...new Set(data.map(i=>i.concept_name))];

        const canvas = d3.select("#era-canvas");

        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight-10);

        const defs = svg.append("defs");

        defs.append("marker")
            .attr('id', 'arrow')
            .attr('viewBox', '0 0 10 10')
            .attr('refX',7)
            .attr('refY',5)
            .attr('markerWidth',20)
            .attr('markerHeight',5)
            .attr('orient','auto')
            .append('path')
                .attr('d', 'M 0 0 L 10 5 L 0 10 z')
                .attr('class', 'arrowHead');

        const xScale = d3
            .scaleTime()
            .domain([d3.min(data, function(d) {return d3.timeDay.offset(dateFormat(d.start_date),-10);}),
                     d3.max(data, function(d) {return d3.timeDay.offset(dateFormat(d.end_date), 10);})])
            .range([0, graphWidth]);

        const yScale = d3
            .scaleBand()
            .domain(categories)
            .rangeRound([0, graphHeight])
            .padding(0.2);

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

        const insertLinebreaks = function (t, d, width) {
            var el = d3.select(t);
            var p = d3.select(t.parentNode);
            p.append("foreignObject")
                .attr('x', -90)
                .attr('y', -19)
                .attr("width", width)
                .attr("height", 200)
            .append("xhtml:p")
                .attr('style','word-wrap: break-word; text-align:right;')
                .html(d);

            el.remove();

        };

        const tooltip = d3
            .select('body')
            .append('span')
            .attr('class', 'chart-tooltip')
            .style('display', 'none');

        svg
            .append('text')
            .text('※ gap between records ignored if <= 30 days')
            .attr('transform', `translate(${graphWidth*0.8},15)`)
            .attr('font-size', '13px')

        // grid
        svg
            .selectAll('xTick')
            .data(xScale.ticks())
            .enter();

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
                if (d3.timeYear.count(xScale.domain()[0], xScale.domain()[1]) > 7){
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
                    d3.timeMonth.count(xScale.domain()[0], xScale.domain()[1]) > 3) {
                    svg
                        .selectAll('.day')
                        .remove();
                }
            });

        svg
            .append('g')
            .attr('transform', `translate(${paddingLeft}, ${paddingUp})`)
            .call(yAxis)
            .selectAll('.tick text')
                .each(function(d){insertLinebreaks(this, d, paddingLeft-10);});

        const barHeight = Math.min(20, yScale.bandwidth());

        // bars
        svg
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('fill','#fc6f00')
            .attr('y', 0)
            .attr('height', barHeight)
            .attr('marker-end', "url(#arrow)")
            .attr('width', d => Math.max(1, xScale(dateFormat(d.end_date))-xScale(dateFormat(d.start_date))))
            .attr('transform', function(d) {
                if(barHeight == 20)
                    return 'translate(' + (xScale(dateFormat(d.start_date)) + paddingLeft) + ',' + (yScale(d.concept_name) + yScale.bandwidth()/2 - 8 + paddingUp) + ')';
                else
                    return 'translate(' + (xScale(dateFormat(d.start_date)) + paddingLeft) + ',' + (yScale(d.concept_name) + paddingUp) + ')';
            })
            .on('mouseover', () => tooltip.style('display', 'block'))
            .on('mouseout', () => tooltip.style('display', 'none'))
            .on('mousemove', (d) => {
                tooltip.style('left', (d3.event.pageX+10) + 'px');
                tooltip.style('top', (d3.event.pageY-10) + 'px');
                tooltip.html(
                    `Name: ${d.concept_name}<br>Start: ${d.start_date}<br>End: ${d.end_date}`
                )
            });

        // arrow
        svg
            .append('g')
            .selectAll('.arrow')
            .data(data_oneday)
            .enter()
            .append('line')
            .attr('class', 'arrow')
            .attr('stroke', 'black')
            .style('stroke-width', '3px')
            .attr('marker-end', 'url(#arrow)')
            .attr('x1', d => xScale(dateFormat(d.start_date)) + paddingLeft)
            .attr('x2', d => xScale(dateFormat(d.start_date)) + paddingLeft)
            .attr('y1', function(d) {
                if (barHeight == 20)
                    return yScale(d.concept_name) + yScale.bandwidth()/2 - 8 + paddingUp - 30;
                else
                    return yScale(d.concept_name) + paddingUp - 10;
            })
            .attr('y2', function(d) {
                if (barHeight == 20)
                    return yScale(d.concept_name) + yScale.bandwidth()/2 - 8 + paddingUp - 5;
                else
                    return yScale(d.concept_name) + paddingUp;
            })
            .on('mouseover', (d) => {
                tooltip.style('display', 'block');
                tooltip.style('left', (d3.event.pageX+10) + 'px');
                tooltip.style('top', (d3.event.pageY-10) + 'px');
                tooltip.html(
                    `Name: ${d.concept_name}<br>Start: ${d.start_date}<br>End: ${d.end_date}`
                )
            })
            .on('mouseout', () => tooltip.style('display', 'none'))
    }

    export default {
        props: {
            render: Boolean,
            chartData: Array
        },

        computed: {
            canvasElement() {return document.getElementById('era-canvas');}
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
