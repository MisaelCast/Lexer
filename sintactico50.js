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

    //// AQUI LEEREMOS EL SQL ///

    fs.readFile('sql.sql', 'utf8', (err, data) => {
        // Manejo de errores durante la lectura
        if (err) {
            console.error(err);
            return;
        }

        // Dividir las consultas 
        const consultas = data.split('\r');


        /////  Aqui se almacenaran los resultados ///
        const listaDePalabras = [];  //Palabras separadas
        const numerosEncontrados = []; /// Tokenizados

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


        // Limpiar la lista de palabras eliminando caracteres no deseados (Esto es por que se guardan \n no deseados)

        const palabrasLimpias = listaDePalabras
            .map(palabra => palabra.trim()) // Eliminar espacios en blanco al inicio y al final
            .filter(palabra => palabra !== ''); // Eliminar elementos vacíos

        console.log('Lista de palabras limpias:');
        console.log(palabrasLimpias);


        for (let i = 0; i < palabrasLimpias.length; i++) {
            const palabra = palabrasLimpias[i];

            // Busca el número correspondiente en el keywordMap o asigna 1000 si no está presente
            const numeroEncontrado = buscarPalabraEnMapa(keywordMap, palabra) || asignarValor(palabra);
            numerosEncontrados.push(numeroEncontrado);
        }

        // Muestra la consulta tokenizada
        console.log('Consulta Tokenizada:');
        console.log(numerosEncontrados);


        /////////////////////////  Guardar los Tokens en un archivo, serapado por renglones  /////////////////////////

        const nombreArchivoTokens = 'tokensBuenos.txt';

        //reemplaza cada '6' con '6\n' y luego une todos los tokens en una sola cadena separada por espacios.
        const tokensSeparados = numerosEncontrados.map(token => token === '6' ? '6\n' : token).join(' ');

        // Escribir los tokens en un archivo
        fs.writeFile(nombreArchivoTokens, tokensSeparados, 'utf8', (err) => {
            if (err) {
                console.error('Error al escribir el archivo:', err);
                return;
            }
            console.log('Tokens guardados en', nombreArchivoTokens);
        });


    });
});

// Función para asignar un valor de 1000 a palabras no reservadas
function asignarValor(palabra) {
    return '1000';
}


// Función para buscar una palabra en el mapa y obtener su número
function buscarPalabraEnMapa(keywordMap, palabra) {
    for (const numero in keywordMap) {

        // Verifica si el objeto keywordMap tiene la clave actual y si el valor es igual a la palabra buscada
        if (keywordMap.hasOwnProperty(numero) && keywordMap[numero] === palabra) 
        {
            return numero; // Si se encuentra una coincidencia, devuelve el número asociado
        }
    }
    return null; // Devuelve null si la palabra no se encuentra en el mapa
}
