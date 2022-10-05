import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as d3 from 'd3';

import Header from './Header';
import config from '../config.json';
import axios from 'axios';
import searchData from '../cached_data/drug_count.json';

function Polypharm() {
  const {state} = useLocation();
  const [isFirst, setIsFirst] = useState(true);
  const [isLoadingTogether, setIsLoadingTogether] = useState(true);
  const [isLoadingSet, setIsLoadingSet] = useState(true);
  const [drugTotal, setDrugTotal] = useState([]);
  const [drugTogetherList, setDrugTogetherList] = useState([]);
  const [drugTogetherTotal, setDrugTogetherTotal] = useState(1);
  const [drugSetTotal, setDrugSetTotal] = useState([]);
  const [drugSetList, setDrugSetList] = useState([]);
  const togetherref = useRef();
  const togetherlegref = useRef();

  // 0: 입원 체크박스, 1: 내원 체크박스
  const [visitTypeChecker, setVisitTypeChecker] = useState([true, true, true, true]);
  const setNumCount = 10;
  const [setNumList, setSetNumList] = useState(Array.from({length: setNumCount}, (v, d) => {if(d === 0) return true; else return false;}));
  const setAgeCount = 7;
  const [setAgeList, setSetAgeList] = useState(Array.from({length: setAgeCount}, () => true));
  
  const server = config.server + '/api';

  const changeSetNumCheckbox = (check_idx) => {
    setIsLoadingSet(true);
    let tmp = Array.from({length: setAgeCount}, () => false);
    tmp[check_idx] = !tmp[check_idx];
    if (check_idx === 0) {
      searchNewDrugSetAPI(3);
    }
    else if (check_idx === 1) {
      searchNewDrugSetAPI(4);
    }
    else if (check_idx === 2) {
      searchNewDrugSetAPI(5);
    }
    else if (check_idx === 3) {
      searchNewDrugSetAPI(6);
    }
    else if (check_idx === 4) {
      searchNewDrugSetAPI(7);
    }
    else if (check_idx === 5) {
      searchNewDrugSetAPI(8);
    }
    else if (check_idx === 6) {
      searchNewDrugSetAPI(9);
    }
    else if (check_idx === 7) {
      searchNewDrugSetAPI(10);
    }
    else if (check_idx === 8) {
      searchNewDrugSetAPI(11);
    }
    else if (check_idx === 9) {
      searchNewDrugSetAPI(12);
    }
    setSetNumList(tmp);
  };

  const changeSetAgeCheckbox = (check_idx) => {
    let tmp_visit_dict = {};
    let visit_occurrence;
    let tmp = [...setAgeList];
    tmp[check_idx] = !tmp[check_idx];
    let result = drugSetTotal.filter((data) => 
    (tmp[0] && data.exposure_age < 10) || 
    (tmp[1] && (data.exposure_age < 20 && data.exposure_age >= 10)) ||
    (tmp[2] && (data.exposure_age < 30 && data.exposure_age >= 20)) ||
    (tmp[3] && (data.exposure_age < 40 && data.exposure_age >= 30)) ||
    (tmp[4] && (data.exposure_age < 50 && data.exposure_age >= 40)) ||
    (tmp[5] && (data.exposure_age < 60 && data.exposure_age >= 50)) ||
    (tmp[6] && (data.exposure_age >= 60)));
    
    for(let i=0; i<result.length; i++){
      visit_occurrence = result[i].visit_occurrence_id+String(result[i].drug_exposure_start_date);
      try{
          tmp_visit_dict[visit_occurrence]["drug_concept_id"].push(result[i].drug_concept_id);
          tmp_visit_dict[visit_occurrence]["count"].push(result[i].count);
      }
      catch(error) {
          tmp_visit_dict[visit_occurrence] = {"drug_concept_id": [result[i].drug_concept_id], "count": [result[i].count]};
      }
    }
    let three_key = Object.keys(tmp_visit_dict);
    let three_dict = {}
    for (let i=0; i< three_key.length; i++){
      let key = tmp_visit_dict[three_key[i]].drug_concept_id.sort();
      if(!three_dict[key]) {
        let dc_name = key.map((data) => searchData.filter((d) => d.concept_id === String(data))[0].concept_name);
        three_dict[key] = {drug_concept_id:key, drug_concept_name:dc_name, count:1};
      }
      else {
        three_dict[key].count +=1;
      }
    }
    let three_data = Object.keys(three_dict).sort(function(a,b) {return three_dict[b].count - three_dict[a].count}).map(key => (three_dict[key]));
    setDrugSetList(three_data.slice(0,100));
    setSetAgeList(tmp);
    };

  const changeVisitTypeCheckbox = (check_idx) => {
    let tmp = [...visitTypeChecker]
    tmp[check_idx] = !tmp[check_idx];

    let final_dict = {};
    for (let i=0; i<drugTotal.length; i++){
      if(drugTotal[i].visit_concept_id === 9201 && tmp[0]){
        if(final_dict[drugTotal[i].drug_concept_id]) final_dict[drugTotal[i].drug_concept_id] += parseInt(drugTotal[i].sum);
        else final_dict[drugTotal[i].drug_concept_id] = parseInt(drugTotal[i].sum);
      }
      if(drugTotal[i].visit_concept_id === 9202 && tmp[1]){
        if(final_dict[drugTotal[i].drug_concept_id]) final_dict[drugTotal[i].drug_concept_id] += parseInt(drugTotal[i].sum);
        else final_dict[drugTotal[i].drug_concept_id] = parseInt(drugTotal[i].sum);
      }
      if(drugTotal[i].visit_concept_id === 9203 && tmp[2]){
        if(final_dict[drugTotal[i].drug_concept_id]) final_dict[drugTotal[i].drug_concept_id] += parseInt(drugTotal[i].sum);
        else final_dict[drugTotal[i].drug_concept_id] = parseInt(drugTotal[i].sum);
      }
      if(drugTotal[i].visit_concept_id === 32693 && tmp[3]){
        if(final_dict[drugTotal[i].drug_concept_id]) final_dict[drugTotal[i].drug_concept_id] += parseInt(drugTotal[i].sum);
        else final_dict[drugTotal[i].drug_concept_id] = parseInt(drugTotal[i].sum);
      }
    }
    let tmp_data = Object.keys(final_dict).sort(function(a,b) {return final_dict[b] - final_dict[a]}).map(key => ({data: searchData.filter((data) => data.concept_id === key), count_final: final_dict[key]}));
    setDrugTogetherTotal(tmp_data.reduce((result, item, idx) => {return result + item.count_final;}, 0));
    setDrugTogetherList(tmp_data);
    setVisitTypeChecker(tmp);
  };

  const idTipData = (props) => (
    <Tooltip id="button-tooltip" {...props} style={{textAlign:'justify', textAlignLast:'left', ...props.style}}>
      {state.drugInfo[config.institution_sourcename_column].map((data, idx) => (
        <div key= {idx} style={{display:'inline-block', width:'100%', whiteSpace:'nowrap'}}>{`-${data}`}</div>
      ))}
    </Tooltip>
  );

  const sourcenameTipData = (props) => (
    <Tooltip id="button-tooltip" {...props} style={{textAlign:'justify', textAlignLast:'left', ...props.style}}>
      {state.drugInfo.source_name.map((data, idx) => (
        <div key= {idx} style={{display:'inline-block', width:'100%', whiteSpace:'nowrap'}}>{`-${data}`}</div>
      ))}
    </Tooltip>
  );

  async function searchNewDrugAPI() {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    await axios.post(`${server}/drug/polysearch`, {
        headers: {
            "Content-Type": "application/xml; charset=ISO-8859-1"
        },
        params: {
          concept_id: state.drugInfo.concept_id
        }
    }).then((res) => {

        setDrugTotal(res.data);
        let final_dict = {};
        for (let i=0; i<res.data.length; i++){
          if(final_dict[res.data[i].drug_concept_id]) final_dict[res.data[i].drug_concept_id] += parseInt(res.data[i].sum);
          else final_dict[res.data[i].drug_concept_id] = parseInt(res.data[i].sum);
        }

        let tmp_data = Object.keys(final_dict).sort(function(a,b) {return final_dict[b] - final_dict[a]}).map(key => ({data: searchData.filter((data) => data.concept_id === key), count_final: final_dict[key]}));
        
        tmp_data = tmp_data.filter(d => (d.data[0]));
        setDrugTogetherTotal(tmp_data.reduce((result, item, idx) => {return result + item.count_final;}, 0));
        setDrugTogetherList(tmp_data);
        setIsLoadingTogether(false);

    }).catch((error) => alert(error));
  }

  async function searchNewDrugSetAPI(setNum) {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    await axios.post(`${server}/drug/polysearch/set`, {
        headers: {
            "Content-Type": "application/xml; charset=ISO-8859-1"
        },
        params: {
          concept_id: state.drugInfo.concept_id,
          set_num: setNum
        }
    }).then((res) => {

        let tmp_visit_dict = {};
        let visit_occurrence;
        setDrugSetTotal(res.data);
        let result = res.data;
        result = result.filter((data) => 
        (setAgeList[0] && data.exposure_age < 10) || 
        (setAgeList[1] && (data.exposure_age < 20 && data.exposure_age >= 10)) ||
        (setAgeList[2] && (data.exposure_age < 30 && data.exposure_age >= 20)) ||
        (setAgeList[3] && (data.exposure_age < 40 && data.exposure_age >= 30)) ||
        (setAgeList[4] && (data.exposure_age < 50 && data.exposure_age >= 40)) ||
        (setAgeList[5] && (data.exposure_age < 60 && data.exposure_age >= 50)) ||
        (setAgeList[6] && (data.exposure_age >= 60)));

        for(let i=0; i<result.length; i++){
            visit_occurrence = result[i].visit_occurrence_id+String(result[i].drug_exposure_start_date);
            try{
                tmp_visit_dict[visit_occurrence]["drug_concept_id"].push(result[i].drug_concept_id);
                tmp_visit_dict[visit_occurrence]["count"].push(result[i].count);
            }
            catch(error) {
                tmp_visit_dict[visit_occurrence] = {"drug_concept_id": [result[i].drug_concept_id], "count": [result[i].count]};
            }
        }
        let three_key = Object.keys(tmp_visit_dict);
        let three_dict = {};

        for (let i=0; i< three_key.length; i++){
          let key = tmp_visit_dict[three_key[i]].drug_concept_id.sort();
          if(!three_dict[key]) {
            try{
              let dc_name = key.map((data) => searchData.filter((d) => d.concept_id === String(data))[0].concept_name);
              three_dict[key] = {drug_concept_id:key, drug_concept_name:dc_name, count:1};
            }
            catch(error) {
              console.log(error);
            }
          }
          else {
            three_dict[key].count +=1;
          }
        }

        let three_data = Object.keys(three_dict).sort(function(a,b) {return three_dict[b].count - three_dict[a].count}).map(key => (three_dict[key]));
      
        setDrugSetList(three_data.slice(0,100));
        setIsLoadingSet(false);
    }).catch((error) => alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.'));
  }

  useEffect(() => {
    if(isFirst){
      setIsFirst(false);
      searchNewDrugAPI();
      searchNewDrugSetAPI(3);
    }
  }, []);  

  useEffect(() => {
    if(drugTogetherList.length < 1) {
      const togetherElement = togetherref.current;
      const documentElement = d3.select(togetherElement);
      documentElement.select('svg').remove();
      const legendElement = togetherlegref.current;
      const legenddocumentElement = d3.select(legendElement);
      legenddocumentElement.select('svg').remove();
      return;
    };
    const togetherElement = togetherref.current;
    const documentElement = d3.select(togetherElement);
    documentElement.select('svg').remove();
    const canvasWidth = togetherElement.clientWidth;
    const canvasHeight = togetherElement.clientHeight;
    const paddingUp = 10;
    const paddingDown = 50;
    const paddingRight = 10;
    const paddingLeft = 10;
    const graphWidth = canvasWidth - paddingRight - paddingLeft;
    const graphHeight = canvasHeight - paddingUp - paddingDown;
    
    const togetherData = drugTogetherList;
    const data_10 = togetherData.slice(0, 10).map(d => ({concept_name: d.data[0].ingredient_concept_name.reduce((arr, cur, idx) => {if(idx === d.data[0].ingredient_concept_name.length - 1) return `${arr} ${cur}`; else return `${arr} ${cur} +`}, ""), count_final:d.count_final}));
    const reducer = (acc, cur) => acc+cur;
    const sum_total = drugTogetherTotal;
    const sum_part = data_10.map(i=> parseInt(i.count_final)).reduce(reducer, 0);
    let data_11 = [...data_10];
    data_11[10] = {concept_name: 'etc', count_final: sum_total-sum_part}
    const color = d3.scaleOrdinal()
    .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf", "#000000"]);

    const pie = d3.pie()
    .padAngle(0)
    .value((d) => parseInt(d.count_final))
    .sort(null);


    const radius = Math.min(graphWidth, graphHeight)/2;
    const togsvg = documentElement.append('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight)
    .append('g')
    .attr('transform', 'translate('+(canvasWidth/2) +','+canvasHeight/2+')');

    const arcGen = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

    const arc = togsvg
    .selectAll()
    .data(pie(data_10))
    .enter();

    arc.append('path')
    .attr('d', arcGen)
    .style('fill', (_, i) => color(i))
    .style('stroke', '#ffffff')
    .style('stroke-width', 0);

//얘 진짜 주석
    /*arc.append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .text((d) => d.data.concept_name)
    .style('fill', '#ffffff')*/

    //legend
    
    const legendElement = togetherlegref.current;
    const legenddocumentElement = d3.select(legendElement);
    legenddocumentElement.select('svg').remove();
    let maxLen = Math.max(data_11.map(i => i.concept_name.length));
    const containerWidth = graphWidth;
    const containerHeight = canvasHeight;

    const legend_container = d3.select(legendElement)
    .append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight);

    const legend = legend_container
    .selectAll('legend-item')
    .data(data_11)
    .enter().append('g')
    .attr('transform', function(d, i) {
      return 'translate('+ (0) + ',' + (i*24+20) + ')';
    }).attr('class', 'legend-item');
    
    legend.append('rect')
    .attr('width', 12)
    .attr('height', 12)
    .attr('fill', function(d, i) {
      return color(i);
    })

    legend.append('text')
    .text(function(d, idx){
      if(!d) return "";
      if (idx < 10)
      return `${d.concept_name} ( ${d.count_final.toLocaleString('en')}, ${((d.count_final/sum_part)*100).toFixed(2)}% )`;
      else
      return `${d.concept_name} ( ${d.count_final.toLocaleString('en')} )`;
    })
    .style('font-size', 16)
    .attr('y', 10)
    .attr('x', 15)

  }, [drugTogetherList]);

  return (
    <div className="home_container">
      <Header />
      <div className="home_content">
        <div style={drug_container}>

            <div style={drug_content}>

                <div className="card" style={drug_info}>
                    <div style={drug_info_top}>
                        <div style={drug_info_title}>포함 성분 정보</div>
                    </div>
                    <div className="divider-horizontal" />
                    <div style={Object.assign({marginBottom: "4px"}, drug_info_item_container)}>
                        <div style={drug_info_item}>
                            <div style={drug_info_item_title}>성분 OMOP ID:</div>
                            <div style={drug_info_item_text}>{state.drugInfo.ingred_concept_id.reduce((result, item, idx) => {if(!state.drugInfo.ingred_concept_id) return ""; if(idx === state.drugInfo.ingred_concept_id.length-1) return `${result} ${item}`; else return `${result} ${item},`;}, "")}</div>
                        </div>
                    </div>
                    <div style={Object.assign({marginBottom: "4px"}, drug_info_item_container)}>
                        <div style={drug_info_item}>
                            <div style={drug_info_item_title}>성분 OMOP Name:</div>
                            <div style={drug_info_item_text}>{state.drugInfo.ingred_concept_name.reduce((result, item, idx) => {if(!state.drugInfo.ingred_concept_name) return ""; if(idx === state.drugInfo.ingred_concept_name.length-1) return `${result} ${item}`; else return `${result} ${item},`;}, "")}</div>
                        </div>
                    </div>
                    <div style={Object.assign({marginBottom: "12px"}, drug_info_item_container)}>
                        <div style={drug_info_item}>
                            <div style={drug_info_item_title}>종류:</div>
                            <div style={drug_info_item_text}>{state.isMixed? "복합": "단일"}</div>
                        </div>
                    </div>
                    <div style={drug_info_item_container}>
                        <div style={drug_info_item}>
                            <OverlayTrigger placement='bottom' delay={{show:250, hide:400}} overlay={idTipData}>
                              <div style={drug_info_item_title_border}>{`해당 성분이 포함된 ${config.institution_name} ID 보기`}</div>
                            </OverlayTrigger>
                        </div>
                        <div style={drug_info_item}>
                            <OverlayTrigger placement='bottom' delay={{show:250, hide:400}} overlay={sourcenameTipData}>
                              <div style={drug_info_item_title_border}>{`해당 성분이 포함된 ${config.institution_name} Source Name 보기`}</div>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>
                <div style={drug_chart_container}>
                  <div className="card" style={Object.assign({marginRight:"28px"}, drug_chart_together_container)}>
                      <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'space-between'}}>
                        <div style={drug_chart_together_title}>동시 처방 약물</div>
                        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                          <Form.Check checked={visitTypeChecker[0]} onChange={()=>{changeVisitTypeCheckbox(0)}}></Form.Check>
                          <Form.Text>입원</Form.Text>
                          <Form.Check checked={visitTypeChecker[1]} onChange={()=>{changeVisitTypeCheckbox(1)}} style={{marginLeft:'16px'}}></Form.Check>
                          <Form.Text>외래</Form.Text>
                          <Form.Check checked={visitTypeChecker[2]} onChange={()=>{changeVisitTypeCheckbox(2)}} style={{marginLeft:'16px'}}></Form.Check>
                          <Form.Text>응급</Form.Text>
                          <Form.Check checked={visitTypeChecker[3]} onChange={()=>{changeVisitTypeCheckbox(3)}} style={{marginLeft:'16px'}}></Form.Check>
                          <Form.Text>검진센터</Form.Text>
                        </div>
                      </div>
                      <div className="divider-horizontal" style={drug_chart_together_divider} />

                      <div style={drug_chart_together_table_container}>
                          <Table bordered hover striped style={{overflowY:"auto"}}>
                            <thead>
                              <tr style={{fontSize:"12px", fontWeight:"200"}}>
                                <th style={{width:"150px"}}>동시 처방 횟수</th>
                                <th style={{width:"150px"}}>약물 Concept ID</th>
                                <th style={{width:"150px"}}>약물 Concept Name</th>
                                <th>포함 성분</th>
                              </tr>
                            </thead>
                            <tbody>
                            {drugTogetherList.length > 0 && drugTogetherList.map((data, index) => (
                              <tr key= {index} style= {{fontSize:"16px"}}>
                                <td>{`${data.count_final.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}(${((data.count_final/drugTogetherTotal)*100).toFixed(1).toString()}%)`}</td>
                                <td>{data.data[0].concept_id}</td>
                                <td>{data.data[0].concept_name}</td>
                                <td>{data.data[0].ingredient_concept_name.reduce((result, item, idx) => {if(idx === data.data[0].ingredient_concept_name.length-1) return `${result} ${item}`; else return `${result} ${item}+`;}, "")}</td>
                              </tr>
                            ))}
                            </tbody>
                          </Table>
                          {isLoadingTogether && <div className="loading-indicator"/>}
                      </div>
                  </div>
                  <div className="card" style={drug_chart_together_container}>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'space-between'}}>
                      <div style={drug_chart_together_title}>동시 처방 약물 Top 10 (백분율 값은 탑 10개를 100%로 한 기준입니다)</div>
                    </div>
                    <div className="divider-horizontal" style={drug_chart_together_divider} />
                    {isLoadingTogether && (
                      <div style={{drug_chart_together_table_container}}>
                        <div className="loading-indicator"/>
                      </div>
                    )}
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center", width:"100%", height:"100%"}}>
                    <div ref={togetherref} style={{width:"50%", height:"100%"}}>
                    </div>
                    <div ref={togetherlegref} style={{width:"50%", height:"100%"}}>
                    </div>
                    </div>
                  </div>
                </div>
                <div style={drug_chart_container}>
                  <div className="card" style={drug_chart_together_container}>

                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'space-between'}}>
                      <div style={drug_chart_together_title}>동시 처방 약물 세트 (최근 5년간의 데이터 기반, 같은 사람이 같은날 처방 받은 경우 동시 처방으로 생각합니다.)</div>
                    </div>
                    <div className="divider-horizontal" style={drug_chart_together_divider} />
                    <div style={{display:"flex", flexDirection:"row", alignSelf:"flex-start"}}>
                      동시 처방 개수: 
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[0]} onChange={()=>{changeSetNumCheckbox(0)}}></Form.Check>
                        <Form.Text>3</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[1]} onChange={()=>{changeSetNumCheckbox(1)}}></Form.Check>
                        <Form.Text>4</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[2]} onChange={()=>{changeSetNumCheckbox(2)}}></Form.Check>
                        <Form.Text>5</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[3]} onChange={()=>{changeSetNumCheckbox(3)}}></Form.Check>
                        <Form.Text>6</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[4]} onChange={()=>{changeSetNumCheckbox(4)}}></Form.Check>
                        <Form.Text>7</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[5]} onChange={()=>{changeSetNumCheckbox(5)}}></Form.Check>
                        <Form.Text>8</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[6]} onChange={()=>{changeSetNumCheckbox(6)}}></Form.Check>
                        <Form.Text>9</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[7]} onChange={()=>{changeSetNumCheckbox(7)}}></Form.Check>
                        <Form.Text>10</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[8]} onChange={()=>{changeSetNumCheckbox(8)}}></Form.Check>
                        <Form.Text>11</Form.Text>
                      </div>
                      {/*<div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setNumList[9]} onChange={()=>{changeSetNumCheckbox(9)}}></Form.Check>
                        <Form.Text>12 이상</Form.Text>
                    </div>*/}
                    </div>
                    <div style={{display:"flex", flexDirection:"row", alignSelf:"flex-start", marginBottom:"24px"}}>
                      연령대: 
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setAgeList[0]} onChange={()=>{changeSetAgeCheckbox(0);}}></Form.Check>
                        <Form.Text>10세 미만</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setAgeList[1]} onChange={()=>{changeSetAgeCheckbox(1);}}></Form.Check>
                        <Form.Text>10대</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setAgeList[2]} onChange={()=>{changeSetAgeCheckbox(2);}}></Form.Check>
                        <Form.Text>20대</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setAgeList[3]} onChange={()=>{changeSetAgeCheckbox(3);}}></Form.Check>
                        <Form.Text>30대</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setAgeList[4]} onChange={()=>{changeSetAgeCheckbox(4);}}></Form.Check>
                        <Form.Text>40대</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setAgeList[5]} onChange={()=>{changeSetAgeCheckbox(5);}}></Form.Check>
                        <Form.Text>50대</Form.Text>
                      </div>
                      <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                        <Form.Check checked={setAgeList[6]} onChange={()=>{changeSetAgeCheckbox(6);}}></Form.Check>
                        <Form.Text>60대 이상</Form.Text>
                      </div>
                    </div>
                    <div style={drug_chart_set_table_container}>
                        <Table bordered hover striped style={{overflowY:"auto"}}>
                          <thead>
                            <tr style={{fontSize:"12px", fontWeight:"200"}}>
                              <th style={{width:"150px"}}>동시 처방 횟수</th>
                              <th style={{width:"150px"}}>동시 처방 세트 Concept Name</th>
                              <th style={{width:"150px"}}>동시 처방 세트 Concept ID</th>
                            </tr>
                          </thead>
                          <tbody>
                          {!isLoadingSet && drugSetList.map((data, index) => (
                            <tr key={index} style= {{fontSize:"16px"}}>
                              <td>{`${data.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
                              <td>{data.drug_concept_name.map((data, idx) => (
                                <div key={idx}>{`- ${data}`}</div>
                              ))}</td>
                              <td>{data.drug_concept_id.map((data, idx) => (
                                <div key={idx}>{`- ${data}`}</div>
                              ))}</td>
                            </tr>
                          ))}
                          </tbody>
                        </Table>
                        {isLoadingSet && <div className="loading-indicator"/>}
                    </div>
                  </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

const drug_container = {
  height: "100%",
  width: "100%"
};

const drug_content = {
  padding: "30px"
};

/* Info Overview */
const drug_info = {
  marginBottom: "30px",
  display: "flex",
  flexDirection: "column"
};
const drug_info_top = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
};
const drug_info_title = {
  fontWeight: "700",
  fontSize: "18px"
};
const drug_info_item_container = {
  display: "flex",
  flexDirection: "row"
};
const drug_info_item = {
  marginRight: "50px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
};
const drug_info_item_title = {
  marginRight: "20px",
  fontWeight: "700",
  fontSize: "16px"
};
const drug_info_item_text = {
  fontSize: "16px"
};
const drug_info_item_title_border = {
  fontWeight: "700",
  padding: "4px",
  border: "1px solid black",
  display: "inline-block",
  borderRadius: "8px",
  fontSize: "16px"
};
/* Charts */
const drug_chart_container = {
  marginBottom: "30px",
  display: "flex",
  flexDirection: "row"
};

/* Together Table */
const drug_chart_together_container = {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const drug_chart_together_title = {
  fontWeight: "700",
  fontSize: "18px"
};
const drug_chart_together_table_container = {
    width: "100%",
    height: "300px",
    marginTop: "-20px",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "scroll"
};
const drug_chart_set_table_container = {
  width: "100%",
  height: "600px",
  marginTop: "-20px",
  paddingTop: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "scroll"
};
const drug_chart_together_divider = {
  marginTop: "8px"
};
const el_checkbox = {
  transform: "translate(350px,-25px)"
}

export default Polypharm;