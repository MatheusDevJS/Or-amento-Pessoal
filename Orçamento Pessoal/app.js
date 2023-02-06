class Despesa {
     constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes= mes 
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')
        
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }


    gravar(d) {    
        let id = this.getProximoId('id')

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }   

    recuperarTodosReistros() {

        let armazenar = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++) {

            let despesa = localStorage.getItem(i)

            var objeto = JSON.parse(despesa);

            if(objeto === null) {
                continue
            }

            objeto.id = i
            armazenar.push(objeto)
        }
            return armazenar
    }   

    pesquisar(despesa) {
        
        let despesasFiltradas = Array()
        
        despesasFiltradas = this.recuperarTodosReistros()
        
        console.log(despesasFiltradas)
        console.log(despesa)

        if(despesa.ano != '') {
            console.log('Filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        } 
        if(despesa.mes != '') {
            console.log('Filtro de Mês')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        } 
        if(despesa.dia != '') {
            console.log('Filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        } 
        if(despesa.tipo != '') {
            console.log('Filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        } 
        if(despesa.descricao != '') {
            console.log('Filtro de descrição')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        } 
        if(despesa.valor != '') {
            console.log('Filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        } 

        return despesasFiltradas
    }

    remover(id) {
            localStorage.removeItem(id)

           document.getElementById('modal_titulo').innerHTML = 'Registro excluído com sucesso!'
    
            document.getElementById('modal_titulo_div').className = 'modal-header text-primary'
    
            document.getElementById('modal_conteudo').innerHTML = 'A despesa foi Excluída com sucesso!'
    
            document.getElementById('modal_btn').className = 'btn btn-primary'
            let btnExcluir = document.getElementById('modal_btn1')
            btnExcluir.className = 'btn btn-danger'
    
            btnExcluir.onclick = function () {
            localStorage.removeItem(id)
            btnExcluir.setAttribute('data-dismiss', 'modal')
            window.location.reload()
            }
    
            document.getElementById('modal_btn').innerHTML = 'Voltar'
    
            $('#deletarItem').modal('show')
            pesquisarDespesa();
    
    }

}

let bd  = new Bd()



function cadastrarDespesas() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

      let despesa = new Despesa (
        ano.value,
        mes.value,
        dia.value,
        tipo.value, 
        descricao.value, 
        valor.value
    )

        if(despesa.validarDados()) { 
            bd.gravar(despesa)
            
            $('#modalregistroDespesa').modal('show')

            ano.value = ''
            mes.value = ''
            dia.value = ''
            tipo.value = ''
            descricao.value = ''
            valor.value = ''

           /* let a = ['ano', 'mes', 'dia', 'tipo', 'descricao', 'valor']
            for(let i in a){
            document.getElementById(a[i]).value = ''
            }*/

            mudarestilo1()
        } else {
            $('#modalregistroDespesa').modal('show')
            mudarestilo2()
        }  
}

function mudarestilo1() {
    document.getElementById('exampleModalLabel').innerHTML = 'Registro inserido com sucesso'
    document.getElementById('moda_titulo_div').className = 'modal-header text-success'
    document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
    document.getElementById('botao').className = 'btn btn-success'
    document.getElementById('botao').innerHTML = 'Voltar'
}

function mudarestilo2() {
    document.getElementById('exampleModalLabel').innerHTML = 'Erro na inclusão do reistro'
    document.getElementById('moda_titulo_div').className = 'modal-header text-danger'
    document.getElementById('modal_conteudo').innerHTML = 'Erro gravação, verifique se todos os campos foram preenchidos corretamente!'
    document.getElementById('botao').className = 'btn btn-danger'
    document.getElementById('botao').innerHTML = 'Voltar e Corrigir'
}

function carregaListaDespesas(armazenar = Array(), filtro = false) {

    if(armazenar.length == 0 && filtro == false) {
        armazenar = bd.recuperarTodosReistros()
    } 

    let listaDespesas = document.getElementById('listaDespesas') 
    listaDespesas.innerHTML = '' 

    armazenar.forEach(function(d) { 
        
        var linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'   
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo =  'Saúde'
                break
            case '5':  d.tipo = 'Transporte'   
                break 
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
      
        var btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
        }

        linha.insertCell(4).append(btn)

        console.log(d)

    })   

}

function pesquisarDespesas() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let armazenar = bd.pesquisar(despesa)

    carregaListaDespesas(armazenar, true)
    

}