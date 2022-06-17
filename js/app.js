let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'bebidas',
    2: 'entradas',
    3: 'plato principal',
    4: 'postre'
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //validar si hay campos vacios
    const camposVacios = [mesa, hora].some(campo => campo === '');
    
    if(camposVacios) {
        //existe alerta
        const existeAlerta = document.querySelector('.invalid-feedback');
        if(!existeAlerta){

            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
    
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }

        return;
    } 

    cliente = {...cliente, mesa, hora};

    //ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    mostrarSecciones();

    obtenerPlatillos();
}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => {
        seccion.classList.remove('d-none');
    });
}

function obtenerPlatillos() {
    
    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => mostrarPlatillos(datos))
        .catch(error => console.log(error))
}

function mostrarPlatillos(menu) {
    const contenido = document.querySelector('#platillos .contenido');
    
    menu.forEach(plato => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');
        
        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = plato.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$${plato.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-2');
        categoria.textContent = categorias[plato.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${plato.id}`;
        inputCantidad.classList.add('form-control');

        //funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...plato, cantidad});
        }

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-3');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);

        
    });
}

function agregarPlatillo(producto) {
    
    let { pedido } = cliente;

    if( producto.cantidad > 0 ) {
        //comprueba si el elemento ya existe en el array
        if( pedido.some( articulo => articulo.id === producto.id)) {
            //el articulo ya existe, actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {
                if( articulo.id === producto.id ) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            //se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            //el articulo no existe lo agregamos al array de pedidos
            cliente.pedido = [...pedido, producto];
        }
    } else {
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    limpiarHTML();

    if (cliente.pedido.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    //Info Mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //Info hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //Agregar a elementos padres
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccion
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    //iterar sobre el array de pedidos 
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');
        

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;
        
        //cantidad del articulo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        cantidadEl.appendChild(cantidadValor);
        
        //precio del articulo
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        precioEl.appendChild(precioValor);

        //subtotal de la cuenta
        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        subtotalEl.appendChild(subtotalValor);

        //boton para eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar';

        //funcion para eliminar el articulo
        btnEliminar.onclick = function() {
            eliminarProducto(id);
        }

        //agregar elementos al li
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        //agregar la lista al grupo
        grupo.appendChild(lista);
    });


    //Agregar datos al resumen
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    //agregamos el resumen al contenido
    contenido.appendChild(resumen);

    //mostrar formulario propinas
    formularioPropinas();
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio, cantidad) {
    return `$${precio * cantidad}`;
}

function eliminarProducto(id) {
    const {pedido} = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    limpiarHTML();

    if (cliente.pedido.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    //el producto se elimino regresamos el formulario a 0
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);

    inputEliminado.value = 0;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    //heading formulario
    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';
    
    divFormulario.appendChild(heading);
    
    //Radio btn 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const label10 = document.createElement('label');
    label10.textContent = '10%';
    label10.classList.add('form-check-label');

    const div10 = document.createElement('div');
    div10.classList.add('form-check');

    div10.appendChild(radio10);
    div10.appendChild(label10);

    divFormulario.appendChild(div10);

    
    //Radio btn 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const label25 = document.createElement('label');
    label25.textContent = '25%';
    label25.classList.add('form-check-label');

    const div25 = document.createElement('div');
    div25.classList.add('form-check');

    div25.appendChild(radio25);
    div25.appendChild(label25);

    divFormulario.appendChild(div25);

    
    //Radio btn 50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const label50 = document.createElement('label');
    label50.textContent = '50%';
    label50.classList.add('form-check-label');

    const div50 = document.createElement('div');
    div50.classList.add('form-check');

    div50.appendChild(radio50);
    div50.appendChild(label50);

    divFormulario.appendChild(div50);

    

    //pasamos el formulario al contenido
    formulario.appendChild(divFormulario);
    contenido.appendChild(formulario);
}

function calcularPropina() {
    const {pedido} = cliente;
    let subtotal = 0;

    //calcular el subtotal a pagar
    pedido.forEach(articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    //seleccionar el radio button con la propina del cliente
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
    
    //calcular la propina
    const propina = (subtotal * (parseInt(propinaSeleccionada) / 100));

    //calcular el total a pagar
    const total = subtotal + propina;
    
    mostrarTotalHtml(subtotal, total, propina);
}

function mostrarTotalHtml(subtotal, total, propina) {
    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar');

    //Subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalValor = document.createElement('span');
    subtotalValor.classList.add('fw-normal');
    subtotalValor.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalValor);
    
    //Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total Consumo: ';

    const totalValor = document.createElement('span');
    totalValor.classList.add('fw-normal');
    totalValor.textContent = `$${total}`;

    totalParrafo.appendChild(totalValor);
    
    //Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'Total Propina: ';

    const propinaValor = document.createElement('span');
    propinaValor.classList.add('fw-normal');
    propinaValor.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaValor);

    //Eliminar el ultimo resultado
    const divTotalPagar = document.querySelector('.total-pagar');
    if (divTotalPagar) {
        divTotalPagar.remove();
    }

    //pasamos los totales al div de totales
    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    //pasamos divTotales al formulario
    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}