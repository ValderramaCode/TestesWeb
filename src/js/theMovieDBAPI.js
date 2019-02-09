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

// API V4
const baseURLv4 = 'https://api.themoviedb.org/4'
const request_tokenV4 = ''
const headerKey = 'Authorization'
const headerValue = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWI5YzM4MzViOTA0Zjg4MGFmNzU2MDg2MDg1MTRiYSIsInN1YiI6IjVhY2QwMDU4YzNhMzY4N2U0MDAyZjdjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l47tyNlpbf5FRmu2O8fvzCkDIFmhnHxlSjYAbhvMR0I'
const URL_AUTHENTICATIONv4 = `https://www.themoviedb.org/auth/access?request_token=${request_tokenV4}`// URL de redirecionamento, passar no body (se houver).
const URLToGet_accessToken = `${baseURLv4}/auth/access_token` // Lembrar de passar os Headers, além do request_token no body. 
const access_token = ''

// API V3
const baseURLv3 = 'https://api.themoviedb.org/3'
const request_tokenv3 = ''
const api_key = '1ab9c3835b904f880af75608608514ba'
const URL_AUTHENTICATIONv3 = `https://www.themoviedb.org/authenticate/${request_tokenv3}`// URL de redirecionamento, passar como query string, no formato " 'redirect_to': '<<URL>>' ".
const URLtoGet_sessionID = `${baseURLv3}/authentication/session/new`// Lembrar de passar a Query String, além do body com o request_token
const session_ID = ''

//COMUM
const redirect_to = '' //Sempre opcional

/////////////// Começando, primeiro com a APIv4... utiizarei metodos diferentes, somente por didática.
/*
const reqBodyV4 = JSON.stringify({
  redirect_to: 'localhost:9000'
})
*/


const xhr = new XMLHttpRequest()

xhr.withCredentials = true;

xhr.open('POST', `${baseURLv4}/auth/request_token `);
xhr.setRequestHeader(headerKey, headerValue);
xhr.setRequestHeader('content-type', 'application/json;charset=utf-8')

function transferenciaCompleta(e){
  console.log('Transferência Completa. Segue a resposta')
  console.log(xhr.responseText);
}
function transferenciaErro(e){
  console.log("A transferência falhou")
  console.log(xhr);
}

xhr.addEventListener('load', transferenciaCompleta)
xhr.addEventListener('error', transferenciaErro)

xhr.send();





/*
{
    "success": true,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1NDk1ODIzNDQsInN1YiI6IjVhY2QwMDU4YzNhMzY4N2U0MDAyZjdjNCIsImp0aSI6IjExNzk5ODMiLCJhdWQiOiIxYWI5YzM4MzViOTA0Zjg4MGFmNzU2MDg2MDg1MTRiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCIsImFwaV93cml0ZSJdLCJ2ZXJzaW9uIjoxfQ.Uy2vTy1QcP5eHn-_rjVUICSh7YrAo3LiylVX7DOSGMs",
    "status_code": 1,
    "status_message": "Success.",
    "account_id": "5acd0058c3a3687e4002f7c4"
  }



const url_base = 'https://api.themoviedb.org/3'
const headerKey = 'authorization' 
const acessToken = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWI5YzM4MzViOTA0Zjg4MGFmNzU2MDg2MDg1MTRiYSIsInN1YiI6IjVhY2QwMDU4YzNhMzY4N2U0MDAyZjdjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l47tyNlpbf5FRmu2O8fvzCkDIFmhnHxlSjYAbhvMR0I'
const apiKey = '1ab9c3835b904f880af75608608514ba'
// 5b8cc7c3e4cad420fccd248c7df7636ed3c1018b request token atual; eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1NDk1ODIxMTcsInNjb3BlcyI6WyJwZW5kaW5nX3JlcXVlc3RfdG9rZW4iXSwiZXhwIjoxNTQ5NTgzMDE3LCJqdGkiOjExNzk5ODMsImF1ZCI6IjFhYjljMzgzNWI5MDRmODgwYWY3NTYwODYwODUxNGJhIiwicmVkaXJlY3RfdG8iOiJodHRwOlwvXC93d3cudGhlbW92aWVkYi5vcmdcLyIsInZlcnNpb24iOjF9.CovIahcVHpCgbBBdIhOgFq8kZclc3yMf8b8NXDMzLlw session ID

{
    "avatar": {
      "gravatar": {
        "hash": "c4939b9bbffc3ffdc73eef00627bf50e"
      }
    },
    "id": 7852538,
    "iso_639_1": "pt",
    "iso_3166_1": "BR",
    "name": "",
    "include_adult": false,
    "username": "lukote159"
  }



  

{
  "page": 1,
  "results": [
    {
      "description": "Lista de alguns dos meus filmes preferidos. Para teste.",
      "favorite_count": 0,
      "id": 104770,
      "item_count": 4,
      "iso_639_1": "pt",
      "list_type": "movie",
      "name": "Filmes Preferidos",
      "poster_path": null
    }
  ],
  "total_pages": 1,
  "total_results": 1
}


const xhr = new XMLHttpRequest()

xhr.withCredentials = true

xhr.open('get', `${url_base}/account?`)

xhr.setRequestHeader(headerKey, acessToken)

xhr.addEventListener('readystatechange', (e)=>{
        console.log(xhr.responseText);
})

xhr.send()


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var data = "{}";

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://api.themoviedb.org/4/account/1/lists?page=1");
xhr.setRequestHeader("authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYWI5YzM4MzViOTA0Zjg4MGFmNzU2MDg2MDg1MTRiYSIsInN1YiI6IjVhY2QwMDU4YzNhMzY4N2U0MDAyZjdjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l47tyNlpbf5FRmu2O8fvzCkDIFmhnHxlSjYAbhvMR0I");

xhr.send(data);

*/