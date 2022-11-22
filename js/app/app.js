import configFirebase from '../../firebase.json' assert {type: 'json'}
firebase.initializeApp(configFirebase)
export default firebase

// import firebase from "./app.js"
// import { getCookies, setCookies } from "./cookies.js"

// const canvas = Array()

// function grafico(id, labels, values) {
//     const target = document.getElementById(id);
//     const data   = { labels: labels, datasets: [{ data: values, fill: false, borderColor: 'rgb(75, 192, 192)', tension: 0.1 }] }; 
//     const config = { type: 'line', data: data, options: { plugins: { legend: false } }}
//     return new Chart(target,config)
// }

// const id_user = getCookies("SESSION_USER")

// if(!!!id_user) window.location.href = "./index.html"

// const database = firebase.database()

// database.ref(`usuarios/${id_user}`).on("value", function(data) {
//     const child = data.val()
//     if(!!!child || !child.painel){
//         setCookies("SESSION_USER","",-1)
//         window.location.href = "./index.html"
//     }
// });

// const botao_rearme     = document.querySelector("#botao_rearme");
// const disjuntor_armado = document.querySelector("#disjuntor_armado");
// const tensao_presente  = document.querySelector("#tensao_presente");
// const filtro_data      = document.querySelectorAll(".filtro_data");
// var statusBtnRearme  = true;

// database.ref(`/painel/${id_user}/estados`).on("value", function(data) {
//     const dados = data.val()

//     if(dados.botao_rearme) botao_rearme.classList.add("active")    
//     else botao_rearme.classList.remove("active")
     
//     disjuntor_armado.checked = dados.disjuntor_armado
//     tensao_presente.checked = dados.tensao_presente
// });

// botao_rearme.addEventListener("click", function(){
//     if(botao_rearme.classList.value == "active"){
//         botao_rearme.classList.remove("active")
//         statusBtnRearme = false
//     }else{
//         botao_rearme.classList.add("active")
//         statusBtnRearme = true
//     }

//     database.ref(`/painel/${id_user}/estados`).on("value", function(data) {
//         const dados = data.val()
//         dados.botao_rearme = statusBtnRearme
//         database.ref(`/painel/${id_user}/estados`).update(dados)
//     });
// })

// disjuntor_armado.addEventListener("click", function(){
//     database.ref(`/painel/${id_user}/estados`).on("value", function(data) {
//         const dados = data.val()
//         dados.disjuntor_armado = disjuntor_armado.checked
//         database.ref(`/painel/${id_user}/estados`).update(dados)
//     });
// })

// tensao_presente.addEventListener("click", function(){
//     database.ref(`/painel/${id_user}/estados`).on("value", function(data) {
//         const dados = data.val()
//         dados.tensao_presente = tensao_presente.checked
//         database.ref(`/painel/${id_user}/estados`).update(dados)
//     });
// })



// database.ref(`/painel/${id_user}/medicoes_tempo`).on("value", function(data) {
//     const { demanda, fator_de_potencia, potencia_aparente, potencia_ativa, potencia_reativa, tensao } = data.val()

//     function getValuesStatusFilter(filter = "", dados){
//         const labels = Array()
//         const values = Array()

//         Object.values(dados).forEach((value) => {
//             console.log(value)
//             const data  = new Date(value.replace(/\"/g, '').split("tempo: ")[1]).toJSON().split("T")
//             const hora  = data[1].split(".")[0]
//             const valor = parseFloat(value.split(",")[0].split(" ")[1].replace(/^(["'])(.+)\1$/gm, '$2'))
            
//             if(!!!filter){
//                 values.push(valor)
//                 labels.push(hora)
//                 return
//             }
            
//             if(data[0] >= filter.inicio && data[0] <= filter.termino){
//                 values.push(valor)
//                 labels.push(hora)
//             }
//         })

//         return { labels, values }
//     }

//     if(canvas.length > 0){
//         canvas.forEach((canva) => canva.destroy())
//     }

//     const response_grafico_demanda = getValuesStatusFilter(false, demanda)
//     const canva_demanda = grafico("indicador_grafico_demanda",response_grafico_demanda.labels,response_grafico_demanda.values)
//     canvas.push(canva_demanda)

//     const response_grafico_fator_de_potencia = getValuesStatusFilter(false, fator_de_potencia)
//     const canva_fator_de_potencia = grafico("indicador_grafico_fator_de_potencia",response_grafico_fator_de_potencia.labels,response_grafico_fator_de_potencia.values)
//     canvas.push(canva_fator_de_potencia)

//     const response_grafico_potencia_aparente = getValuesStatusFilter(false, potencia_aparente)
//     const canva_potencia_aparente = grafico("indicador_grafico_potencia_aparente",response_grafico_potencia_aparente.labels,response_grafico_potencia_aparente.values)
//     canvas.push(canva_potencia_aparente)

//     const response_grafico_potencia_ativa = getValuesStatusFilter(false, potencia_ativa)
//     const canva_potencia_ativa = grafico("indicador_grafico_potencia_ativa",response_grafico_potencia_ativa.labels,response_grafico_potencia_ativa.values)
//     canvas.push(canva_potencia_ativa)

//     const response_grafico_potencia_reativa = getValuesStatusFilter(false, potencia_reativa)
//     const canva_potencia_reativa = grafico("indicador_grafico_potencia_reativa",response_grafico_potencia_reativa.labels,response_grafico_potencia_reativa.values)
//     canvas.push(canva_potencia_reativa)

