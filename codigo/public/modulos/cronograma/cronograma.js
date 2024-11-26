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
          })
          .catch (error => {
              alert ('Erro ao obter dados do servidor:' + error.message);
          })
  }

window.onload = () => {
    document.getElementById('btn_salvar').addEventListener('click', criarHorario);  
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

function valorCheckbox() {
    let checkboxes = document.getElementsByName('checkSem');
    const checkValues = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            checkValues.push(checkboxes[i].value);
        }
    }
    return checkValues;
}

function montarHorario(tarefa, diasCheck, horasInicio, minutosInicio, horasFim, minutosFim) {
    let novoHorario;
    fetch(`/cronograma?id=${usuarioCorrente.id}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache', // Impede o cache
        }
    })
      .then (response => response.json())
      .then (data => {
        let idsAnt = data.flatMap(item => item.tarefas.ids)
        if (idsAnt.includes(tarefa)) {
            return;
        }
        idsAnt.push(parseInt(tarefa))
        alert(idsAnt);
        let horariosInicio = data.flatMap(item => item.tarefas.horarios.inicio)
        let inicio = {
            hr: parseInt(horasInicio),
            min: parseInt(minutosInicio)
        }
        horariosInicio.push(inicio)
        let horariosFim = data.flatMap(item => item.tarefas.horarios.fim)
        let fim = {
            hr: parseInt(horasFim),
            min: parseInt(minutosFim)
        }
        horariosFim.push(fim)
        let diasDaSemana = data.flatMap(item => item.tarefas.horarios.diasSemana)
        diasCheck = diasCheck.map(Number);
        let novosDias = {
            dias: diasCheck
        }
        diasDaSemana.push(novosDias);
        novoHorario = {
            ids: idsAnt,
            horarios:{
                inicio: horariosInicio,
                fim: horariosFim,
                diasSemana: diasDaSemana
            }
        }
        alert(JSON.stringify(novoHorario));
      })
      .catch (error => {
          alert ('Erro ao obter dados do servidor 2:' + error.message);
        })
    return novoHorario;
}

function inserirHorario(novoHorario) {
    fetch(`/cronograma?id=${usuarioCorrente.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(novoHorario),
    })
        .then(response => response.json())
        .then(data => {
                alert("Novo horário inserido com sucesso.");
                execucao(); 
        })
        .catch(error => {
            console.error('Erro ao atualizar cronograma via API JSONServer:', error);
            alert("Erro ao atualizar cronograma");
        });
}

function criarHorario() {
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
            let tarefa = document.getElementById('tasks').value;
            let horarioInicio = document.getElementById('horarioInicio').value;
            let horarioFim = document.getElementById('horarioFim').value;
            let diasCheck = valorCheckbox();
            let horas = horarioInicio.split(":");
            let horasInicio = horas[0];
            let minutosInicio = horas[1];
            horas = horarioFim.split(":");
            let horasFim = horas[0];
            let minutosFim = horas[1];
            let novoHorario = montarHorario(tarefa, diasCheck, horasInicio, minutosInicio, horasFim, minutosFim);
            inserirHorario(data, novoHorario);
          })
          .catch (error => {
              alert ('Erro ao obter dados do servidor 3:' + error.message);
          })
    }

function carregarTarefa(data, dataTasks, i) {
    let dias = Array.from(data.map(item => item.tarefas.horarios.diasSemana[i].dias));
    //let horarios = Array.from(data.map(item => item.tarefas.horarios.inicio[i].hr + ":" + item.tarefas.horarios.inicio[i].min + " - "
    //   + item.tarefas.horarios.fim[i].hr + ":" + item.tarefas.horarios.fim[i].min));
    let horarios = Array.from(data.map(item => item.tarefas.horarios.inicio[i].hr + ":" + String(item.tarefas.horarios.inicio[i].min).padStart(2, '0') + " - "
       + item.tarefas.horarios.fim[i].hr + ":" + String(item.tarefas.horarios.fim[i].min).padStart(2, '0')));
    let nomes = Array.from(data.map(item => dataTasks.find(task => task.id === item.tarefas.ids[i])?.nomeTarefa));
      
    
    // tarefaHTML.className = "col";
    for(let i = 0; i < dias.length; i++) {
        dias[i].forEach(dia => {
            let tarefaHTML = document.createElement("div");
            let tarefaInfo = `${horarios[i]}\n${nomes[i]}`;
            tarefaHTML.innerHTML = `${tarefaInfo}`;
            document.getElementById(dia).appendChild(tarefaHTML);
        })
    }
    

}