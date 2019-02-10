import $ from 'jquery'

/* 
    * Estarei utilizando as duas versões da API, porque a versão 3 contém mais métodos disponiveis, porém a 4 utiliza padrões mais modernos,
    com algumas outras funcionalidades, porém no total são bem menos do que a versão anterior.

    *Instruções: 
 1 - 
    -> Se for a versão 4 da API, é necessário requisitar um "REQUEST TOKEN". url: 'baseUrl/auth/request_token'. Se trata de um POST!!!
    Além disso, é necessário adicionar o header " 'Authorization': 'Bearer <<token_leitura>>'",
    além do header padrão " 'Content-Type': 'application/json;charset=utf-8' ".
    no corpo, pode-se passar um parâmetro de chave "redirect_to" e chave "URL" como caminho para redirecionamento para o usuário,
    após a permissão ser concedida.

    -> Se for a versão 3 da API, é necessário fazer um "REQUEST TOKEN" também, porem para a url: 'baseUrl/authentication/token/new'.
    Não são necessários Headers, porém precisa passar uma Query String contendo " 'api_key' : '<<api_key>>' ".

 2- Agora, é necessária fazer uma autenticação do TOKEN, pelo usuário da conta que se quer utilizar dos dados.

    -> Se for versão 4 da API, é necessário ACESSAR a url : 'https://www.themoviedb.org/auth/access?request_token={REQUEST_TOKEN}'.
    obs: se houver passado uma url para redirecionar no body da requisição do REQUEST_TOKEN, é nesse momento que o usuário
    aceitar, em que será redirecionado para a página. caso não tenha colocado nenhuma, ele será redirecionado para '/auth/access/approve'.

    -> Se for a versão 3 da API, é necessário ACESSAR a url: 'https://www.themoviedb.org/authenticate/{REQUEST_TOKEN}'. É possível também,
    passar uma query string do tipo " 'redirect_to': '<<URL>>' " para redireciona-lo diretamente para uma página, após a confirmação. Se 
    não for passada esta informação, o usuário será redirecionado para '/authenticate/allow' e depois chamar uma callback de sucesso padrão.

 3- Nesta parte que apenas as informações que são buscadas e retornadas, são diferentes:
    
    -> Se for a versão 4 da API, busca-se o ACCESS_TOKEN. Para isso, é necessário fazer uma requisição do tipo POST para a 
    url: '{baseURL}/auth/access_token'. É necessário utilizar os HEADERS: " 'Authorization': 'Bearer <<token_leitura>>'" e 
    " 'Content-Type': 'application/json;charset=utf-8' ".
    No Body, deve-se passar : " 'request_token' : '<<REQUEST_TOKEN>>' ".
    Será retornado um objeto contendo várias informações, dentre elas o ACCESS_TOKEN. É aconselhavel a guardar isto como se fosse uma senha.

    -> Se for a versão 3 da API, busca-se o SESSION_ID. Para consegui-lo, é necessário fazer uma requisição do tipo POST, para a
    url : '{BaseUrl}/authentication/session/new', passando como Query String " 'api_key' : '<<API_KEY>>' ".
    No Body, deve-se passar: " 'request_token' : '<<REQUEST_TOKEN>>' ".
    O retorno, conterá uma mensagem de sucesso e o SESSION_ID.
    
*/

// API V4.  Usei uma pequena gambiarra para usar sempre o mesmo request token. Mais a baixo explico o por que.
const baseURLv4 = 'https://api.themoviedb.org/4'
let request_tokenV4 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1NDk3NjcwNzcsInNjb3BlcyI6WyJwZW5kaW5nX3JlcXVlc3RfdG9rZW4iXSwiZXhwIjoxNTQ5NzY3OTc3LCJqdGkiOjExODMzMDksImF1ZCI6IjFhYjljMzgzNWI5MDRmODgwYWY3NTYwODYwODUxNGJhIiwicmVkaXJlY3RfdG8iOm51bGwsInZlcnNpb24iOjF9.GfzqFmMX-sXvwuYTAiG2kCR_fM7_2hAN0iA8jWtNK9U'
const apiReadAccessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWI5YzM4MzViOTA0Zjg4MGFmNzU2MDg2MDg1MTRiYSIsInN1YiI6IjVhY2QwMDU4YzNhMzY4N2U0MDAyZjdjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l47tyNlpbf5FRmu2O8fvzCkDIFmhnHxlSjYAbhvMR0I'
let accessToken_accDetails = {
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1NDk3NjcyNjAsInN1YiI6IjVhY2QwMDU4YzNhMzY4N2U0MDAyZjdjNCIsImp0aSI6IjExODMzMDkiLCJhdWQiOiIxYWI5YzM4MzViOTA0Zjg4MGFmNzU2MDg2MDg1MTRiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCIsImFwaV93cml0ZSJdLCJ2ZXJzaW9uIjoxfQ.im9W9lvKrVb7qXSuRROdH4nvNw1rCJmYWf2SVg6ioWs',
  account_id: '5acd0058c3a3687e4002f7c4'
}

// API V3
const baseURLv3 = 'https://api.themoviedb.org/3'
let request_tokenv3 
const api_key = '1ab9c3835b904f880af75608608514ba'
let session_ID 

//COMUM
let redirect_to //Sempre opcional
let account_id = '5acd0058c3a3687e4002f7c4'

//////// Começando, primeiro com a APIv4... utiizarei metodos diferentes, somente por didática. Primeiro, sem utilizar promisse.

