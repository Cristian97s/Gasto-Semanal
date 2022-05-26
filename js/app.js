// variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // extrayendo el valor 
        const {presupuesto, restante} = cantidad;

        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // mensaje de error
        divMensaje.textContent = mensaje;

        //insertar en el HTML
        document.querySelector('.primario').insertBefore( divMensaje, formulario);

        // quitar del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML(); //limpiar el html previo
        
        //iterar sobre los gastos
        gastos.forEach( gasto => {
            
            const {nombre, cantidad, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Insertar el gasto
            nuevoGasto.innerHTML = `
                ${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            // boton borrar gasto.
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Insertar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actulizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');
        //comprobar 25%
        if (( presupuesto /4 ) > restante) {
            restanteDiv.classList.remove('alert-sucess', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-sucess');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-sucess');
        }

        // si el total es menor a 0 o menor 
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//instanciar
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto() {
    const presupuestoUsurario = prompt('¿Cual es tu presupuesto?');

    // console.log(Number(presupuestoUsurario));

    if (presupuestoUsurario === '' || presupuestoUsurario === null || isNaN(presupuestoUsurario) || presupuestoUsurario <= 0) {
        window.location.reload();
    }

    // presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsurario);
    //console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//Agregar gastos
function agregarGasto(e) {
    e.preventDefault();

    //leer los gastos de lformulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if (nombre == '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error')

        return;
    }

    //generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()};

    //añadir un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // mensaje de todo bien!
    ui.imprimirAlerta('Gasto agregado correctamente');

    // imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actulizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reiniciar el formulario
    formulario.reset();
    
}

function eliminarGasto(id) {
    //elimina del objeto
    presupuesto.eliminarGasto(id);

    //eliminar los gastos en el html
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actulizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}