/* variável constante */
var candidatoA = 'A';
var candidatoC = 'C';

/* variável auxiliar */
var votosCandidatoA = 0;
var votosCandidatoC = 0;

/* requisição para o biblioteca do google */
google.load("visualization", "1", { packages: ["corechart"] });
google.setOnLoadCallback(processarPopulacao);
google.setOnLoadCallback(processarAmostra);

/* função para realizar o processamento dos dados de populacao */
function processarPopulacao() {
    var consultaString = encodeURIComponent('SELECT A, B, C');
    var magica = '/gviz/tq?gid=0&headers=1&tq=';
    var url = 'https://docs.google.com/spreadsheets/d/1unuhxkhDg2qTQnhTcYmC2GkEIPM18ai8PGtSsI44Bd8';
    var query = new google.visualization.Query(url + magica + consultaString);
    query.send(consumirDadosPopulacao);
}

/* função para realizar o processamento dos dados de amostra */
function processarAmostra() {
    var consultaString = encodeURIComponent('SELECT A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AA, AB, AC, AD, AE, AG');
    var magica = '/gviz/tq?gid=0&headers=1&tq=';
    var url = 'https://docs.google.com/spreadsheets/d/1UUPbVQ6p8gOFRMznBhsxJXEUW-Axx8C2LnLKWutcL6Y';
    var query = new google.visualization.Query(url + magica + consultaString);
    query.send(consumirDadosAmostra);
}

/* função para consumir os dados de populacao */
function consumirDadosPopulacao(resposta) {
    if (resposta.isError()) {
        alert('Erro: ' + resposta.getMessage() + ' ' + resposta.getDetailedMessage());
        return;
    }
    var dados = resposta.getDataTable();
    dados.Nf.filter(function(valores) {
        proporcaoDeVotos(valores.c[2].v);
    });
    graficoProporcaoVotos();
    console.log("Total de votos para o candidato A: " + votosCandidatoA);
    console.log("Total de votos para o candidato C: " + votosCandidatoC);
}

/* função para consumir os dados de populacao */
function consumirDadosAmostra(resposta) {}

/* função para calcular a quantidade de votos para cada candidato */
function proporcaoDeVotos(voto) {
    if (voto == candidatoA) {
        votosCandidatoA++;
    } else {
        votosCandidatoC++;
    }
}

/* função para desenhar o gráfico de proporção de votos */
function graficoProporcaoVotos() {
    var data = [{
        values: [votosCandidatoA, votosCandidatoC],
        labels: ['candidato A', 'candidato C'],
        type: 'pie'
    }];

    Plotly.newPlot('piechart', data);
}