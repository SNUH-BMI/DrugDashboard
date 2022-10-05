import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import Header from './Header';
import config from '../config.json';

function Adverse() {
  const {state} = useLocation();
  const [isLoadingAdr, setIsLoadingAdr] = useState(true);
  const [adr, setAdr] = useState({});
  const [adrCntByPerson, setAdrCntByPerson] = useState({});
  const [adrCntByGender, setAdrCntByGender] = useState({});
  const [adrCntByAge, setAdrCntByAge] = useState({});
  const [adrCntByAgeTotal, setAdrCntByAgeTotal] = useState({});
  const [adrTerm, setAdrTerm] = useState([true, false, false]);
  const [countByPerson, setCountByPerson] = useState(false);
  const concept = { 'ALT':config.ALT_code, 'AST':config.AST_code, 'Cr':config.Cr_code, 'INR':config.INR_code, 'TBil':config.TBil_code };

  const server = config.server + '/api';

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

  const clickAdrTerm = (num) => {
    let tmp = [false, false, false];
    tmp[num] = true;

    setAdrTerm(tmp);
    setIsLoadingAdr(true);
    if(num === 0) getADRData(30);
    else if(num === 1) getADRData(90);
  };

  async function getADRData(term) {

    await axios.post(`${server}/search/adr`, {
        headers: {
            "Content-Type": "application/xml; charset=ISO-8859-1"
        },
        params: {
          concept_id: state.drugInfo.concept_id,
          term: term
        }
    }).then((res) => {
        let tmp = {
          "ALT": res.data["ALT_oo"],
          "AST": res.data["AST_oo"],
          "Cr": res.data["Cr_oo"],
          "INR": res.data["INR_oo"],
          "TBil": res.data["TBil_oo"],
          "ALT_tot": res.data["ALT_oo"]+res.data["ALT_in"],
          "AST_tot": res.data["AST_oo"]+res.data["AST_in"],
          "Cr_tot": res.data["Cr_oo"]+res.data["Cr_in"],
          "INR_tot": res.data["INR_oo"]+res.data["INR_in"],
          "TBil_tot": res.data["TBil_oo"]+res.data["TBil_in"],
        };
        let tmp_byperson = {
          "ALT": res.data["ALT_p_oo"],
          "AST": res.data["AST_p_oo"],
          "Cr": res.data["Cr_p_oo"],
          "INR": res.data["INR_p_oo"],
          "TBil": res.data["TBil_p_oo"],
          "ALT_tot": res.data["ALT_p_oo"]+res.data["ALT_p_in"],
          "AST_tot": res.data["AST_p_oo"]+res.data["AST_p_in"],
          "Cr_tot": res.data["Cr_p_oo"]+res.data["Cr_p_in"],
          "INR_tot": res.data["INR_p_oo"]+res.data["INR_p_in"],
          "TBil_tot": res.data["TBil_p_oo"]+res.data["TBil_p_in"],
        };

        let tmp_bygender = {
          "ALT_m": res.data["ALT_p_oo_male"],
          "ALT_f": res.data["ALT_p_oo_female"],
          "AST_m": res.data["AST_p_oo_male"],
          "AST_f": res.data["AST_p_oo_female"],
          "Cr_m": res.data["Cr_p_oo_male"],
          "Cr_f": res.data["Cr_p_oo_female"],
          "INR_m": res.data["INR_p_oo_male"],
          "INR_f": res.data["INR_p_oo_female"],
          "TBil_m": res.data["TBil_p_oo_male"],
          "TBil_f": res.data["TBil_p_oo_female"],
        };

        setAdr(tmp);
        setAdrCntByPerson(tmp_byperson);
        setAdrCntByGender(tmp_bygender);
        setAdrCntByAge(res.data["oo_by_conceptage"]["age_each"]);
        setAdrCntByAgeTotal(res.data["oo_by_conceptage"]["age_total"]);
        setIsLoadingAdr(false);
    }).catch((error) => alert('예상치 못한 오류가 발생했습니다! DB와의 연결이 원활하지 않습니다.'));
  };

  useEffect(() => {
    getADRData(30);
  }, []);  

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
                    <div className="divider-horizontal" style={drug_chart_adr_divider} />
                      <div style={drug_chart_adr_table_container}>
                          <Table bordered style={{overflowY:"auto"}}>
                            <thead>
                              <tr style={{fontSize:"16px", fontWeight:"200"}}>
                                <th style={{maxWidth:"200px"}}>포함 Concept Name</th>
                                <th style={{maxWidth:"160px"}}>포함 Concept ID</th>
                                <th style={{width:"144px"}}>전체 처방 횟수</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style= {{fontSize:"16px"}}>
                                <td>{state.drugInfo.concept_name.map((d, idx) => (
                                  <div key= {idx} style={{display:'flex', width:'100%'}}>{`- ${d}`}</div>))}
                                </td>
                                <td>{state.drugInfo.concept_id.map((d, idx) => (
                                  <div key= {idx} style={{display:'flex', width:'100%'}}>{`- ${d}`}</div>))}
                                </td>
                                <td>{`${state.drugInfo.ingred_total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</td>
                              </tr>
                            </tbody>
                          </Table>
                      </div>
                </div>
                <div style={drug_chart_container}>
                  <div className="card" style={drug_chart_adr_container}>
                      {/*<div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'space-between'}}>
                        <div style={drug_chart_adr_title}>검사 수치 이상 횟수</div>
                                </div>*/}
                      <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', marginTop:'8px', marginBottom:'4px'}}>
                        <div style={drug_chart_adr_subtitle}>※정상 수치 기준</div>
                      </div>
                      <div style={drug_chart_adr_table_container_standard}>
                          <Table bordered hover style={{overflowY:"auto"}}>
                            <thead>
                              <tr style={{fontSize:"16px", fontWeight:"200"}}>
                                <th style= {{minWidth: '120px'}}>ALT</th>
                                <th style= {{minWidth: '120px'}}>AST</th>
                                <th style= {{minWidth: '120px'}}>Cr</th>
                                <th style= {{minWidth: '120px'}}>INR</th>
                                <th style= {{minWidth: '120px'}}>T.Bil</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style= {{fontSize:"16px", fontWeight:"700"}}>
                                <td>{`1 ~ 47`}</td>
                                <td>{`1 ~ 40`}</td>
                                <td>{`0.4 ~ 1.4`}</td>
                                <td>{`0.8 ~ 1.2`}</td>
                                <td>{`0.2 ~ 1.6`}</td>
                              </tr>
                            </tbody>
                          </Table>
                      </div>
                      <div className="divider-horizontal" style={drug_chart_adr_divider} />
                      <div style={{display:"flex", width: '100%', flexDirection:"row", alignSelf:"flex-start", justifyContent:'space-between', marginTop:'12px', marginBottom: '12px'}}>
                      <div style={{display:"flex", flexDirection:"row"}}>
                        복용 후 기간: 
                        <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                          <Form.Check checked={adrTerm[0]} onChange={()=>{clickAdrTerm(0)}}></Form.Check>
                          <Form.Text style={{marginLeft:'4px', marginTop:'-2px'}}>1개월 이내</Form.Text>
                        </div>
                        <div style={{display:"flex", flexDirection:"row", marginLeft:"4px", marginRight:"4px", alignItems:"center"}}>
                          <Form.Check checked={adrTerm[1]} onChange={()=>{clickAdrTerm(1)}}></Form.Check>
                          <Form.Text style={{marginLeft:'4px', marginTop:'-2px'}}>3개월 이내</Form.Text>
                        </div>
                      </div>
                      <div style={{display:"flex", flexDirection:"row"}}>
                        <Form.Check checked={countByPerson} onChange={()=>{setCountByPerson(!countByPerson)}}></Form.Check>
                        <Form.Text style={{marginLeft:'4px', marginTop:'-2px'}}>count by person</Form.Text>
                      </div>
                    </div>
                      
                      <div style={drug_chart_adr_table_container}>
                          {isLoadingAdr && <div className="loading-indicator"/>}
                          {!isLoadingAdr && 
                          <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', marginTop:'8px', marginBottom:'4px'}}>
                            <div style={drug_chart_adr_subtitle}>검사 수치 이상 횟수 (동일한 날에 발생한 검사는 이상치 유무에따라 한번만 카운트됩니다.)</div>
                          </div>}
                          {!isLoadingAdr &&<Table bordered hover style={{overflowY:"auto"}}>
                            <thead>
                              <tr style={{fontSize:"16px", fontWeight:"200"}}>

                                <th style={{width:"100px"}}>ALT</th>
                                <th style={{width:"100px"}}>AST</th>
                                <th style={{width:"100px"}}>Cr</th>
                                <th style={{width:"144px"}}>INR</th>
                                <th style={{width:"144px"}}>T.Bil</th>
                              </tr>
                            </thead>
                            <tbody>
                              {countByPerson ?
                              (<tr style= {{fontSize:"16px"}}>
                                <td>{`${adrCntByPerson['ALT']} (${((adrCntByPerson['ALT']/adrCntByPerson['ALT_tot'])*100).toFixed(2)}%)`}</td>
                                <td>{`${adrCntByPerson['AST']} (${((adrCntByPerson['AST']/adrCntByPerson['AST_tot'])*100).toFixed(2)}%)`}</td>
                                <td>{`${adrCntByPerson['Cr']} (${((adrCntByPerson['Cr']/adrCntByPerson['Cr_tot'])*100).toFixed(2)}%)`}</td>
                                <td>{`${adrCntByPerson['INR']} (${((adrCntByPerson['INR']/adrCntByPerson['INR_tot'])*100).toFixed(2)}%)`}</td>
                                <td>{`${adrCntByPerson['TBil']} (${((adrCntByPerson['TBil']/adrCntByPerson['TBil_tot'])*100).toFixed(2)}%)`}</td>
                              </tr>):(<tr style= {{fontSize:"16px"}}>
                                <td>{`${adr['ALT']} (${((adr['ALT']/adr['ALT_tot'])*100).toFixed(2)}%)`}</td>
                                <td>{`${adr['AST']} (${((adr['AST']/adr['AST_tot'])*100).toFixed(2)}%)`}</td>
                                <td>{`${adr['Cr']} (${((adr['Cr']/adr['Cr_tot'])*100).toFixed(2)}%)`}</td>
                                <td>{`${adr['INR']} (${((adr['INR']/adr['INR_tot'])*100).toFixed(2)}%)`}</td>
                                <td>{`${adr['TBil']} (${((adr['TBil']/adr['TBil_tot'])*100).toFixed(2)}%)`}</td>
                              </tr>)}
                            </tbody>
                          </Table>}
                          {!isLoadingAdr && 
                          <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', marginTop:'8px', marginBottom:'4px'}}>
                            <div style={drug_chart_adr_subtitle}>남 / 여 비율 (count by person 기준)</div>
                          </div>}
                          {!isLoadingAdr &&<Table bordered hover style={{overflowY:"auto"}}>
                            <thead>
                              <tr style={{fontSize:"16px", fontWeight:"200"}}>

                                <th style={{width:"100px"}}>ALT</th>
                                <th style={{width:"100px"}}>AST</th>
                                <th style={{width:"100px"}}>Cr</th>
                                <th style={{width:"144px"}}>INR</th>
                                <th style={{width:"144px"}}>T.Bil</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style= {{fontSize:"16px"}}>
                                <td>{`${adrCntByGender['ALT_m']} (${((adrCntByGender['ALT_m']/(adrCntByGender['ALT_m']+ adrCntByGender['ALT_f']))*100).toFixed(2)}%) / ${adrCntByGender['ALT_f']} (${((adrCntByGender['ALT_f']/(adrCntByGender['ALT_m']+ adrCntByGender['ALT_f']))*100).toFixed(2)}%)`}</td>
                                <td>{`${adrCntByGender['AST_m']} (${((adrCntByGender['AST_m']/(adrCntByGender['AST_m']+ adrCntByGender['AST_f']))*100).toFixed(2)}%) / ${adrCntByGender['AST_f']} (${((adrCntByGender['AST_f']/(adrCntByGender['AST_m']+ adrCntByGender['AST_f']))*100).toFixed(2)}%)`}</td>
                                <td>{`${adrCntByGender['Cr_m']} (${((adrCntByGender['Cr_m']/(adrCntByGender['Cr_m']+ adrCntByGender['Cr_f']))*100).toFixed(2)}%) / ${adrCntByGender['Cr_f']} (${((adrCntByGender['Cr_f']/(adrCntByGender['Cr_m']+ adrCntByGender['Cr_f']))*100).toFixed(2)}%)`}</td>
                                <td>{`${adrCntByGender['INR_m']} (${((adrCntByGender['INR_m']/(adrCntByGender['INR_m']+ adrCntByGender['INR_f']))*100).toFixed(2)}%) / ${adrCntByGender['INR_f']} (${((adrCntByGender['INR_f']/(adrCntByGender['INR_m']+ adrCntByGender['INR_f']))*100).toFixed(2)}%)`}</td>
                                <td>{`${adrCntByGender['TBil_m']} (${((adrCntByGender['TBil_m']/(adrCntByGender['TBil_m']+ adrCntByGender['TBil_f']))*100).toFixed(2)}%) / ${adrCntByGender['TBil_f']} (${((adrCntByGender['TBil_f']/(adrCntByGender['TBil_m']+ adrCntByGender['TBil_f']))*100).toFixed(2)}%)`}</td>
                              </tr>
                            </tbody>
                          </Table>}
                          {!isLoadingAdr && 
                          <div style={{display:'flex', flexDirection:'row', alignItems:'center', width:'100%', marginTop:'8px', marginBottom:'4px'}}>
                            <div style={drug_chart_adr_subtitle}>나이대별 비율 (count by person 기준, 단 나이대가 바뀐 경우 같은 사람 기준 여러번 카운트 될 수 있음)</div>
                          </div>}
                          {!isLoadingAdr &&<Table bordered hover style={{overflowY:"auto"}}>
                            <thead>
                              <tr style={{fontSize:"16px", fontWeight:"200"}}>
                                <th style={{width:"100px"}}>나이대</th>
                                <th style={{width:"100px"}}>ALT</th>
                                <th style={{width:"100px"}}>AST</th>
                                <th style={{width:"100px"}}>Cr</th>
                                <th style={{width:"144px"}}>INR</th>
                                <th style={{width:"144px"}}>T.Bil</th>
                              </tr>
                            </thead>
                            <tbody>
                                {Object.keys(adrCntByAge).length > 0 && ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"].map((data, idx) => (
                                <tr key={idx} style= {{fontSize:"16px"}}>
                                  <td>{data === "100" ? ("100 이상"): (`${data}`)}</td>
                                  <td>{`${adrCntByAge[concept['ALT']][data]} (${((adrCntByAge[concept['ALT']][data]/adrCntByAgeTotal[concept['ALT']])*100).toFixed(2)}%)`}</td>
                                  <td>{`${adrCntByAge[concept['AST']][data]}  (${((adrCntByAge[concept['AST']][data]/adrCntByAgeTotal[concept['AST']])*100).toFixed(2)}%)`}</td>
                                  <td>{`${adrCntByAge[concept['Cr']][data]}  (${((adrCntByAge[concept['Cr']][data]/adrCntByAgeTotal[concept['Cr']])*100).toFixed(2)}%)`}</td>
                                  <td>{`${adrCntByAge[concept['INR']][data]}  (${((adrCntByAge[concept['INR']][data]/adrCntByAgeTotal[concept['INR']])*100).toFixed(2)}%)`}</td>
                                  <td>{`${adrCntByAge[concept['TBil']][data]}  (${((adrCntByAge[concept['TBil']][data]/adrCntByAgeTotal[concept['TBil']])*100).toFixed(2)}%)`}</td>
                                </tr>
                                ))
                                }
                            </tbody>
                          </Table>}
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
  flexDirection: "row"
};

/* Adr Table */
const drug_chart_adr_container = {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};
const drug_chart_adr_subtitle = {
  fontWeight: "700",
  fontSize: "16px"
};
const drug_chart_adr_table_container_standard = {
  display: "flex",
  flexDirection: "column",
  alignSelf: 'flex-start',
};
const drug_chart_adr_table_container = {
    width: "100%",


    paddingTop: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};
const drug_chart_adr_divider = {
  marginTop: "8px"
};

export default Adverse;