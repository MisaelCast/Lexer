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

    // Ahora tienes el keywordMap cargado desde el archivo sin comillas dobles
    console.log('Keyword Map cargado desde el archivo:');
    console.log(keywordMap);

    // Luego, puedes continuar con la lectura del archivo 'sql.txt' y la búsqueda de palabras.
    fs.readFile('sql.txt', 'utf8', (err, data) => {
        // Manejo de errores durante la lectura
        if (err) {
            console.error(err);
            return;
        }
    
        // Dividir las consultas con punto y coma
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
                    
                // Busca el número correspondiente en el keywordMap
                const numeroEncontrado = buscarPalabraEnMapa(keywordMap, palabra);
                if (numeroEncontrado !== null) {
                    numerosEncontrados.push(numeroEncontrado);
                }else{
                    numerosEncontrados.push(palabra);
                }
            }
        }
        // Muestra la lista de palabras en la terminal.
        console.log('Lista de palabras de la consulta:');
        console.log(listaDePalabras);
    
        // Muestra los números encontrados
        console.log('Consulta Tokenizada:');
        console.log(numerosEncontrados);
    });
});

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
