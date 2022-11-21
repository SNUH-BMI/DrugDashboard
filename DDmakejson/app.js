import * as DB from './db/index.js';
import * as utility from './utility.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

var fs = require('fs');
var express = require('express'); 
var http = require('http'); 
var app = express(); 
var server = http.createServer(app); 

DB.init()
    .then(() => utility.print('Database initialized'))
    .catch(() => utility.print('error'));

const cache_schema_name = "캐시스키마명";
const cdm_schema_name = "CDM스키마명";
const institution_id = "기관ID컬럼명";
const source_name_column = Symbol(institution_id);

// drug_count.json 만들기 1
/*
await DB.run(
    `SELECT de.drug_concept_id, ddidcs.ingredient_concept_id, ddidcs.ingredient_concept_name, ddidcs.concept_name, ddidcs.${institution_id}, ddidcs.vocabulary, ddidcs.source_name, COUNT(*) as count
    FROM ${cdm_schema_name}.drug_exposure AS de
        INNER JOIN ${cache_schema_name}.drug_dashboard_ingredient_drug_concept_source AS ddidcs ON de.drug_concept_id = ddidcs.drug_concept_id
    GROUP BY de.drug_concept_id, ddidcs.ingredient_concept_id, ddidcs.ingredient_concept_name, ddidcs.concept_name, ddidcs.${institution_id}, ddidcs.vocabulary, ddidcs.source_name;`
    ).then((res) => {
        console.log("query completed");
            let json_tmp_dict = {};
            for (let i=0; i<res.rows.length; i++){
                let concept_id = res.rows[i].drug_concept_id;
                let concept_name = res.rows[i].concept_name;
                let ing_concept_id = res.rows[i].ingredient_concept_id;
                let ing_name = res.rows[i].ingredient_concept_name;
                let drug_snuh_id = res.rows[i][institution_id];
                let drug_vocabulary = res.rows[i].vocabulary;
                let drug_source_name = res.rows[i].source_name;
                let count = res.rows[i].count;

                if(json_tmp_dict[concept_id]){
                    if(concept_name === json_tmp_dict[concept_id].concept_name && count === json_tmp_dict[concept_id].count){
                        if(json_tmp_dict[concept_id].ingredient_concept_id.includes(ing_concept_id)){
                            json_tmp_dict[concept_id][institution_id].push(drug_snuh_id);
                            json_tmp_dict[concept_id].vocabulary.push(drug_vocabulary);
                            json_tmp_dict[concept_id].source_name.push(drug_source_name);
                            continue;
                        }
                        json_tmp_dict[concept_id].ingredient_concept_id.push(ing_concept_id);
                        json_tmp_dict[concept_id].ingredient_concept_name.push(ing_name);
                        json_tmp_dict[concept_id].isMixed = true;
                    }
                    else{
                        // sth went wrong!!
                        console.log("error!!");
                        console.log(res.rows[i]);
                        console.log(concept_id);
                    }
                }
                else{
                    json_tmp_dict[concept_id] = {
                        concept_name: concept_name,
                        ingredient_concept_id: [ing_concept_id],
                        ingredient_concept_name: [ing_name],
                        [institution_id]: [drug_snuh_id],
                        vocabulary: [drug_vocabulary],
                        source_name: [drug_source_name],
                        count: count,
                        isMixed: false
                    };
                }
            }

            let json_save_info = Object.keys(json_tmp_dict).map((data) => {
                let obj = {
                    concept_id: data,
                    concept_name: json_tmp_dict[data].concept_name,
                    ingredient_concept_id: json_tmp_dict[data].ingredient_concept_id,
                    ingredient_concept_name: json_tmp_dict[data].ingredient_concept_name,
                    [institution_id]: json_tmp_dict[data][institution_id],
                    vocabulary: json_tmp_dict[data].vocabulary,
                    source_name: json_tmp_dict[data].source_name,
                    count: json_tmp_dict[data].count,
                    is_mixed: json_tmp_dict[data].isMixed
                }
                return obj;
            });
            fs.writeFile('./drug_count.json', JSON.stringify(json_save_info, null, 4), function(err){
                if(err){
                    console.log(err);
                    return;
                }
            });
    });
console.log("drug_count json completed");
*/
// drug_count.json 만들기 1 끝

// drug_count.json 만들기 2 (route 붙이기)
/*
const drug_count = await require("./drug_count.json");

console.log("2차 완료");

let tmp = [...drug_count];

for(let i=0; i< drug_count.length; i++){
    let id = drug_count[i].concept_id;
    console.log(i);
    await DB.run(
        ` SELECT DISTINCT route_source_value
            FROM ${cdm_schema_name}.drug_exposure
            WHERE drug_concept_id = ${id}
        `
    ).then((res) => {
        if (res.rows.length > 1){
            tmp[i].route = []
            for(let j=0; j< res.rows.length; j++){
                tmp[i].route.push(res.rows[j].route_source_value);
            }
            console.log('route length error');
            console.log(drug_count[i]);
            return;
        }
        if (!tmp[i].route || !tmp[i].route.includes(res.rows[0].route_source_value)){
            tmp[i].route = [res.rows[0].route_source_value];
        }
    })
}

fs.writeFile('./drug_count.json', JSON.stringify(tmp, null, 4), function(err){
    if(err){
        console.log(err);
        return;
    }
});

console.log("drug_count json completed");
*/
// drug_count.json 만들기 2 (route 붙이기) 끝

// ACT json 만들기
/*
var act_final = [];

var data = fs.readFileSync("./class_drugs_scraper.csv", {encoding:"utf8"});
var rows = data.split("\n");
for (var rowIndex in rows) {
    var row = rows[rowIndex].split(",");
    if(rowIndex === "0") continue;
    var inner_data = {"code": row[1], "name": row[2]};
    act_final.push(inner_data);
}

fs.writeFile('./atc.json', JSON.stringify(act_final, null, 4), function(err){
    if(err){
        console.log(err);
        return;
    }
});

console.log("act json completed");
*/
// ACT json 만들기 끝

// drug_route_type.json 만들기
/*
const drug_route = await require("./new_masked_drug_route_type.json");

await DB.run(
    `
    SELECT ${institution_id}, omop_concept_id FROM ${cdm_schema_name}.source_to_concept_map WHERE domain = 'Drug' AND vocabulary = 'RxNorm';`
    ).then((res) => {
        console.log("1차 완료");
        
        let new_drug_route = [];
        for(let i=0; i<drug_route.length; i++){
            let tmp = res.rows.filter(d => d["omop_concept_id"] == drug_route[i].omop_concept_id);
            if(tmp.length > 0){
                let new_obj = {};
                new_obj["omop_concept_id"] = tmp[0].omop_concept_id;
                new_obj["id"] = tmp[0][institution_id];
                new_obj["route"] = drug_route[i]["route"];
                new_obj["type"] = drug_route[i]["type"];
                new_drug_route.push(new_obj);
            }
        }
        fs.writeFile('./drug_route_type.json', JSON.stringify(new_drug_route, null, 4), function(err){
            if(err){
                console.log(err);
                return;
            }
        });
        console.log("drug_route_type.json finished");
    });
*/
// drug_route_type.json 만들기 끝