//     const response_grafico_tensao = getValuesStatusFilter(false, tensao)
//     const canva_tensao = grafico("indicador_grafico_tensao",response_grafico_tensao.labels,response_grafico_tensao.values)
//     canvas.push(canva_tensao)

//     // filtro_data[0].querySelectorAll(".filtro input").forEach((filtro) => {
//     //     filtro.addEventListener("change",() => {
//     //         const inicio  = filtro_data[0].querySelectorAll(".filtro input")[0].value
//     //         const termino = filtro_data[0].querySelectorAll(".filtro input")[1].value
//     //         if(!!!termino || !!!inicio) return;
//     //         // canva_demanda.destroy()
//     //         const response_grafico_demanda = getValuesStatusFilter({inicio, termino} ,demanda)
//     //         console.log(response_grafico_demanda)
//     //         // grafico("indicador_grafico_demanda",response_grafico_demanda.labels,response_grafico_demanda.values)
//     //         // canva_demanda.config.data.datasets[0].data = response_grafico_demanda.values
//     //         // canva_demanda.config.data.labels = response_grafico_demanda.labels
//     //         // canva_demanda.update()
//     //     })
//     // })

//     // filtro_data[1].querySelectorAll(".filtro input").forEach((filtro) => {
//     //     filtro.addEventListener("change",() => {
//     //         const inicio  = filtro_data[1].querySelectorAll(".filtro input")[0].value
//     //         const termino = filtro_data[1].querySelectorAll(".filtro input")[1].value
//     //         if(!!!termino || !!!inicio) return;
//     //         const response_grafico_fator_de_potencia = getValuesStatusFilter({inicio, termino},fator_de_potencia)
//     //         canva_fator_de_potencia.config.data.datasets[0].data = response_grafico_fator_de_potencia.values
//     //         canva_fator_de_potencia.config.data.labels = response_grafico_fator_de_potencia.labels
//     //         canva_fator_de_potencia.update()
//     //     })
//     // })
    
//     // filtro_data[2].querySelectorAll(".filtro input").forEach((filtro) => {
//     //     filtro.addEventListener("change",() => {
//     //         const inicio  = filtro_data[2].querySelectorAll(".filtro input")[0].value
//     //         const termino = filtro_data[2].querySelectorAll(".filtro input")[1].value
//     //         if(!!!termino || !!!inicio) return;
//     //         const response_grafico_fator_de_potencia = getValuesStatusFilter({inicio, termino},potencia_aparente)
//     //         canva_potencia_aparente.config.data.datasets[0].data = response_grafico_fator_de_potencia.values
//     //         canva_potencia_aparente.config.data.labels = response_grafico_fator_de_potencia.labels
//     //         canva_potencia_aparente.update()
//     //     })
//     // })
     
//     // filtro_data[3].querySelectorAll(".filtro input").forEach((filtro) => {
//     //     filtro.addEventListener("change",() => {
//     //         const inicio  = filtro_data[3].querySelectorAll(".filtro input")[0].value
//     //         const termino = filtro_data[3].querySelectorAll(".filtro input")[1].value
//     //         if(!!!termino || !!!inicio) return;
//     //         const response_grafico_potencia_ativa = getValuesStatusFilter({inicio, termino},potencia_ativa)
//     //         canva_potencia_ativa.config.data.datasets[0].data = response_grafico_potencia_ativa.values
//     //         canva_potencia_ativa.config.data.labels = response_grafico_potencia_ativa.labels
//     //         canva_potencia_ativa.update()
//     //     })
//     // })

    
//     // filtro_data[4].querySelectorAll(".filtro input").forEach((filtro) => {
//     //     filtro.addEventListener("change",() => {
//     //         const inicio  = filtro_data[4].querySelectorAll(".filtro input")[0].value
//     //         const termino = filtro_data[4].querySelectorAll(".filtro input")[1].value
//     //         if(!!!termino || !!!inicio) return;
//     //         const response_grafico_potencia_reativa = getValuesStatusFilter({inicio, termino},potencia_reativa)
//     //         canva_potencia_reativa.config.data.datasets[0].data = response_grafico_potencia_reativa.values
//     //         canva_potencia_reativa.config.data.labels = response_grafico_potencia_reativa.labels
//     //         canva_potencia_reativa.update()
//     //     })
//     // })

//     // filtro_data[5].querySelectorAll(".filtro input").forEach((filtro) => {
//     //     filtro.addEventListener("change",() => {
//     //         const inicio  = filtro_data[5].querySelectorAll(".filtro input")[0].value
//     //         const termino = filtro_data[5].querySelectorAll(".filtro input")[1].value
//     //         if(!!!termino || !!!inicio) return;
//     //         const response_grafico_tensao = getValuesStatusFilter({inicio, termino},tensao)
//     //         canva_tensao.config.data.datasets[0].data = response_grafico_tensao.values
//     //         canva_tensao.config.data.labels = response_grafico_tensao.labels
//     //         canva_tensao.update()
//     //     })
//     // })
// })

// // const btnLogout   = document.querySelector("#btnLogout")

// // btnLogout.addEventListener("click",function(){
// //     setCookies("SESSION_USER","",-1)
// //     window.location.href = "./index.html"
// // })