import firebase from "./app.js"
import { getCookies, setCookies } from "./cookies.js"

var id_user             = getCookies("SESSION_USER")
var btnLogout           = document.querySelector("#btnLogout")
var database            = firebase.database()
var btn_rearme          = document.querySelector("#botao_rearme");
var btndisjuntor_armado = document.querySelector("#disjuntor_armado");
var btntensao_presente  = document.querySelector("#tensao_presente");
var statusBtnRearme     = true;

if(!!!id_user) window.location.href = "./index.html"

const grafico = function (target, labels, values) {
    const data   = { labels: labels, datasets: [{ data: values, fill: false, borderColor: 'rgb(75, 192, 192)', tension: 0.1 }] }; 
    const config = { type: 'line', data: data, options: { plugins: { legend: false } }}
    return new Chart(target,config)
}

const addData = function (chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

const removeData = function (chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
 

btnLogout.addEventListener("click",function(){
    setCookies("SESSION_USER","",-1)
    window.location.href = "./index.html"
})

btn_rearme.addEventListener("click", function(){
    statusBtnRearme = (btn_rearme.classList.contains("active")) ? false : true;
    
    if(!statusBtnRearme) btn_rearme.classList.remove("active");
    if(statusBtnRearme) btn_rearme.classList.add("active");
 
    database.ref(`/painel/${id_user}/estados`).on("value", function(data) {
        const dados = data.val()
        dados.botao_rearme = statusBtnRearme
        database.ref(`/painel/${id_user}/estados`).update(dados)
    });
})

btndisjuntor_armado.addEventListener("click", function(){
    database.ref(`/painel/${id_user}/estados`).on("value", function(data) {
        const dados = data.val()
        dados.disjuntor_armado = btndisjuntor_armado.checked
        database.ref(`/painel/${id_user}/estados`).update(dados)
    });
})

btntensao_presente.addEventListener("click", function(){
    database.ref(`/painel/${id_user}/estados`).on("value", function(data) {
        const dados = data.val()
        dados.tensao_presente = btntensao_presente.checked
        database.ref(`/painel/${id_user}/estados`).update(dados)
    });
})

// Carregamento estrutura painel
database.ref(`/painel/${id_user}/estados`).on("value", function(data) {
    const {botao_rearme, disjuntor_armado, tensao_presente} = data.val();
    btndisjuntor_armado.checked = disjuntor_armado;
    btntensao_presente.checked  = tensao_presente;
    if(botao_rearme) btn_rearme.classList.add("active")    
    else btn_rearme.classList.remove("active")
});

// Carregamento estrutura painel
const container_medicoes = [
    {"id": "indicador_corrente"},
    {"id": "indicador_demanda"},
    {"id": "indicador_fator_potencia"},
    {"id": "indicador_potencia_aparente"},
    {"id": "indicador_potencia_ativa"},
    {"id": "indicador_potencia_reativa"},
    {"id": "indicador_tensao"},
]

database.ref(`/painel/${id_user}/medicoes`).on("value", function(data){
    container_medicoes.forEach((medicoes, index) => {
        const { corrente, demanda, fator_de_potencia, potencia_aparente, potencia_ativa, potencia_reativa, tensao } = data.val()
        const fbmedicoes = [corrente, demanda, fator_de_potencia, potencia_aparente, potencia_ativa, potencia_reativa, tensao]
        const container = document.getElementById(medicoes.id);
        container.children[1].innerText = parseFloat(fbmedicoes[index]).toFixed(2);
    })
})


// Carregamento estrutura graficos
const canvas = [];

const tratamentoString = function (value, objeto) {
    const refdata  = value.split(",");
    const col1     = refdata[0].trim();
    const col2     = refdata[1].trim();
    const refDateValue = new Date(col2.replace(/\"/g, '').split(`tempo: `)[1]).toJSON().split("T")[0];
    const refValue = parseFloat(col1.replace(/\"/g, '').split(`${objeto}: `)[1]).toFixed(2)
    const date     = col2.replace(/\"/g, '').split(`tempo: `)[1].split(" ")[4].split(":")
    const refDate  = date[0] + ":" + date[1];
    const ref      = Object();

    ref.refValue = refValue;
    ref.refDate = refDate;
    ref.refDateValue = refDateValue;
    return ref;
}

database.ref(`/painel/${id_user}/medicoes_tempo`).on("value", function(data) {
    const container_medicoes_tempo = [
        {"id": "indicador_grafico_demanda", "labels": [], "values": [], "name": "demanda"},
        {"id": "indicador_grafico_fator_de_potencia", "labels": [], "values": [], "name": "fator_de_potencia"},
        {"id": "indicador_grafico_potencia_aparente", "labels": [], "values": [], "name": "potencia_aparente"},
        {"id": "indicador_grafico_potencia_ativa", "labels": [], "values": [], "name": "potencia_ativa"},
        {"id": "indicador_grafico_potencia_reativa", "labels": [], "values": [], "name": "potencia_reativa"},
        {"id": "indicador_grafico_tensao", "labels": [], "values": [], "name": "tensao"},
        {"id": "indicador_grafico_corrente", "labels": [], "values": [], "name": "corrente"}
    ]

    const dados_geral = data.val()
    const objetoData  = Object.keys(data.val())

    objetoData.forEach((objeto) => {
        Object.values(dados_geral[`${objeto}`]).forEach((value) => {
            const ref = tratamentoString(value,objeto);
            container_medicoes_tempo.forEach((medicoes_tempo) => {
               if(medicoes_tempo.name == objeto){
                medicoes_tempo.labels.push(ref.refDate)
                medicoes_tempo.values.push(ref.refValue)
               }
            })
        })
    })

    if(canvas.length > 0){   
        canvas.forEach((data) => data.canva.destroy())
        canvas = [];
    }

    container_medicoes_tempo.forEach((medicoes_tempo) => {
        const container = document.getElementById(medicoes_tempo.id);
        const refCanvas = grafico(container,medicoes_tempo.labels,medicoes_tempo.values);
        canvas.push({"canva": refCanvas, "name": medicoes_tempo.name});
    })
})

// Carregamento estrutura graficos filter
const container_medicoes_tempo_filter = [
    {"id": "filtro_data_demanda", "name": "demanda"},
    {"id": "filtro_data_fator_de_potencia", "name": "fator_de_potencia"},
    {"id": "filtro_data_potencia_aparente", "name": "potencia_aparente"},
    {"id": "filtro_data_potencia_ativa", "name": "potencia_ativa"},
    {"id": "filtro_data_potencia_reativa", "name": "potencia_reativa"},
    {"id": "filtro_data_tensao", "name": "tensao"},
    {"id": "filtro_data_corrente", "name": "corrente"}
] 

container_medicoes_tempo_filter.forEach((medicoes_tempo_filter) => {
    const container = document.getElementsByClassName(medicoes_tempo_filter.id)[0];
    container.addEventListener("change",() => {
        const labels = [];
        const values = [];
        const date = container.children[0].children[1].value;
        if (!!!date) return;

        database.ref(`/painel/${id_user}/medicoes_tempo/${medicoes_tempo_filter.name}`).once("value").then(function(data) {
            const refData = Object.values(data.val()).map((value) => {
                const ref = tratamentoString(value,medicoes_tempo_filter.name);
                return (ref.refDateValue === date) ? ref : false;
            }).filter((ref) => (ref));

            if(refData.length != 0){
                refData.forEach((ref) => {
                    labels.push(ref.refDate);
                    values.push(ref.refValue);
                })
            }

            canvas.forEach((container) => {
                if(container.name == medicoes_tempo_filter.name){
                    container['canva'].config.data.datasets[0].data = values;
                    container['canva'].config.data.labels = labels;
                    container['canva'].update();
                }
            })
        })
    })
})