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
    return new Promise( (resolve)=>{
        console.log("-- CHEGOU NO 'injetaPagina' --")
        console.log(dataToPassOn.info)
        $('main').html(dataToPassOn.info)

        //Chamar a callback herdada
       
       switch($(dataToPassOn.eventoDeClick.target).attr('wm-url')){   
        case "theMovieDB.html": 
            dataToPassOn.getTDBfrontData() // A promise irá mandar ao Resolve o array que contem os objetos com os dados que precisarei de cada filme da lista customizada. Esta Promise vem de outro objeto.
            .then( (listaCustomizada)=>{    
                console.log("------ EXECUTOU A PROMISE IMPORTADA ------")
                console.log(listaCustomizada)

                listaCustomizada.forEach( (elem)=>{
                    const img = $('<img src="" alt="" class="img-fluid">')
                    img.attr('src', elem.image_url)
                    img.attr('alt',`${elem.name}-Poster`)

                    const cardTitle = $('<div class="card-title">Comentário</div>')
                    const cardText = $('<div class="card-text"></div>')
                    cardText.append(elem.comment)
                    


                    const cardBody = $('<div class="card-body"></div>')
                    cardBody.append(cardTitle)
                    cardBody.append(cardText)



                    const cardBody_col = $('<div class="col-12 col-md-8 col-lg-3"></div>')
                    cardBody_col.append(cardBody)
                    

                    const cardPoster_col = $('<div class="col-12 col-md-8 col-lg-3"></div>')
                    cardPoster_col.append(img)
                    


                    const cardRow = $('<div class="row no-gutters"></div>')
                    cardRow.append(cardPoster_col)
                    cardRow.append(cardBody_col)
                    
                    const cardHeader = $('<div class="card-header"></div>')
                    cardHeader.append(elem.name)
                    

                    const card_wrapper = $('<div class="card shadow-lg m-3 mb-5 text-white bg-dark rounded"></div>')
                    card_wrapper.append(cardHeader)
                    card_wrapper.append(cardRow)

                    $('main').append(card_wrapper)

                })

                })
            .then( ()=>{
                resolve(dataToPassOn)
                })
            .catch( (erro)=>{
                console.log(erro)
            }) 
            

        default: resolve(dataToPassOn)
    }
        
        
    })   
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

