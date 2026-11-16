const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { validarPlanta } = require("../../src/dominio/validaciones");

const MENSAJE_ENTERO =
  "El intervalo de riego debe ser un número entero de días";

function plantaValida(cambios = {}) {
  return {
    nombre: "Mandrágora",
    especie: "Mandragora officinarum",
    ubicacion: "Invernadero norte",
    intervaloRiegoDias: 3,
    ...cambios,
  };
}

function mensajes(detalles) {
  return detalles.map((d) => d.mensaje);
}

describe("validarPlanta", () => {
  test("CA-04.1: una planta completa con intervalo 3 no tiene errores", () => {
    assert.deepEqual(validarPlanta(plantaValida()), []);
  });

  test("CA-04.2: sin especie y con intervalo 0 da dos detalles en orden", () => {
    const datos = plantaValida({ intervaloRiegoDias: 0 });
    delete datos.especie;
    assert.deepEqual(validarPlanta(datos), [
      { campo: "especie", mensaje: "La especie es obligatoria" },
      {
        campo: "intervaloRiegoDias",
        mensaje: "El intervalo de riego debe ser de al menos 1 día",
      },
    ]);
  });

  test("CA-04.3: un nombre con solo espacios es obligatorio", () => {
    assert.deepEqual(validarPlanta(plantaValida({ nombre: "   " })), [
      { campo: "nombre", mensaje: "El nombre es obligatorio" },
    ]);
  });

  test("CA-04.4: un intervalo de 2.5 no es un número entero", () => {
    assert.deepEqual(
      mensajes(validarPlanta(plantaValida({ intervaloRiegoDias: 2.5 }))),
      [MENSAJE_ENTERO],
    );
  });

  test("CA-04.4: un intervalo «tres» no es un número entero", () => {
    assert.deepEqual(
      mensajes(validarPlanta(plantaValida({ intervaloRiegoDias: "tres" }))),
      [MENSAJE_ENTERO],
    );
  });

  test("un objeto vacío da los cuatro errores en orden", () => {
    assert.deepEqual(validarPlanta({}), [
      { campo: "nombre", mensaje: "El nombre es obligatorio" },
      { campo: "especie", mensaje: "La especie es obligatoria" },
      { campo: "ubicacion", mensaje: "La ubicación es obligatoria" },
      {
        campo: "intervaloRiegoDias",
        mensaje: "El intervalo de riego es obligatorio",
      },
    ]);
  });

  test("null o undefined como entrada se tratan como objeto vacío", () => {
    assert.equal(validarPlanta(null).length, 4);
    assert.equal(validarPlanta(undefined).length, 4);
  });

  test("especie y ubicación con solo espacios son obligatorias", () => {
    assert.deepEqual(
      mensajes(validarPlanta(plantaValida({ especie: " ", ubicacion: "\t" }))),
      ["La especie es obligatoria", "La ubicación es obligatoria"],
    );
  });

  test("un intervalo negativo debe ser de al menos 1 día", () => {
    assert.deepEqual(
      mensajes(validarPlanta(plantaValida({ intervaloRiegoDias: -2 }))),
      ["El intervalo de riego debe ser de al menos 1 día"],
    );
  });

  test("un intervalo NaN no es un número entero", () => {
    assert.deepEqual(
      mensajes(validarPlanta(plantaValida({ intervaloRiegoDias: NaN }))),
      [MENSAJE_ENTERO],
    );
  });

  test("un intervalo vacío o null es obligatorio", () => {
    for (const valor of [null, "", "  "]) {
      assert.deepEqual(
        mensajes(validarPlanta(plantaValida({ intervaloRiegoDias: valor }))),
        ["El intervalo de riego es obligatorio"],
      );
    }
  });

  test("un intervalo de texto numérico entero se acepta, como en el modelo", () => {
    assert.deepEqual(
      validarPlanta(plantaValida({ intervaloRiegoDias: "3" })),
      [],
    );
  });

  test("un intervalo de texto «2.5» no es un número entero", () => {
    assert.deepEqual(
      mensajes(validarPlanta(plantaValida({ intervaloRiegoDias: "2.5" }))),
      [MENSAJE_ENTERO],
    );
  });

  test("un intervalo booleano no es un número entero", () => {
    assert.deepEqual(
      mensajes(validarPlanta(plantaValida({ intervaloRiegoDias: true }))),
      [MENSAJE_ENTERO],
    );
  });
});
