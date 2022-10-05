<template>
  <div class="chart-container">
    <div id="map-canvas"></div>
  </div>
</template>

<script>
    import * as d3 from 'd3';
    import * as topojson from 'topojson';
    import config from '../../../config.json'

    function drawChart() {
        this.canvasElement.innerHTML = ''; //clear canvas

        const canvasWidth = this.canvasElement.parentElement.clientWidth;
        const canvasHeight = this.canvasElement.parentElement.clientHeight;

        const data = this.chartData;
        const snuhVisitor = this.snuhVisitor;

        const canvas = d3.select('#map-canvas');


        const svg = canvas
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

        const projection = d3
            .geoMercator()
            .translate([canvasWidth / 2, canvasHeight / 2]);

        const path = d3
            .geoPath()
            .projection(projection)

        const tooltip = d3
            .select('body')
            .append('span')
            .attr('class','chart-tooltip')
            .style('font-size', '13px')
            .style('display','none');

        const server = config.server;
        // Load external data
        d3.json(server+"/static/sido_simplified_topo_q1e4.json").then(function(topo_province) {
            d3.json(server+"/static/gugun_simplified_topo_q1e4.json").then(function(topo_municipalities) {

                const provinces = topojson.feature(topo_province, topo_province.objects.provinces).features;
                const municipalities = topojson.feature(topo_municipalities, topo_municipalities.objects.municipalities).features;


                let rec_count_per_state = {},
                    man_count_per_state = {},
                    rec_count_per_city = {},
                    man_count_per_city = {},
                    prop_per_state = {},
                    prop_per_city = {};


                for (let i=0; i<data.length; i++) {

                    const state = data[i].location.split(' ')[0].trim();
                    const city = data[i].location;

                    if(!(state in rec_count_per_state)) {
                        rec_count_per_state[state] = 0;
                        man_count_per_state[state] = 0;
                    }
                    if(!(city in rec_count_per_city)) {
                        rec_count_per_city[city] = 0;
                        man_count_per_city[city] = 0;
                    }

                    rec_count_per_state[state] += data[i].record;
                    man_count_per_state[state] += data[i].visitor;
                    rec_count_per_city[city] += data[i].record;
                    man_count_per_city[city] += data[i].visitor;
                }

                for (let i=0; i<snuhVisitor.length; i++) {

                    const state = snuhVisitor[i].si_do;
                    const total = Number(snuhVisitor[i].p_cnt);
                    if(state === '매칭데이터없음') continue;
                    prop_per_state[state] = (man_count_per_state[state]/total)*100;

                    const cities_in_state = data.filter(loc => loc.location.includes(state))
                    cities_in_state.forEach(city => {
                        prop_per_city[city.location] = (man_count_per_city[city.location]/total)*100;
                    })
                }

                // color scale
                const minCount = Math.min(...Object.values(prop_per_state)),
                    maxCount = Math.max(...Object.values(prop_per_state));
                const color = d3.scaleSequential(d3.interpolatePuBu)
                    .domain([minCount, maxCount]);

                // draw legend
                const legend = svg.append('g')
                    .attr('class', 'legend')

                const tickWidth = 20;
                const gapWidth = 1;
                let tick_data = d3.ticks(maxCount, minCount, 10)
                if (tick_data.length > 10)
                    tick_data = d3.ticks(maxCount, minCount, 5)

                const ticks = legend.selectAll('.tick')
                    .data(tick_data)
                    .enter().append('g')
                        .attr('class', 'legend_tick')
                        .attr('transform', (d, i) => `translate(0,${i * tickWidth + gapWidth})`);

                ticks.append('text')
                    .attr('class', 'stroke-text')
                    .attr('dx', `${tickWidth - gapWidth + 6}px`)
                    .attr('dy', `${1}em`)
                    .attr('font-size', '12px')
                    .text(d => `${d}%`);

                ticks.append('rect')
                    .attr('width', tickWidth - gapWidth)
                    .attr('height', tickWidth - gapWidth)
                    .style('fill', d => color(d))
                    .style('fill-opacity', 0.8);


                // projection
                const bounds = d3.geoBounds(topojson.feature(topo_province, topo_province.objects.provinces));
                const center = d3.geoCentroid(topojson.feature(topo_province, topo_province.objects.provinces));

                const distance = d3.geoDistance(bounds[0],bounds[1])
                const scale = canvasHeight / distance / 1.3;

                projection
                    .scale(scale)
                    .center(center);

                // draw initial map
                const provincePaths = svg.append('g')
                    .selectAll('.province')
                    .data(provinces)
                    .enter().append('path')
                    .attr('class', 'province')
                    .attr('d', path)
                    .style('fill', d=>color(prop_per_state[d.properties.NL_NAME_1.split('|')[0].trim()]))
                    .style('stroke', '#333')
                    .style('stroke-width', 1)
                    .on('click', function (d) {provinceZoom(d.properties.NL_NAME_1.split('|')[0].trim())})
                    .on('mouseover', function() {
                        d3.select(this).style('stroke-width','2');
                        tooltip.style('display', 'block');
                        })
                    .on('mouseout', function() {
                        d3.select(this).style('stroke-width','1');
                        tooltip.style('display', 'none');
                    })
                    .on('mousemove', (d) => {
                        const state = d.properties.NL_NAME_1.split('|')[0].trim();
                        tooltip.style('left', (d3.event.pageX + 10) + 'px');
                        tooltip.style('top', (d3.event.pageY - 10) + 'px');
                        tooltip.html(
                            `${state}<br>
                            총 처방횟수: ${rec_count_per_state[state].toLocaleString('en')}(회)<br>
                            지역 전체 환자 대비 처방 환자: ${prop_per_state[state].toLocaleString('en')}%`
                        );
                    });

                function korZoom() {
                    const t = d3.transition().duration(800);

                    //color scale
                    const minCount = Math.min(...Object.values(prop_per_state)),
                          maxCount = Math.max(...Object.values(prop_per_state));
                    color.domain([minCount, maxCount]);

                    legend.attr('visibility', 'display');

                    projection
                        .translate([canvasWidth / 2, canvasHeight / 2])
                        .scale(canvasHeight / distance / 1.3)
                        .center(center);

                    provincePaths.transition(t)
                        .attr('d', path)
                        .style('fill', d => color(prop_per_state[d.properties.NL_NAME_1.split('|')[0].trim()]))

                    svg.selectAll('.municipality')
                        .data([])
                        .exit().transition(t)
                        .attr('d', path)
                        .style('opacity', 0)
                        .remove()
                }


                function provinceZoom(id) {
                    const province = provinces.find(function(d) {return d.properties.NL_NAME_1.split('|')[0].trim() === id})
                    const provinceMuni = municipalities.filter(function (d) {return d.properties.NL_NAME_1.split('|')[0].trim() === id})
                    const t = d3.transition().duration(800)

                    const muniPaths = svg.selectAll('.municipality')
                            .data(provinceMuni, function (d) {return d.properties.NL_NAME_1.split('|')[0].trim()})

                    let cur = {};
                    let cur_prop_per_city = {};


                    provinceMuni.forEach(
                        d => cur[(id + " " + d.properties.NL_NAME_2.split('|')[0].trim()).trim()] = rec_count_per_city[(id + " " + d.properties.NL_NAME_2.split('|')[0].trim()).trim()] || 0
                    )

                    for (const [city, prop] of Object.entries(prop_per_city)) {
                        if (city.includes(id))
                            cur_prop_per_city[city] = prop
                    }

                    // check if any 0 population exists
                    const arr1 = Object.keys(cur_prop_per_city)
                    const arr2 = provinceMuni.map(v => id.concat(" ",v.properties.NL_NAME_2.split('|')[0].trim()).trim())

                    const difference = arr2.filter(x => !arr1.includes(x))
                    difference.forEach(function(d) {
                        man_count_per_city[d] = 0
                        rec_count_per_city[d] = 0
                        cur[d] = 0
                        cur_prop_per_city[d] = 0
                    }
                    )

                    // color scale
                    const minCount = Math.min(...Object.values(cur_prop_per_city)),
                        maxCount = Math.max(...Object.values(cur_prop_per_city));
                    color.domain([minCount, maxCount]);

                    legend.attr('visibility', 'hidden');

                    const enterMuniPaths = muniPaths.enter().append('path')
                        .attr('class', 'municipality')
                        .attr('id', d => d.properties.NL_NAME_2.split('|')[0].trim())
                        .attr('d', path)
                        .style('fill', function(d) {
                            const city = d.properties.NL_NAME_2.split('|')[0].trim();
                            const fullname = city === "" ? id : id + " " + city;
                        return color(cur_prop_per_city[fullname]);
                        })
                        .style('stroke', '#333')
                        .style('opacity', 0)
                        .on('click', function() {korZoom()})
                        .on('mouseover', function() {
                            d3.select(this).style('stroke-width','2');
                            tooltip.style('display', 'block');
                        })
                        .on('mouseout', function() {
                            d3.select(this).style('stroke-width','1');
                            tooltip.style('display', 'none');
                        })
                        .on('mousemove', (d) => {
                            const city = d.properties.NL_NAME_2.split('|')[0].trim();
                            const fullname = city === "" ? id : id + " " + city;
                            tooltip.style('left', (d3.event.pageX + 10) + 'px');
                            tooltip.style('top', (d3.event.pageY - 10) + 'px');
                            tooltip.html(
                                `${fullname}<br>
                                ${id} 방문자 중 처방 비율: ${cur_prop_per_city[fullname].toLocaleString('en')}%</br>
                                처방 횟수: ${cur[fullname].toLocaleString('en')} 회<br>
                                처방 인구: ${man_count_per_city[fullname].toLocaleString('en')} 명`
                            );
                        });

                    projection.fitExtent(
                        [[20, 20], [canvasWidth - 20, canvasHeight - 20]],
                        province
                    )

                    provincePaths.transition(t)
                        .attr('d', path)
                        .style('fill', '#444')

                    enterMuniPaths.transition(t)
                        .attr('d', path)
                        .style('opacity', 1)

                    muniPaths.exit().transition(t)
                        .attr('d', path)
                        .style('opacity', 0)
                        .remove()
                }
            }).catch(function(error) {console.error(error);})
        }).catch(function(error) {console.error(error);})
    }

    export default {
        props: {
            render: Boolean,
            chartData: Array,
            snuhVisitor: Array
        },

        computed: {
            canvasElement() {return document.getElementById('map-canvas');}
        },

        watch: {
            render() { if(this.render) this.drawChart();},
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
