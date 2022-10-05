import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import * as d3 from 'd3';

import Header from './Header';
import config from '../config.json';
import searchData from '../cached_data/drug_count.json';

function New() {
  const {state} = useLocation();
  const newRef = useRef();
  const [drugInfoTable, setDrugInfoTable] = useState([]);
  const [clickedDrugInfo, setClickedDrugInfo] = useState([]);
  const [clickedDrugData, setClickedDrugData] = useState([]);

  const [ingredSearchArr, setIngredSearchArr] = useState([]); // 자동완성 딕셔너리
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchByConcept, setIsSearchByConcept] = useState(true);
  const [isSpecificSearch, setIsSpecificSearch] = useState(false);

  const [searchByIngredDict, setSearchByIngredDict] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const server = config.server + '/api';
  let today = new Date();
  const current_year = today.getFullYear();
  const min_year = 2004;

  const [ingredDict, setIngredDict] = useState(() => {
    let new_ingred_dict = [];
    for(let i=0; i<searchData.length; i++){
        for(let j=0; j<searchData[i].ingredient_concept_name.length; j++){
            if(!new_ingred_dict.includes(searchData[i].ingredient_concept_name[j])){
                new_ingred_dict.push(searchData[i].ingredient_concept_name[j])
            }
        }
    }
    return new_ingred_dict.sort();
  });


  const NotMixedDict = searchData.filter((data) => !data.is_mixed);

  const handleSearch = (e) => {
    let tmp = e.target.value;
    if (tmp.length > 2){
        //const regex = new RegExp(e.target.value, 'i');
        setIngredSearchArr(
            ingredDict.filter((name) => name.search(tmp.toLowerCase())>=0)
        );
    }
    else {
        setIngredSearchArr([]);
    }
    setSearchQuery(tmp);
  };

  const handleSearchClick = (data) => {
    setSearchQuery(data);
    setIngredSearchArr([]);
    searchDrugAPIForClick(data);
  };

  const clickSearch = () => {
    if(searchQuery.length < 2) {
        alert('2글자 이상 입력해주세요.');
        return;
    }
    searchDrugAPI();
  };

  const onEnterPress = (e) => {
      if(e.key === 'Enter'){
          e.preventDefault();
          clickSearch();
      }
  };

  function searchDrugAPIForClick(query) {
      let ingredtmp = searchData.filter((data) => data.ingredient_concept_name.includes(query.toLowerCase()));
      setDrugInfoTable(ingredtmp);
      let notmixedtmp = NotMixedDict.filter((data) => data.ingredient_concept_name[0] === query.toLowerCase());
      if(notmixedtmp.length > 0){
        let rst = ingredtmp.reduce((acc, cur, i) => {
          return {concept_name: acc.concept_name, concept_id: acc.concept_id, source_name:[...acc.source_name, ...cur.source_name], [config.institution_sourcename_column]:[...acc[config.institution_sourcename_column], ...cur[config.institution_sourcename_column]], count: acc.count+parseInt(cur.count), drug_concept_list: [...acc.drug_concept_list, cur.concept_id]}
        }, {concept_name: notmixedtmp[0].ingredient_concept_name[0],
          concept_id: notmixedtmp[0].ingredient_concept_id[0], 
          source_name: [],
          [config.institution_sourcename_column]: [],
          count: 0,
          drug_concept_list: [],
        });
        setSearchByIngredDict(rst);
      }
      else {
        setSearchByIngredDict();
      }
  };

  function searchDrugAPI() {
    let ingredtmp = searchData.filter((data) => data.ingredient_concept_name.includes(searchQuery.toLowerCase()));
    setDrugInfoTable(ingredtmp);
    let notmixedtmp = NotMixedDict.filter((data) => data.ingredient_concept_name[0] === searchQuery.toLowerCase());
    if(notmixedtmp.length > 0){
      let rst = ingredtmp.reduce((acc, cur, i) => {
        return {concept_name: acc.concept_name, concept_id: acc.concept_id, source_name:[...acc.source_name, ...cur.source_name], [config.institution_sourcename_column]:[...acc[config.institution_sourcename_column], ...cur[config.institution_sourcename_column]], count: acc.count+parseInt(cur.count), drug_concept_list: [...acc.drug_concept_list, cur.concept_id]}
      }, {concept_name: notmixedtmp[0].ingredient_concept_name[0],
        concept_id: notmixedtmp[0].ingredient_concept_id[0], 
        source_name: [],
        [config.institution_sourcename_column]: [],
        count: 0,
        drug_concept_list: [],
      });
      setSearchByIngredDict(rst);
    }
    else {
      setSearchByIngredDict();
    }
  };

  async function clickSearchDrug(data) {
    if(isLoading){
      alert('잠시후 데이터 로드 완료 후 실행해주세요.');
      return;
    }
    setIsSpecificSearch(false);
    let time_parsed_data = {};
    let concept_to_check;
    if(isSearchByConcept) concept_to_check = [data.concept_id];
    else concept_to_check = data.drug_concept_list;

    for(let i=min_year; i<current_year+1; i++){
      time_parsed_data[i] = 0;
    }
    
    await axios.post(`${server}/search/newdrug/exposure`, {
        headers: {
            "Content-Type": "application/xml; charset=ISO-8859-1"
        },
        params: {
          concept_id: concept_to_check
        }
    }).then((res) => {
        if(concept_to_check.includes('40184084') || concept_to_check.includes('42935544') || concept_to_check.includes('42935564') || concept_to_check.includes('42935569')){
          for(let i=min_year; i<current_year+1; i++) {
            if(res.data[i]) time_parsed_data[i] = res.data[i];
          }
          let rst_data = Object.keys(time_parsed_data).map(d => {return{time: d, count: time_parsed_data[d]}});
          setClickedDrugData([...clickedDrugData, rst_data]);

          let tmp_data = {...data};
          tmp_data['color'] = "#"+Math.floor(Math.random()*16777215).toString(16);
          tmp_data['count'] = rst_data.reduce((acc, cur) => {
            return acc+Number(cur.count)
          }, 0)
          let tmp_lst = [...clickedDrugInfo, tmp_data];
          setClickedDrugInfo(tmp_lst);
          setIsLoading(false);
          setIsSpecificSearch(true);
        }
        else if(concept_to_check.includes('19122186')){
          let time_parsed_specific = [{}, {}];
          for(let i=min_year; i<current_year+1; i++){
            if(res.data['lopinavir'][i] && res.data['ritonavir'][i]){
              time_parsed_specific[0][i] = res.data['lopinavir'][i];
              time_parsed_specific[1][i] = res.data['ritonavir'][i];
            }
            else{
              time_parsed_specific[0][i] = 0;
              time_parsed_specific[1][i] = 0;
            }
          }
          let rst_data = [Object.keys(time_parsed_specific[0]).map(d => {return{time: `${d}`, count: time_parsed_specific[0][d]}}), Object.keys(time_parsed_specific[1]).map(d => {return{time: `${d}`, count: time_parsed_specific[1][d]}})];
          setClickedDrugData([...clickedDrugData, ...rst_data]);
          
          let tmp_data_lopi = {...data};
          tmp_data_lopi.concept_name = "lopinavir ("+tmp_data_lopi.concept_name+")";
          tmp_data_lopi['color'] = "#"+Math.floor(Math.random()*16777215).toString(16);
          tmp_data_lopi['count'] = rst_data[0].reduce((acc, cur) => {
            return acc+Number(cur.count);
          }, 0);

          let tmp_data_rito = {...data};
          tmp_data_rito.concept_name = "ritonavir ("+tmp_data_rito.concept_name+")";
          tmp_data_rito['color'] = "#"+Math.floor(Math.random()*16777215).toString(16);
          tmp_data_rito['count'] = rst_data[1].reduce((acc, cur) => {
            return acc+Number(cur.count);
          }, 0);
          let tmp_lst = [...clickedDrugInfo, tmp_data_lopi, tmp_data_rito];
          setClickedDrugInfo(tmp_lst);
          setIsLoading(false);
          setIsSpecificSearch(true);
        }
        else{
          let tmp_data = {...data};
          tmp_data['color'] = "#"+Math.floor(Math.random()*16777215).toString(16);
          let tmp_lst = [...clickedDrugInfo, tmp_data];
          setClickedDrugInfo(tmp_lst);

          for(let i=0; i<res.data.length; i++) {
            time_parsed_data[parseInt(res.data[i].year)] = res.data[i].sum;
          }
          let rst_data = Object.keys(time_parsed_data).map(d => {return{time: `${d}`, count:time_parsed_data[d]}});
          setClickedDrugData([...clickedDrugData, rst_data]);
          setIsLoading(false);
        }
    }).catch((error) => alert("예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다."));
    
  };

  useEffect(() => {
    if(clickedDrugData.length < 1) return;
    
    const newElement =newRef.current;
    const canvasWidth = newElement.clientWidth;
    const canvasHeight = newElement.clientHeight;
    const paddingUp = 20;
    const paddingDown = 30;
    const paddingRight = 10;
    const paddingLeft = 80;
    const graphWidth = canvasWidth - paddingRight - paddingLeft;
    const graphHeight = canvasHeight - paddingUp - paddingDown;

    const parseDate = d3.timeParse("%Y");
    const docNewElement = d3.select(newElement)
    .call(g => g.select("svg").remove())
    .append("svg")
    .attr('viewBox', `0, 0, ${graphWidth}, ${graphHeight}`);

    const d3Type = d3.line()
    .x((d) => x(parseDate(d.time)))
    .y((d) => y(parseInt(d.count)));

    const tooltip = d3
    .select('body')
    .append('span')
    .attr('class', 'chart-tooltip')
    .style('display', 'none');

    const x = d3.scaleTime()
    .domain(d3.extent(clickedDrugData[0], d => parseDate(d.time)))
    .range([paddingLeft, graphWidth - paddingRight]);

    let max = 0;
    for(let i=0; i<clickedDrugData.length; i++){
      let tmp_max = d3.max(clickedDrugData[i], d => parseInt(d.count));
      if( tmp_max > max) max = tmp_max;
    }

    const y = d3.scaleLinear()
    .domain([max, 0]).nice()
    .range([paddingDown, graphHeight-paddingUp]);

    const xAxis = g => g.attr("transform", `translate(0, ${graphHeight-paddingUp})`)
    .call(d3.axisBottom(x).ticks(d3.timeYear).tickFormat(d3.timeFormat("%Y")));

    docNewElement.append('g').call(xAxis);

    const yAxis = g => g.attr("transform", `translate(${paddingLeft-10}, 0)`)
    .call(d3.axisLeft(y));
    docNewElement.append('g').call(yAxis).call(g => g.select(".domain").remove());

    for(let i=0; i<clickedDrugData.length; i++){
      docNewElement.selectAll('dot')
      .data(clickedDrugData[i])
      .enter()
      .append('circle')
      .attr('cx', (d) => x(parseDate(d.time)))
      .attr('cy', (d) => y(d.count))
      .attr('r', 4)
      .attr('fill', clickedDrugInfo[i].color)
      .on('mouseover', () => tooltip.style('display', 'block'))
      .on('mouseout', () => tooltip.style('display', 'none'))
      .on('mousemove', (d) => {
        tooltip.style('left', (d3.event.pageX + 10) + 'px');
        tooltip.style('top', (d3.event.pageY - 10) + 'px');
          tooltip.html(
              `Time : ${d.time}<br>
              Count : ${d.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
          );
      });

      docNewElement.append('path')
      .datum(clickedDrugData[i])
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke', clickedDrugInfo[i].color)
      .style('stroke-width', 1.5)
      .style('stroke-linejoin', 'round')
      .style('stroke-linecap', 'round')
      .attr('d', d3Type);
    }

  }, [clickedDrugData]);

  return (
    <div className="home_container">
      <Header />
      <div className="home_content">
        <div style={drug_container}>

            <div style={drug_content}>

                <div className="card" style={drug_info}>
                  <div style={search_query_container}>

                    <div style={search_query_title}>성분 검색</div>

                    <Form onKeyDown={(e) => {onEnterPress(e)}} style={{width:'400px', height:'200px', marginTop:'160px'}}>
                        <Form.Control style={search_query_input} value={searchQuery} onChange={(e) => handleSearch(e)} placeholder={"성분 이름을 입력하세요."}></Form.Control>
                        {(ingredSearchArr.length > 0) && <Dropdown  style={{display:'flex', flexDirection:'column', width:'100%', marginLeft:'16px', maxHeight:'188px', overflowY:'scroll', zIndex:'2', backgroundColor:'#FAFAFA', border:'1px solid silver', borderRadius:'4px'}}>
                        {ingredSearchArr.map((data, index) => (
                            <div key= {index}>
                                <Dropdown.Item key = {index} onClick={() => {handleSearchClick(data)}} style={{height:'100%'}}>
                                    {data}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                            </div>
                        ))
                        }
                        </Dropdown>}
                    </Form>

                    <Button variant="green" onClick={() => clickSearch()} style={{marginLeft:"20px", width:"70px", height:"40px"}}>검색</Button>
                    <Form.Check checked={isSearchByConcept} onChange={()=>{setIsSearchByConcept(true)}} style={{marginLeft:'16px'}}></Form.Check>
                    <Form.Text>약물 concept 기반 plot</Form.Text>
                    <Form.Check checked={!isSearchByConcept} onChange={()=>{setIsSearchByConcept(false);}} style={{marginLeft:'8px'}}></Form.Check>
                    <Form.Text>성분 concept 기반 plot</Form.Text>
                  </div>
                    <div className="divider-horizontal" style={drug_chart_new_divider} />
                      <div style={drug_chart_new_table_container}>

                          {isSearchByConcept ? (<Table bordered hover style={{overflowY:"auto"}}>
                            <thead>
                              <tr style={{fontSize:"16px", fontWeight:"200"}}>
                                <th style={{maxWidth:"200px"}}>해당 성분이 포함된 Concept Name</th>
                                <th style={{maxWidth:"160px"}}>Concept ID</th>
                                <th style={{maxWidth:"160px"}}>{`매칭되는 ${config.institution_name} Source Name`}</th>
                                <th style={{maxWidth:"160px"}}>{`${config.institution_name} ID`}</th>
                                <th style={{width:"144px"}}>전체 처방 횟수</th>
                              </tr>
                            </thead>
                            <tbody>
                              {drugInfoTable.map((data, index) => (
                                <tr style= {{fontSize:"16px"}} key={index} onClick={() => {setIsLoading(true); clickSearchDrug(data);}}>
                                  <td>{data.concept_name}</td>
                                  <td>{data.concept_id}</td>
                                  <td>{data.source_name.map((d, idx) => (
                                    <div key= {idx} style={{display:'flex', width:'100%'}}>{`- ${d}`}</div>))}
                                  </td>
                                  <td>{data[config.institution_sourcename_column].map((d, idx) => (
                                    <div key= {idx} style={{display:'flex', width:'100%'}}>{`- ${d}`}</div>))}
                                  </td>
                                  <td>{`${data.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
                                </tr>
                              ))
                            }
                            </tbody>
                          </Table>):(<Table bordered hover style={{overflowY:"auto"}}>
                              <thead>
                                  <tr>
                                      <th style={{maxWidth:"200px"}}>해당 성분 Concept Name</th>
                                      <th style={{maxWidth:"160px"}}>Concept ID</th>
                                      <th style={{maxWidth:"160px"}}>{`매칭되는 ${config.institution_name} Source Name`}</th>
                                      <th style={{maxWidth:"160px"}}>{`${config.institution_name} ID`}</th>
                                      <th style={{width:"144px"}}>전체 처방 횟수</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {searchByIngredDict && <tr onClick={() => {setIsLoading(true); clickSearchDrug(searchByIngredDict)}}>
                                      <td>{searchByIngredDict.concept_name}</td>
                                      <td>{searchByIngredDict.concept_id}</td>
                                      <td>{searchByIngredDict.source_name.map((res, idx) => {
                                          return <div key={idx}>{`- ${res}`}</div>
                                      })}</td>
                                      <td>{searchByIngredDict[config.institution_sourcename_column].map((res, idx) => {
                                          return <div key={idx}>{`- ${res}`}</div>
                                      })}</td>
                                      <td>{searchByIngredDict.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                  </tr>}
                              </tbody>
                            </Table>)}
                      </div>
                </div>

                <div style={drug_chart_container}>

                  <div className="card" style={Object.assign({marginTop:'24px'}, drug_chart_new_container)}>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'space-between'}}>
                      <div style={drug_chart_new_title}>처방 추이</div>
                    </div>
                      <Table bordered hover style={{marginTop:'8px', overflowY:"auto"}}>
                        <thead>
                          <tr style={{fontSize:"16px", fontWeight:"200"}}>
                            <th style={{maxWidth:"180px"}}>Concept Name</th>
                            <th style={{maxWidth:"160px"}}>Concept ID</th>
                            <th style={{maxWidth:"160px"}}>{`매칭되는 ${config.institution_name} Source Name`}</th>
                            <th style={{maxWidth:"160px"}}>{`${config.institution_name} ID`}</th>
                            <th style={{maxWidth:"160px"}}>{isSpecificSearch? "총 처방 용량 (mg)":"전체 처방 횟수"}</th>
                            <th style={{maxWidth:"144px"}}>Line color</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clickedDrugInfo.map((data, index) => (
                            <tr style= {{fontSize:"16px"}} key={index}>
                              <td>{data.concept_name}</td>
                              <td>{data.concept_id}</td>
                              <td>{data.source_name.map((d, idx) => (
                                <div key= {idx} style={{display:'flex', width:'100%'}}>{`- ${d}`}</div>))}
                              </td>
                              <td>{data[config.institution_sourcename_column].map((d, idx) => (
                                <div key= {idx} style={{display:'flex', width:'100%'}}>{`- ${d}`}</div>))}
                              </td>
                              <td>{`${data.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
                              <td style={{backgroundColor:data.color}}></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      
                    <div className="divider-horizontal" style={drug_chart_new_divider} />
                    <div style={drug_chart_new_line_container}>
                      <div ref={newRef} style={{width:"100%", height:"500px"}}>
                      </div>
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
  width: "100%",
  
};

const drug_content = {
  padding: "30px"
};

const search_container = {
  height: "100%",
  width: "100%",

  overflow: "auto",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};


const search_query_container = {
  height: "50px",
  margin: "8px 0",

  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center"
}

const search_query_title = {
  fontWeight: "700",
  fontSize: "18px",
  marginLeft: '24px'
}

const search_query_input = {
  width: "400px",
  height: "40px",
  marginLeft: "15px",
  marginRight: "15px"
}

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
const drug_info_item_title_border = {
  fontWeight: "700",
  padding: "4px",
  border: "1px solid black",
  display: "inline-block",
  borderRadius: "8px",
  fontSize: "16px"
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

/* Charts */
const drug_chart_container = {
  marginBottom: "30px",
  display: "flex",
  flexDirection: "column"
};

const drug_chart_new_container = {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};
const drug_chart_new_title = {
  fontWeight: "700",
  fontSize: "18px"
};
const drug_line_new_title = {
  fontWeight: "600",
  fontSize: "16px"
};
const drug_chart_new_table_container = {
    width: "100%",
    maxHeight: "400px",
    marginTop: "-20px",
    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "scroll"
};
const drug_chart_new_line_container = {
  width: "100%",
  height: "600px",
  marginTop: "-20px",
  paddingTop: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "scroll"
};
const drug_chart_new_divider = {
  marginTop: "8px"
};

export default New;