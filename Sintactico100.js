const fs = require('fs');

let tokens = [];

fs.readFile('tokensBuenos.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    tokens = data.split(' ')
                 .map(token => parseInt(token));

    if (tokens[0] === 655) {
        validaSelect();
    } else {
        console.log("Error de inicio de token " + tokens[0]);
        return;
    }
});

const reglas = {
    655: [655],
    1000: [1000],
    3: [3],
    655_1000_3: [655],
    655_1000_3_1: [1000, 3, 1000, 3],
    309: [309, 1000, 6],
    6: [6],
};

function validaFrom() {
    const reglaFrom = reglas[309];

    if (tokens.length !== reglaFrom.length) {
        console.log("Error en la estructura del FROM: Estructura incorrecta de la consulta");
        return;
    }

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] !== reglaFrom[i]) {
            console.log("Error en la estructura del FROM: Estructura incorrecta de la consulta");
            return;
        }
    }

    console.log("Estructura del FROM válida: Consulta correcta");
}

function validaSelect() {
    const reglaSelect = reglas[655];
    const reglaColumna = reglas[1000];
    const reglaComa = reglas[3];

    let i = 1;

    if (tokens.length < 3) {
        console.log("Error en la estructura del SELECT: Estructura incompleta");
        return;
    }

    if (tokens[1] !== reglaColumna[0]) {
        console.log("Error en la estructura del SELECT: Se esperaba una columna después del SELECT");
        return;
    }

    while (i < tokens.length - 1) {
        if (tokens[i] === reglaColumna[0]) {
            if (tokens[i + 1] === reglaComa[0]) {
                i += 2;
            } else if (tokens[i + 1] === reglaSelect[0] && tokens[i + 2] === reglaColumna[0]) {
                i += 3;
            } else if (tokens[i + 1] === reglas[309][0]) {
                validaFrom();
                return;
            } else {
                console.log("Error en la estructura del SELECT");
                return;
            }
        } else {
            console.log("Error en la estructura del SELECT");
            return;
        }
    }

    console.log("Estructura del SELECT válida");
}