/* Vale a pena dizer que, ainda é necessário validar o request token.
  Isso porque tem uma página que deve ser acessada para aceitar o Token gerado. Há um problema em redirecionar ou em abrir em uma nova janela
  a partir do javascript: A pagina aparece, mas sem que os botões funcionem, principalmente o que deve ser clicado, para aceitar o token.
*/
function getRequestToken(){
  return new Promise( (resolve,reject)=>{
    
    const data = {
      metodo: 'POST',
      url: `${baseURLv4}/auth/request_token`,
      header1key: 'Authorization',
      header1value: `Bearer ${apiReadAccessToken}`,
      header2key: 'Content-type',
      header2value: 'application/json;charset=utf-8',
      body:{}
    }

    const xhr = new XMLHttpRequest()
    
    xhr.open(data.metodo, data.url)
    xhr.setRequestHeader(data.header1key, data.header1value)
    xhr.setRequestHeader(data.header2key, data.header2value)

    xhr.onload = (e)=>{
      console.log("Requisição bem sucedida. O request token foi gerado, e estará no objeto abaixo:\n")
      request_tokenV4 = (JSON.parse(xhr.responseText)).request_token
      console.log(request_tokenV4)
      resolve(request_tokenV4)
    }

    xhr.onerror=(e)=>{
      console.log("Opa, parece que ocorreu algum erro. Abaixo seguem mais detalhes:\n")
      console.log(xhr.responseText)
      console.log(xhr)
      reject(xhr)
    }

    xhr.send(data.body)
  })
}

/* Com esta função irei conseguir tanto o Account_id, quanto o access_token.
      O "account_id" independe de versão, é uma informação muito util para se guardar. */

function getPass(){
  if(request_tokenV4 != null){
    return new Promise( (resolve, reject)=> {
    const data ={
      metodo: 'POST',
      url: `${baseURLv4}/auth/access_token`,
      header1key: 'authorization',
      header1value: `bearer ${apiReadAccessToken}`,
      header2key: 'content-type',
      header2value: 'application/json;charset=utf-8',
      body: {
        request_token: request_tokenV4
      }
    }
    const xhr = new XMLHttpRequest()

    xhr.open(data.metodo, data.url)
    xhr.setRequestHeader(data.header1key, data.header1value)
    xhr.setRequestHeader(data.header2key, data.header2value)

    xhr.onload= (e)=>{
      console.log("A resposta chegou! Segue logo abaixo as informações da Conta e o access_token:\n")
      accessToken_accDetails = JSON.parse(xhr.responseText)
      console.log(accessToken_accDetails)
      account_id = accessToken_accDetails.account_id
      resolve(accessToken_accDetails)
    }

    xhr.onerror= (e)=>{
      console.log("Que pena amigo... algo deu errado! Segue o objeto para procurar saber o que deu errado...\n")
      console.log(xhr)
      reject(xhr)
    }
    
    xhr.send(JSON.stringify(data.body))

    })
  }else{
    console.log('Amigo, para prosseguir é necessário conseguir o request token. Essa primeira parte tem de ser na munheca.')
  }

}

/*Essa função consome a parte de 'Accounts' da API. Especificamente, retorna todas as informações a respeito das listas que tenho criadas
  Isso, a partir do ID da minha conta */
function getLists(){
  return new Promise( (resolve, reject)=>{
    const data = {
      metodo: "GET",
      url: `${baseURLv4}/account/${account_id}/lists`,
      header1key: 'Authorization',
      header1value: `Bearer ${apiReadAccessToken}`,
    }

    const xhr = new XMLHttpRequest()
    xhr.open(data.metodo, data.url)
    xhr.setRequestHeader(data.header1key, data.header1value)

    xhr.onload = (e)=>{
      console.log("Abram alas para minhas listas...\n")
      const listas = JSON.parse(xhr.responseText)
      console.log(listas)
      resolve(listas)
    }

    xhr.onerror = (e)=>{
      console.log("Algo deu errado com a requisição das listas...\n")
      console.log(xhr)
      reject(xhr)
    }

    xhr.send()

  })
}

/* 
Rodei apenas uma vez, para conseguir o request token. Agora preciso validar na mão e continuar a usar esse mesmo token.
Vale dizer que, já guarder o token abaixo numa variavel lá em cima.
A segunda parte, que também faz parte da autenticação, deve ser feita também, apenas uma vez. Porém, as duas alternadas.
*/
/* getRequestToken()
  .catch( (res)=>{
    console.log('ENTROU NO CATCH. ALGO DEU ERRADO:\n')
    console.log(res)
  })

  TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1NDk3NjcwNzcsInNjb3BlcyI6WyJwZW5kaW5nX3JlcXVlc3RfdG9rZW4iXSwiZXhwIjoxNTQ5NzY3OTc3LCJqdGkiOjExODMzMDksImF1ZCI6IjFhYjljMzgzNWI5MDRmODgwYWY3NTYwODYwODUxNGJhIiwicmVkaXJlY3RfdG8iOm51bGwsInZlcnNpb24iOjF9.GfzqFmMX-sXvwuYTAiG2kCR_fM7_2hAN0iA8jWtNK9U

  */ 
/* 

getPass()
  .catch( (res)=>{
    console.log('Algo deu errado!!\n')
    console.log(res)
  })
  */
/* 
getLists()
  .catch( (val)=>{
    console.log("DEU ERRADO... segue o xhr, para debug...\n")
    console.log(val)
  })
 */
