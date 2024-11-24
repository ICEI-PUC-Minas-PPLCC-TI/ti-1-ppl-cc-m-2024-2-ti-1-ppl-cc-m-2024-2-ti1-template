var usuarioCorrente = {};

function execucao() {
    usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }
        fetch(`/cronograma?id=${usuarioCorrente.id}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache', // Impede o cache
            }
        })
          .then (response => response.json())
          .then (data => {
              carregarCronograma(data);
              
              // createPieChart(data);
          })
          .catch (error => {
              alert ('Erro ao obter dados do servidor:' + error.message);
          })
  }

window.onload = () => {
    execucao();
    /* fetch (`/cronograma?id=${usuarioCorrente.id}`)
    .then (response => response.json())
    .then (data => {

    })
    .catch (error => {
      alert ('Erro ao obter dados do servidor:' + error.message);
    }) */
  }

function carregarCronograma(data) {
    const ids_array = Array.from(data.map(item => item.tarefas.ids))
    
    fetch(`/tarefas?id_usuario=${usuarioCorrente.id}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
        }
    })
    .then(response => response.json())
    .then(dataTasks => {
        tarefaModal(dataTasks);
        for (let i = 0; i <= ids_array.length; i++) {
            carregarTarefa(data, dataTasks, i);
        }
    })
    .catch(error => {
        alert('Erro ao obter dados do servidor: ' + error.message);
    });
}

function tarefaModal(dataTasks) {
    let tarefas = Array.from(dataTasks.map(item => item.nomeTarefa));
    let ids = Array.from(dataTasks.map(item => item.id));
    for(let i = 0; i < tarefas.length; i++) {
        let novaOpcao = document.createElement("option");
        novaOpcao.value = ids[i];
        novaOpcao.innerHTML = tarefas[i];
        document.getElementById("tasks").appendChild(novaOpcao);
    }

}

function criarHorario(dataTasks) {

}

function carregarTarefa(data, dataTasks, i) {
    let horarios = Array.from(data.map(item => item.tarefas.horarios.inicio[i].hr + ":" + item.tarefas.horarios.inicio[i].min + " - "
        + item.tarefas.horarios.fim[i].hr + ":" + item.tarefas.horarios.fim[i].min));
    let dias = Array.from(data.map(item => item.tarefas.horarios.diasSemana[i].dias));
    // alert(dias);
    
    // tarefaHTML.className = "col";
    
    for(let i = 0; i < dias.length; i++) {

        dias[i].forEach(dia => {
            let tarefaHTML = document.createElement("div");
            tarefaHTML.innerHTML = `${horarios.join(', ')}`;
            document.getElementById(dia).appendChild(tarefaHTML);
        })
    }
    

}