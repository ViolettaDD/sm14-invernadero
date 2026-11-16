// Reglas de negocio puras: sin Mongoose ni base de datos.
// Los mensajes coinciden con los del modelo Planta, que sigue siendo la segunda barrera.

const TEXTOS_OBLIGATORIOS_PLANTA = [
  ["nombre", "El nombre es obligatorio"],
  ["especie", "La especie es obligatoria"],
  ["ubicacion", "La ubicación es obligatoria"],
];

const MENSAJES_INTERVALO = {
  obligatorio: "El intervalo de riego es obligatorio",
  entero: "El intervalo de riego debe ser un número entero de días",
  minimo: "El intervalo de riego debe ser de al menos 1 día",
};

function estaVacio(valor) {
  return (
    valor === undefined ||
    valor === null ||
    (typeof valor === "string" && valor.trim() === "")
  );
}

// Acepta números y textos numéricos ("3"), igual que el cast de Mongoose.
function aNumero(valor) {
  if (typeof valor === "number") {
    return valor;
  }
  if (typeof valor === "string") {
    return Number(valor.trim());
  }
  return NaN;
}

function validarIntervalo(valor) {
  if (estaVacio(valor)) {
    return MENSAJES_INTERVALO.obligatorio;
  }
  const numero = aNumero(valor);
  if (!Number.isInteger(numero)) {
    return MENSAJES_INTERVALO.entero;
  }
  if (numero < 1) {
    return MENSAJES_INTERVALO.minimo;
  }
  return null;
}

function validarPlanta(datos) {
  const planta = datos ?? {};
  const detalles = [];

  for (const [campo, mensaje] of TEXTOS_OBLIGATORIOS_PLANTA) {
    if (estaVacio(planta[campo])) {
      detalles.push({ campo, mensaje });
    }
  }

  const mensajeIntervalo = validarIntervalo(planta.intervaloRiegoDias);
  if (mensajeIntervalo) {
    detalles.push({ campo: "intervaloRiegoDias", mensaje: mensajeIntervalo });
  }

  return detalles;
}

module.exports = { validarPlanta };
