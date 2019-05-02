import React, { Component } from 'react';
import Buscador from './componentes/Buscador';
import Resultado from './componentes/Resultado';
import './App.css';

class App extends Component {

  state = {
    termino: '',
    imagenes: [],
    pagina: 1,
    cargando: false,
    totalPaginas: ''


  }

  datosBusqueda = (termino) => {
    this.setState({
      termino: termino,
      pagina : 1

    // con la , despues del } creamos un callback que llama una función despues de actualizar el state  
    }, () => {
      this.consultarAPI();

    })


  }


  paginaAnterior = () => {

    let pagina = this.state.pagina;

    if(pagina === 1) return null;

    pagina --;

    this.setState({
      pagina
    }, () =>{
      this.consultarAPI();
      this.scroll();
    })

  }

  paginaSiguiente = () => {

    let pagina = this.state.pagina;
    const {totalPaginas} = this.state.totalPaginas;

    if(pagina === totalPaginas) return null;

    pagina +=1;
    console.log(pagina);

    this.setState({
      pagina
    }, () =>{
      this.consultarAPI();
      this.scroll();
    })

  }


  scroll = () => {

    const elemento = document.querySelector('.jumbotron');
    elemento.scrollIntoView('smooth','start');

    
  }


  consultarAPI = async () => {

    const termino = this.state.termino;
    const pagina = this.state.pagina;

    const url= `https://pixabay.com/api/?key=xxx-xxxx=${termino}&per_page=30&page=${pagina}`;
    
    console.log(url);

    await fetch(url)
      .then(respuesta => {
        this.setState({
            cargando: true
        });
        return respuesta.json()
      
      
      })


      .then(resultado => {

        const totalPaginacion = Math.ceil(resultado.totalHits / 30);
        

        setTimeout(() => {
 
          this.setState({
            imagenes: resultado.hits,
            cargando: false,
            totalPaginas : totalPaginacion
          
          })

        },2000)

      })

      

  }



  render() {

    const cargando = this.state.cargando;
    let resultado;

    if(cargando) {

      resultado =  <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>

    } else {
        resultado =  <Resultado 
                      imagenes = {this.state.imagenes}
                      paginaAnterior={this.paginaAnterior}
                      paginaSiguiente={this.paginaSiguiente}
                      pagina={this.state.pagina}
                      totalPaginas={this.state.totalPaginas}
                    />

    }


    return (
      <div className="app container">
        <div className="jumbotron">
          <p className="lead text-center">Buscador de Imágenes <br /> <small>con Pixabay API</small></p>
          <Buscador 
          datosBusqueda={this.datosBusqueda}
          />
        </div>
        <div className="row justify-content-center">



           {resultado}
        </div>
       

      </div>
    );
  }
}

export default App;
