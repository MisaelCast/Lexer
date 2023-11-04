const fs = require('fs');

// Lee el contenido del archivo 'sql.txt' en formato UTF-8.
fs.readFile('sql.txt', 'utf8', (err, data) => {
    // Manejo de errores durante la lectura
    if (err) {
        console.error(err);
        return;
    }

    // Dividir las consultas con punto y coma
    const consultas = data.split(';'); 

    const listaDePalabras = [];

    // Itera sobre cada consulta.
    for (let i = 0; i < consultas.length; i++) {
        const palabras = consultas[i].split(" ");

        // Itera sobre cada palabra en la consulta
        // Itera sobre cada palabra en la consulta
        for (let j = 0; j < palabras.length; j++) {
            let palabra = palabras[j];

            //si la palabra termina en coma
            if (palabra.endsWith(',')) {
                // Elimina la coma al final de la palabra
                palabra = palabra.slice(0, -1);

                // Agrega la palabra a la lista
                listaDePalabras.push(palabra);
                // Agrega una coma en la lista
                listaDePalabras.push(',');

            } else {
                // Si la palabra no termina con una coma agregala
                listaDePalabras.push(palabra);
            }
        }
    }
    // Muestra la lista de palabras en la terminal.
    console.log('Lista de palabras de la consulta:');
    console.log(listaDePalabras);

});
