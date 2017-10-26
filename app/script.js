/* variável constante */
var candidatoA = 'A';
var candidatoC = 'C';

/* variável auxiliar */
var votos = [];
var votosCandidatoA = 0;
var votosCandidatoC = 0;
var totalDeVotos = 0;
var mediavotosCandidatoA = 0;
var mediavotosCandidatoC = 0;
var desvioPadraoCandidatoA = 0;
var desvioPadraoCandidatoC = 0;

/* representação de um voto */
function Voto(idade, candidato) {
    this.idade = idade;
    this.candidato = candidato;
}

/* requisição para o biblioteca do google */
google.load("visualization", "1", {
    packages: ["corechart"]
});
google.setOnLoadCallback(processarPopulacao);
google.setOnLoadCallback(processarAmostra);

/* função para realizar o processamento dos dados de populacao */
function processarPopulacao() {
    let consultaString = encodeURIComponent('SELECT A, B, C');
    let magica = '/gviz/tq?gid=0&headers=1&tq=';
    let url = 'https://docs.google.com/spreadsheets/d/1unuhxkhDg2qTQnhTcYmC2GkEIPM18ai8PGtSsI44Bd8';
    let query = new google.visualization.Query(url + magica + consultaString);
    query.send(consumirDadosPopulacao);
}

/* função para realizar o processamento dos dados de amostra */
function processarAmostra() {
    let consultaString = encodeURIComponent('SELECT A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AA, AB, AC, AD, AE, AG');
    let magica = '/gviz/tq?gid=0&headers=1&tq=';
    let url = 'https://docs.google.com/spreadsheets/d/1UUPbVQ6p8gOFRMznBhsxJXEUW-Axx8C2LnLKWutcL6Y';
    let query = new google.visualization.Query(url + magica + consultaString);
    query.send(consumirDadosAmostra);
}

/* função para consumir os dados de populacao */
function consumirDadosPopulacao(resposta) {
    if (resposta.isError()) {
        alert('Erro: ' + resposta.getMessage() + ' ' + resposta.getDetailedMessage());
        return;
    }
    let dados = resposta.getDataTable();
    dados.Nf.filter(function(valores) {
        var voto = new Voto(valores.c[1].v, valores.c[2].v);
        votos.push(voto);
    });
    proporcaoDeVotos();
    graficoProporcaoVotos();
    totalVotos();
    mediaVotosCandidatoA();
    mediaVotosCandidatoC();
}

/* função para consumir os dados de populacao */
function consumirDadosAmostra(resposta) {}

/* função para calcular a quantidade de votos para cada candidato */
function proporcaoDeVotos() {
    votos.filter(function(voto) {
        if (voto.candidato == candidatoA) {
            votosCandidatoA++;
        } else if (voto.candidato == candidatoC) {
            votosCandidatoC++;
        }
    });
}

/* função para desenhar o gráfico de proporção de votos */
function graficoProporcaoVotos() {
    let data = [{
        values: [votosCandidatoA, votosCandidatoC],
        labels: ['candidato A', 'candidato C'],
        type: 'pie'
    }];
    Plotly.newPlot('piechart', data);
}

/* função para calcular o total de voto */
function totalVotos() {
    totalDeVotos = votosCandidatoA + votosCandidatoC;
    document.getElementById("totalVotos").innerHTML = "Quantidade de votos (N): " + totalDeVotos;
}

/* função para realizar a media de votos para o candidato A, levando em consideração idade */
function mediaVotosCandidatoA() {
    //TODO: refatorar!
    var mapa = new Map();
    votos.filter(function(voto) {
        if (mapa.get(voto.idade) !== undefined && voto.candidato == candidatoA) {
            var quantidade = mapa.get(voto.idade);
            mapa.set(voto.idade, quantidade + 1);
        } else if (mapa.get(voto.idade) == undefined && voto.candidato == candidatoA) {
            mapa.set(voto.idade, 1);
        }
    });

    /* realizando o calulo da media */
    for (var [idade, quantidade] of mapa) {
        mediavotosCandidatoA += (idade * quantidade);
    }
    mediavotosCandidatoA = mediavotosCandidatoA / totalDeVotos;
    document.getElementById("mediavotosCandidatoA").innerHTML = "Média de votos da idade para o candidato A: " + mediavotosCandidatoA;

    /* realizando o calulo do desvio parão */
    let auxiliar = 0;
    for (var [idade, quantidade] of mapa) {
        auxiliar += (((idade - mediavotosCandidatoA) * 2) * quantidade) / (totalDeVotos - 1);
    }
    desvioPadraoCandidatoA = (Math.sqrt(auxiliar) / mediavotosCandidatoA);
    document.getElementById("desvioPadraoCandidatoA").innerHTML =
        "Desvio-padrão Candidato A: " + desvioPadraoCandidatoA + ", em porcentagem: " +
        Math.round(desvioPadraoCandidatoA * 100) + "%";
}

/* função para realizar a media de votos para o candidato C, levando em consideração idade */
function mediaVotosCandidatoC() {
    var mapa = new Map();
    votos.filter(function(voto) {
        if (mapa.get(voto.idade) !== undefined && voto.candidato == candidatoC) {
            var quantidade = mapa.get(voto.idade);
            mapa.set(voto.idade, quantidade + 1);
        } else if (mapa.get(voto.idade) == undefined && voto.candidato == candidatoC) {
            mapa.set(voto.idade, 1);
        }
    });

    /* realizando o calulo da media */
    for (var [idade, quantidade] of mapa) {
        mediavotosCandidatoC += (idade * quantidade);
    }
    mediavotosCandidatoC = mediavotosCandidatoC / totalDeVotos;
    document.getElementById("mediavotosCandidatoC").innerHTML = "Média de votos da idade para o candidato C: " + mediavotosCandidatoC;

    /* realizando o calulo do desvio parão */
    let auxiliar = 0;
    for (var [idade, quantidade] of mapa) {
        auxiliar += (((idade - mediavotosCandidatoC) * 2) * quantidade) / (totalDeVotos - 1);
    }
    desvioPadraoCandidatoC = (Math.sqrt(auxiliar) / mediavotosCandidatoC);
    document.getElementById("desvioPadraoCandidatoC").innerHTML =
        "Desvio-padrão Candidato C: " + desvioPadraoCandidatoC + ", em porcentagem: " +
        Math.round(desvioPadraoCandidatoC * 100) + "%";
}
