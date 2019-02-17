//Este é o código que será responsável por chamar os pedaços de código e injeta-los no index.html.

/*  *Primeiro, deve-se saber que deve ser executado imediatamente ao passo que a página principal começar a ser servida, e chamado sempre que
        um novo pedaço de html for colocado dentro da página. Portanto deverá haver uma função específica para isso, possibilitando a chamada
        imediata e posterior.
    *Internamente, sempre que for chamado, será feita a leitura dos "anchors" a procura da classe "disabled". Caso encontre:
        - o elemento de
 */
import $ from 'jquery'
import tdbInfo from './theMovieDBAPI'

console.log(tdbInfo)
const $menu_items = $('.nav-link').toArray() // anchors de cada item do menu (apenas os que contem, ou seja, exclui o 'hr').

function requisitaPagina(e){
    return new Promise( (resolve, reject)=>{
        
        /* const callbacks = []
        export const chamaCallbacks = (cb) =>{
            if(!callbacks.includes(cb))
                callbacks.push(cb)
        }
        */

        $.ajax({
            method: "GET",
            url: $(e.target).attr('wm-url'),
            success(info){
                console.log('ja chegou o disco voador...')
                const dataToPassOn = { // Objeto que contem tanto a RESPOSTA da requisição, quanto o EVENTO do CLICK, no item do menu.
                    info: info,
                    eventoDeClick: e,
                    getTDBfrontData: tdbInfo 
                }
                console.log(dataToPassOn)
                console.log(dataToPassOn.info)

                resolve(dataToPassOn)
            },
            error(info){
                console.log("DEU BOSTA NA REQUISIÇÃO DA PÁGINA")
                reject(info)
            }
        })

    })
}
function injetaPagina(dataToPassOn){
    console.log("-- CHEGOU NO 'injetaPagina' --")
    console.log(dataToPassOn.info)
    $('main').html(dataToPassOn.info)

    //Chamar a callback herdada

    dataToPassOn.getTDBfrontData()

    return(dataToPassOn)
}
function toggleDisabled(dataToPassOn){
    console.log("-- CHEGOU NO 'toggleDisabled. --")

    $('#navegacao a.disabled').removeClass('disabled')
    $(dataToPassOn.eventoDeClick.target).addClass('disabled')

    console.log("-- CONSEGUIU RESOLVER O 'dataToPassOn' e está passando adiante --")
            
    return(dataToPassOn)
}    

function atribuiClick(){ // Cria o bind do evento de click, para que chame a função de REQUISITAR a página E de INJETA-LA.

    $menu_items.forEach( (elem, i)=>{
        console.log($(elem))
        if( !($(elem).hasClass('disabled')) || $(elem).attr('wm-url') != "#"){
            $(elem).on('click', (e)=>{
                   requisitaPagina(e)
                    .then(injetaPagina)
                    .then(toggleDisabled)
                    .then(atribuiClick)
                    .catch( (problema)=>{
                        console.log('ENTROU NO CATCH')
                        console.log(problema)
                    })
            })
        }
    })
}

//TODO USAR SPLIT DO ELEMENTO WM-LINK PARA EXECUTAR O PLUGIN DO ARQUIVO 'theMovieDBAPI.js' ESPECIALMENTE PARA CADA ARQUIVO, QUANDO CARREGADO NA PÁGINA. ISTO, NA 'callViewModule.js"

atribuiClick()

