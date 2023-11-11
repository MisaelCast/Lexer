const fs = require('fs');

// Lee el archivo 'sqlkeywords.txt' para obtener el keywordMap
fs.readFile('sqlkeywords.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const keywordMap = {};

    // Divide el contenido del archivo en líneas
    const keywords = data.split('\n');

    // Procesa las palabras clave SQL desde el archivo
    keywords.forEach((keyword) => {
        const parts = keyword.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts[1].trim().replace(/"/g, ''); // Elimina comillas dobles
            keywordMap[key] = value;
        }
    });

    // Luego, puedes continuar con la lectura del archivo 'sql.txt' y la búsqueda de palabras.
    fs.readFile('sql.txt', 'utf8', (err, data) => {
        // Manejo de errores durante la lectura
        if (err) {
            console.error(err);
            return;
        }

        // Dividir las consultas
        const consultas = data.split('\n');

        const listaDePalabras = [];
        const numerosEncontrados = []; // Lista para almacenar los números encontrados

        for (let i = 0; i < consultas.length; i++) {
            const palabras = consultas[i].split(" ");

            // Itera sobre cada palabra en la consulta
            for (let j = 0; j < palabras.length; j++) {
                let palabra = palabras[j];

                if (palabra.endsWith(',')) {
                    // Elimina la coma al final de la palabra
                    palabra = palabra.slice(0, -1);

                    // Agrega la palabra a la lista
                    listaDePalabras.push(palabra);
                    // Agrega una coma en la lista
                    listaDePalabras.push(',');

                } else if (palabra.endsWith(';')) {
                    palabra = palabra.slice(0, -1);

                    // Agrega la palabra a la lista
                    listaDePalabras.push(palabra);
                    // Agrega un punto y coma en la lista
                    listaDePalabras.push(';');
                } else {
                    // Si la palabra no termina con una coma o punto y coma, agrégala tal como está
                    listaDePalabras.push(palabra);
                }
            }
        }

        // Muestra la lista de palabras en la terminal.
        console.log('Lista de palabras de la consulta:');
        console.log(listaDePalabras);

        for (let i = 0; i < listaDePalabras.length; i++) {
            const palabra = listaDePalabras[i];
            // Busca el número correspondiente en el keywordMap o asigna 1000 si no está presente
            const numeroEncontrado = buscarPalabraEnMapa(keywordMap, palabra) || asignarValor(palabra);

            numerosEncontrados.push(numeroEncontrado);
        }

        // Muestra la consulta tokenizada
        console.log('Consulta Tokenizada:');
        console.log(numerosEncontrados);

        // Verifica si la lista comienza con un "655" (SELECT) y llama a la función SELECT
        if (numerosEncontrados.length > 0 && numerosEncontrados[0] === '655') {
            const erroresSelect = SELECT(numerosEncontrados);
            
            // Mostrar errores específicos de SELECT
            if (erroresSelect.length > 0) {
                console.log('Errores en la consulta SELECT:');
                console.log(erroresSelect);
                // Termina la ejecución del programa si hay errores
                process.exit(1);
            } else {
                console.log('La consulta SELECT es válida.');
            }
        } else {
            console.log('La consulta no comienza con un "SELECT".');
        }

        // Realizar validaciones en la consulta SQL
        const errores = SELECT(numerosEncontrados);

        // Mostrar errores
        if (errores.length > 0) {
            console.log('Errores en la consulta:');
            console.log(errores);
            // Termina la ejecución del programa si hay errores
            process.exit(1);
        } else {
            console.log('La consulta es válida.');
        }
    });
});

// Función para asignar un valor de 1000 a palabras no reservadas
function asignarValor(palabra) {
    return '1000';
}

// Función para validar la consulta SQL
function SELECT(numerosEncontrados) {
    const errores = [];

    for (let i = 0; i < numerosEncontrados.length; i++) {
        const numero = numerosEncontrados[i];
        const siguienteNumero = numerosEncontrados[i + 1];

        if (numero === '655' && (siguienteNumero !== '1000' && siguienteNumero !== '7')) {
            errores.push('Error: Después de un "SELECT" debe seguir un "1000" o un "7".');
        }
    }

    return errores;
}

// Función para buscar una palabra en el mapa y obtener su número
function buscarPalabraEnMapa(keywordMap, palabra) {
    for (const numero in keywordMap) {
        // Verifica si el objeto keywordMap tiene la propiedad (clave) actual y si el valor es igual a la palabra buscada
        if (keywordMap.hasOwnProperty(numero) && keywordMap[numero] === palabra) {
            return numero; // Si se encuentra una coincidencia, devuelve el número asociado
        }
    }
    return null; // Devuelve null si la palabra no se encuentra en el mapa
}
