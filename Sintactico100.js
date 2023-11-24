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
    3: [3,1000],
    655: [655, 1000 ],
    309: [309, 1000, 6],
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


    console.log("Estructura del SELECT válida");
}
