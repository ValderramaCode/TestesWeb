//Este é o código que será responsável por chamar os pedaços de código e injeta-los no index.html.

/*  *Primeiro, deve-se saber que deve ser executado imediatamente ao passo que a página principal começar a ser servida, e chamado sempre que
        um novo pedaço de html for colocado dentro da página. Portanto deverá haver uma função específica para isso, possibilitando a chamada
        imediata e posterior.
    *Internamente, sempre que for chamado, será feita a leitura dos "anchors" a procura da classe "disabled". Caso encontre:
        - o elemento de
 */
import $ from 'jquery'

const $menu_items = $('.nav-link').toArray() // anchors de cada item do menu (apenas os que contem, ou seja, exclui o 'hr').


function toggleDisabled(evento){
    $('#navegacao a.disabled').removeClass('disabled')
    $(evento.target).addClass('disabled')
} 

function requisitaPagina_toggleDisable(e) {
    toggleDisabled(e)

    return new Promise( (resolve, reject)=>{
        const data = {
            metodo: "GET",
            url: $(e.target).attr('wm-url'), 
        }
        
        $.ajax({
            method: data.metodo,
            url: data.url,
            success(info){
                console.log('ja chegou o disco voador...')
                console.log(info)
                
                atribuiClick() //Necessário fazer isso sempre que um novo bloco HTML for recebido, depois do 'toggleDisabled'
                
                resolve(info,e)
            }
        })
    })
}

function injetaPagina(paginaHtml_formato_string){
    console.log('vai injetar a pagina abaixo...\n')
    console.log(paginaHtml_formato_string)
    $('main').html(paginaHtml_formato_string)
}

function atribuiClick(){ // Cria o bind do evento de click, para que chame a função de REQUISITAR a página E de INJETA-LA.
    $menu_items.forEach( (elem, i)=>{
        if( !($(elem).hasClass('disabled')) ){
            $(elem).on('click', (e)=>{
                requisitaPagina_toggleDisable(e)
                    .then(injetaPagina)
                    .catch( (response)=>{
                        console.log('ENTROU NO CATCH')
                    })
            })
        }
    })
    console.log($menu_items)
}

//TODO USAR SPLIT DO ELEMENTO WM-LINK PARA EXECUTAR O PLUGIN DO ARQUIVO 'theMovieDBAPI.js' ESPECIALMENTE PARA CADA ARQUIVO, QUANDO CARREGADO NA PÁGINA. ISTO, NA 'callViewModule.js"

atribuiClick()

