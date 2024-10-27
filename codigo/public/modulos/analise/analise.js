        // ------------------------------------------------
        // Define a estrutura de dados a ser utilizada na aplicação e obtida
        // através de uma requisição ao servidor JSONServer
        // ------------------------------------------------
        // const lancamentos = [
        //     { "mes": "jan-24", "categoria": "Alimentação", "valor": 500.00 },
        //     { "mes": "jan-24", "categoria": "Transporte", "valor": 200.00 },
        //     { "mes": "jan-24", "categoria": "Lazer", "valor": 300.00 },
        //     { "mes": "fev-24", "categoria": "Alimentação", "valor": 450.00 },
        //     { "mes": "fev-24", "categoria": "Transporte", "valor": 180.00 },
        //     { "mes": "fev-24", "categoria": "Lazer", "valor": 350.00 },
        //     { "mes": "mar-24", "categoria": "Alimentação", "valor": 600.00 },
        //     { "mes": "mar-24", "categoria": "Transporte", "valor": 250.00 },
        //     { "mes": "mar-24", "categoria": "Lazer", "valor": 400.00 }
        // ];
    
        // ------------------------------------------------
        // Aguarda o carregamento da página para montar o gráfico
        window.onload = () => {
            fetch ('/tarefas')
                .then (response => response.json())
                .then (data => {
                    createBarChart(data);
                    calcConclusao(data);
                    // createPieChart(data);
                })
                .catch (error => {
                    alert ('Erro ao obter dados do servidor:' + error.message);
                })
        }

        function createBarChart(data) {
            // ------------------------------------------------
            // Agrupa os dados por mês e categoria para serem utilizados no gráfico
            const diaSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"];
            // const dataConclusao = new Date(data.dataConclusao).getDay;
            // const dias = Array.from(new Set(data.map(item => item.dataConclusao.getDay)));
            const dias = Array.from(new Set(data.map(item => item.diaConclusao)));
            const categorias = Array.from(new Set(data.map(item => item.categoria)));
        
            const dadosPorDia = dias.map(diaConclusao => {
              const valoresPorCategoria = categorias.map(categoria => {
                const valor = data.filter(item => item.diaConclusao === diaConclusao && item.categoria === categoria)
                                   .reduce((acc, curr) => acc + curr.concluido, 0);
                return valor;
              });
              return {
                diaConclusao: dias,
                valores: valoresPorCategoria
              };
            });
        
            // ------------------------------------------------
            // Monta o gráfico utilizando a API do ChartJS

            const cores = [
                'rgba(255, 99, 132)',
                'rgba(54, 162, 235)',
                'rgba(255, 206, 86)',
              ]
            /*  
                'rgba(75, 192, 192)',
                'rgba(153, 102, 255)',
                'rgba(255, 159, 64)'
                ];
            */            
            const ctx = document.getElementById('divBarChart');
            const divBarChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: dias,
                datasets: categorias.map((categoria, index) => {
                    return {
                        label: categoria,
                        data: dadosPorDia.map(item => item.valores[index]),
                        backgroundColor: cores[index],
                        borderColor: cores[index],
                        borderWidth: 4
                    };
                })
              },
              options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            stacked: true
                        },
                        x: {
                            stacked: true
                        }
                    }
              }
            });
        }

        function calcConclusao(data) {
          let tarefasConcluidas = 0;
          for(let i = 0; i < data.length; i++) {
              if(data[i].concluido === 1) {
                  tarefasConcluidas++;
              }
          }
          let porcentagem = (tarefasConcluidas/(data.length)) * 100;
          const barra = document.getElementById("barraProgresso");
          barra.setAttribute("aria-valuenow", porcentagem);
          barra.style.width = porcentagem + "%"; 
          const fracao = document.getElementById("fracaoProgresso");
          fracao.innerHTML = tarefasConcluidas + "/" + data.length;
      }