import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Table, Dropdown } from 'react-bootstrap';
import Header from './Header';
import config from '../config.json';
import searchData from '../cached_data/drug_count.json';

function Search() {
    const {state} = useLocation();
    const navigate = useNavigate()

    const [isSearched, setIsSearched] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [notMixedSearchList, setNotMixedSearchList] = useState([]);
    const [MixedSearchList, setMixedSearchList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchNum, setSearchNum] = useState(0); 

    //For Search recommendation
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
    }); // 성분 전체 딕셔너리
    const MixedDict = searchData.filter((data) => data.is_mixed);
    const NotMixedDict = searchData.filter((data) => !data.is_mixed);
    const [ingredSearchArr, setIngredSearchArr] = useState([]); // 자동완성 딕셔너리
    
    const server = config.server + '/api';

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
    }

    const handleSearchClick = (data) => {
        setSearchQuery(data);
        setIngredSearchArr([]);
        setIsLoading(true);
        searchDrugAPIForClick(data);
    }

    function searchDrugAPIForClick(query) {
        let notmixedtmp = NotMixedDict.filter((data) => data.ingredient_concept_name[0] === query.toLowerCase());
        if(notmixedtmp.length > 0){
            let total = notmixedtmp.reduce((acc, cur, i) => {
                let route_tmp = [...acc.route];
                for (let i=0; i<cur.route.length; i++){
                    if(!route_tmp.includes(cur.route[i])) route_tmp.push(cur.route[i]);
                }
                return {concept_id: [...acc.concept_id, cur.concept_id], concept_name: [...acc.concept_name, cur.concept_name], [config.institution_sourcename_column]:[...acc[config.institution_sourcename_column], ...cur[config.institution_sourcename_column]], source_name:[...acc.source_name, ...cur.source_name], vocabulary:[...acc.vocabulary, ...cur.vocabulary], route: route_tmp, total_count: acc.total_count+parseInt(cur.count)};
            }, {concept_id:[], concept_name:[], [config.institution_sourcename_column]:[], source_name:[], vocabulary:[], route: [], total_count:0});

            setNotMixedSearchList([{
                concept_id: total.concept_id,
                concept_name: total.concept_name,
                ingred_concept_id: notmixedtmp[0].ingredient_concept_id,
                ingred_concept_name: notmixedtmp[0].ingredient_concept_name,
                [config.institution_sourcename_column]: total[config.institution_sourcename_column],
                source_name: total.source_name,
                vocabulary: total.vocabulary,
                route: total.route,
                ingred_total_count: total.total_count
            }]);
        }
        else {
            setNotMixedSearchList([]);
        }
        
        let mixedtmp = MixedDict.filter((data) => data.ingredient_concept_name.includes(query.toLowerCase()));
        let mixedtmp_dict = {};
        for (let i=0; i<mixedtmp.length; i++){
            let key = JSON.stringify(mixedtmp[i].ingredient_concept_id);
            if(!mixedtmp_dict[key]){
                mixedtmp_dict[key] = {};
                mixedtmp_dict[key].concept_id = [mixedtmp[i].concept_id];
                mixedtmp_dict[key].concept_name = [mixedtmp[i].concept_name];
                mixedtmp_dict[key].count = parseInt(mixedtmp[i].count);
                mixedtmp_dict[key].ingredient_concept_id = [...mixedtmp[i].ingredient_concept_id];
                mixedtmp_dict[key].ingredient_concept_name = [...mixedtmp[i].ingredient_concept_name];
                mixedtmp_dict[key].is_mixed = mixedtmp[i].is_mixed;
                mixedtmp_dict[key].route = [...mixedtmp[i].route];
                mixedtmp_dict[key][config.institution_sourcename_column] = [...mixedtmp[i][config.institution_sourcename_column]];
                mixedtmp_dict[key].source_name = [...mixedtmp[i].source_name];
                mixedtmp_dict[key].vocabulary = [...mixedtmp[i].vocabulary];
            }
            else{
                mixedtmp_dict[key].concept_id.push(mixedtmp[i].concept_id);
                mixedtmp_dict[key].concept_name.push(mixedtmp[i].concept_name);
                mixedtmp_dict[key][config.institution_sourcename_column].push(mixedtmp[i][config.institution_sourcename_column]);
                mixedtmp_dict[key].source_name.push(mixedtmp[i].source_name);
                mixedtmp_dict[key].vocabulary.push(mixedtmp[i].vocabulary);
                mixedtmp_dict[key].count += parseInt(mixedtmp[i].count);
                for(let j=0; j<mixedtmp[i].route.length; j++){
                    if(!mixedtmp_dict[key].route.includes(mixedtmp[i].route[j])) mixedtmp_dict[key].route.push(mixedtmp[i].route[j]);
                }

            }
        }

        setMixedSearchList(Object.keys(mixedtmp_dict).map((data) => {
            let obj = {
                concept_id: mixedtmp_dict[data].concept_id,
                concept_name: mixedtmp_dict[data].concept_name,
                ingred_concept_id: mixedtmp_dict[data].ingredient_concept_id,
                ingred_concept_name: mixedtmp_dict[data].ingredient_concept_name,
                [config.institution_sourcename_column]: mixedtmp_dict[data][config.institution_sourcename_column],
                source_name: mixedtmp_dict[data].source_name,
                vocabulary: mixedtmp_dict[data].vocabulary,
                route: mixedtmp_dict[data].route,
                ingred_total_count: mixedtmp_dict[data].count
            }
            return obj;
        }));

        setIsLoading(false);
        setIsSearched(true);
        if(notmixedtmp.length === 0) setSearchNum(Object.keys(mixedtmp_dict).length);
        else setSearchNum(1+Object.keys(mixedtmp_dict).length);
    }

    const clickSearch = () => {
        if(searchQuery.length < 2) {
            alert('2글자 이상 입력해주세요.');
            return;
        }
        setIsLoading(true);
        searchDrugAPI();
    };

    const onEnterPress = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            clickSearch();
        }
    };
    
    function searchDrugAPI() {
        let notmixedtmp = NotMixedDict.filter((data) => data.ingredient_concept_name[0] === searchQuery.toLowerCase());
        if(notmixedtmp.length > 0){
            let total = notmixedtmp.reduce((acc, cur, i) => {
                let route_tmp = [...acc.route];
                for (let i=0; i<cur.route.length; i++){
                    if(!route_tmp.includes(cur.route[i])) route_tmp.push(cur.route[i]);
                }
                return {concept_id: [...acc.concept_id, cur.concept_id], concept_name: [...acc.concept_name, cur.concept_name], [config.institution_sourcename_column]:[...acc[config.institution_sourcename_column], ...cur[config.institution_sourcename_column]], source_name:[...acc.source_name, ...cur.source_name], vocabulary:[...acc.vocabulary, ...cur.vocabulary], route: route_tmp, total_count: acc.total_count+parseInt(cur.count)};
            }, {concept_id:[], concept_name:[], [config.institution_sourcename_column]:[], source_name:[], vocabulary:[], route: [], total_count:0});

            setNotMixedSearchList([{
                concept_id: total.concept_id,
                concept_name: total.concept_name,
                ingred_concept_id: notmixedtmp[0].ingredient_concept_id,
                ingred_concept_name: notmixedtmp[0].ingredient_concept_name,
                [config.institution_sourcename_column]: total[config.institution_sourcename_column],
                source_name: total.source_name,
                vocabulary: total.vocabulary,
                route: total.route,
                ingred_total_count: total.total_count
            }]);
        }
        else {
            setNotMixedSearchList([]);
        }
        
        let mixedtmp = MixedDict.filter((data) => data.ingredient_concept_name.includes(searchQuery.toLowerCase()));
        let mixedtmp_dict = {};
        for (let i=0; i<mixedtmp.length; i++){
            let key = JSON.stringify(mixedtmp[i].ingredient_concept_id);
            if(!mixedtmp_dict[key]){
                mixedtmp_dict[key] = {};
                mixedtmp_dict[key].concept_id = [mixedtmp[i].concept_id];
                mixedtmp_dict[key].concept_name = [mixedtmp[i].concept_name];
                mixedtmp_dict[key].count = parseInt(mixedtmp[i].count);
                mixedtmp_dict[key].ingredient_concept_id = [...mixedtmp[i].ingredient_concept_id];
                mixedtmp_dict[key].ingredient_concept_name = [...mixedtmp[i].ingredient_concept_name];
                mixedtmp_dict[key].is_mixed = mixedtmp[i].is_mixed;
                mixedtmp_dict[key].route = [...mixedtmp[i].route];
                mixedtmp_dict[key][config.institution_sourcename_column] = [...mixedtmp[i][config.institution_sourcename_column]];
                mixedtmp_dict[key].source_name = [...mixedtmp[i].source_name];
                mixedtmp_dict[key].vocabulary = [...mixedtmp[i].vocabulary];
            }
            else{
                mixedtmp_dict[key].concept_id.push(mixedtmp[i].concept_id);
                mixedtmp_dict[key].concept_name.push(mixedtmp[i].concept_name);
                mixedtmp_dict[key][config.institution_sourcename_column].push(mixedtmp[i][config.institution_sourcename_column]);
                mixedtmp_dict[key].source_name.push(mixedtmp[i].source_name);
                mixedtmp_dict[key].vocabulary.push(mixedtmp[i].vocabulary);
                mixedtmp_dict[key].count += parseInt(mixedtmp[i].count);
                for(let j=0; j<mixedtmp[i].route.length; j++){
                    if(!mixedtmp_dict[key].route.includes(mixedtmp[i].route[j])) mixedtmp_dict[key].route.push(mixedtmp[i].route[j]);
                }

            }
        }

        setMixedSearchList(Object.keys(mixedtmp_dict).map((data) => {
            let obj = {
                concept_id: mixedtmp_dict[data].concept_id,
                concept_name: mixedtmp_dict[data].concept_name,
                ingred_concept_id: mixedtmp_dict[data].ingredient_concept_id,
                ingred_concept_name: mixedtmp_dict[data].ingredient_concept_name,
                [config.institution_sourcename_column]: mixedtmp_dict[data][config.institution_sourcename_column],
                source_name: mixedtmp_dict[data].source_name,
                vocabulary: mixedtmp_dict[data].vocabulary,
                route: mixedtmp_dict[data].route,
                ingred_total_count: mixedtmp_dict[data].count
            }
            return obj;
        }));

        setIsLoading(false);
        setIsSearched(true);
        if(notmixedtmp.length === 0) setSearchNum(Object.keys(mixedtmp_dict).length);
        else setSearchNum(1+Object.keys(mixedtmp_dict).length);
    }

    function searchDetail(data, isMixed) {
        if(state.routeState === 0){
            navigate(`/poly/drug/${data.concept_id}/${data[config.institution_sourcename_column]}`, { state: {drugInfo: data, isMixed:isMixed}})
        }
        else if (state.routeState === 1){
            navigate(`/adverse/drug/${data.concept_id}/${data[config.institution_sourcename_column]}`, { state: {drugInfo: data, isMixed:isMixed}})
        }
        else if (state.routeState === 2){
            navigate(`/new`, { state: {drugInfo: data, isMixed:isMixed}})
        }
    }

  return (
    <div className="home_container">
        <Header />
        <div className="home_content">
            <div style={search_container}>

                <div style={search_query_container} className="card">

                    <div style={search_query_title}>성분 검색</div>

                    <div className="divider-vertical" />

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
                </div>
                <div style={search_table_container} className="card">

                    <div style={search_table_title}>{(!isLoading)? "검색 결과: "+String(searchNum)+"건": "검색중..."}</div>

                    <div className="divider-horizontal" />

                    {isLoading&& <div className="loading-indicator" />}

                    {(isSearched && !isLoading) &&
                        <div style={{width:"100%", height:"100%"}}>
                            <Table bordered hover striped>
                                <thead>
                                    <tr>
                                        <th style={{maxWidth:"100px"}}>성분 OMOP Concept ID</th>
                                        <th style={{maxWidth:"200px"}}>성분 OMOP Concept Name</th>
                                        <th style={{width:"132px"}}>{`${config.institution_name} ID`}</th>
                                        <th style={{minWidth:"200px"}}>{`${config.institution_name} Source Name`}</th>
                                        <th style={{width:"200px"}}>Vocabulary</th>
                                        <th style={{width:"100px"}}>Route</th>
                                        <th style={{width:"180px"}}>Prescription Count</th>
                                        <th style={{width:"150px"}}>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notMixedSearchList.map((data, index) => (
                                    <tr>
                                        <td>{data.ingred_concept_id}</td>
                                        <td>{data.ingred_concept_name}</td>
                                        <td>{data[config.institution_sourcename_column].map((res, idx) => {
                                            return <div key={idx}>{`- ${res}`}</div>
                                        })}</td>
                                        <td>{data.source_name.map((res, idx) => {
                                            return <div key={idx}>{`- ${res}`}</div>
                                        })}</td>
                                        <td>{data.vocabulary.map((res, idx) => {
                                            return <div key={idx}>{`- ${res}`}</div>
                                        })}</td>
                                        <td>{data.route.reduce((result, item, idx) => {if(idx === data.route.length-1) return `${result} ${item}`; else return `${result} ${item},`;}, "")}</td>
                                        <td>{data.ingred_total_count}</td>
                                        <td style={{padding:"4px"}}><Button variant="green" style={{width:"100%", height:"100%"}} onClick={() => {searchDetail(data, false)}}>Detail</Button></td>
                                    </tr>
                                    ))
                                    }
                                    {
                                        MixedSearchList.map((data, index) => (
                                            <tr>
                                                <td>{data.ingred_concept_id.map((res, idx) => {
                                                    if(idx === data.ingred_concept_id.length-1)
                                                    return <div key={idx}>{`${res}`}</div>
                                                    else return <div key={idx}>{`${res} +`}</div>
                                                })}</td>
                                                <td>{data.ingred_concept_name.map((res, idx) => {
                                                    if(idx === data.ingred_concept_name.length-1)
                                                    return <div key={idx}>{`${res}`}</div>
                                                    else return <div key={idx}>{`${res} +`}</div>
                                                })}</td>
                                                <td>{data[config.institution_sourcename_column].map((res, idx) => {
                                                    return <div key={idx}>{`- ${res}`}</div>
                                                })}</td>
                                                <td>{data.source_name.map((res, idx) => {
                                                    return <div key={idx}>{`- ${res}`}</div>
                                                })}</td>
                                                <td>{data.vocabulary.map((res, idx) => {
                                                    return <div key={idx}>{`- ${res}`}</div>
                                                })}</td>
                                                <td>{data.route.reduce((result, item, idx) => {if(!MixedSearchList.route) return ""; if(idx === MixedSearchList.route.length-1) return `${result} ${item}`; else return `${result} ${item},`;}, "")}</td>
                                                <td>{data.ingred_total_count}</td>
                                                <td style={{padding:"4px"}}><Button variant="green" style={{width:"100%", height:"100%"}} onClick={() => {searchDetail(data, true)}}>Detail</Button></td>
                                            </tr>
                                            ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                    }

                    {(!isSearched || !notMixedSearchList) && 
                        <div>
                            No Data
                        </div>    
                    }
                </div>

            </div>
        </div>
    </div>
  );
}

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
    margin: "30px 0",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
}

const search_query_title = {
    fontWeight: "700",
    fontSize: "18px"
}

const search_query_input = {
    width: "400px",
    height: "40px",
    marginLeft: "15px",
    marginRight: "15px"
}

const search_table_container = {
    width: "90%",
    marginBottom: "30px",

    display: "flex",
    flexDirection: "column",
    alignItems: "center"
}

const search_table_title = {
    fontWeight: "700",
    fontSize: "18px"
}

const search_table_paginationcontainer = {
    display: "flex",
    flexDirection: "row",
    marginTop: "12px"
}

const search_table_pagination = {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px"
}

export default Search;