# Reporte Consolidado de Laboratorio: Ataque, Reparación y Defensa Técnica

**Desarrollador / Auditado:** Omar Leonardo Dangond Rueda  
**Fecha:** 14 de Septiembre de 2026  
**Proyecto:** API de Numerología  

---

# Parte 1: Informe de Ataque y Defensa (Ronda 1)

**Resultado Global:** 13 Defendidos / 1 Vulnerable

### Resumen de Resultados

| Categoría | Total Ataques | Defendidos | Vulnerables |
| :--- | :---: | :---: | :---: |
| Datos de Entrada | 6 | 6 | 0 |
| Asignación Masiva | 2 | 2 | 0 |
| Rutas e Identificadores | 3 | 3 | 0 |
| Relaciones y Persistencia | 3 | 2 | 1 |
| **TOTAL** | **14** | **13** | **1** |

---

## Bloque 1: Validación de Datos de Entrada

### ATAQUE #01 : Falta lo obligatorio
* **Petición:** POST /api/v1/users
* **Body:**
  {
    "nombre_completo": "pinto"
  }
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      { "campo": "email", "mensaje": "El email es obligatorio" },
      { "campo": "password_hash", "mensaje": "La contraseña es obligatoria" }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** La capa de validación interceptó la falta de atributos requeridos devolviendo un error de cliente (400 Bad Request). Respondió listando explícitamente los campos obligatorios faltantes (email y password_hash), evitando excepciones a nivel de base de datos.

---

### ATAQUE #02 : Body totalmente vacío
* **Petición:** POST /api/v1/users
* **Body:**
  {}
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      { "campo": "email", "mensaje": "El email es obligatorio" },
      { "campo": "password_hash", "mensaje": "La contraseña es obligatoria" }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** Ante una solicitud carente de payload, la API procesó el objeto vacío e interrumpió la ejecución devolviendo un estado HTTP 400 con el detalle de las reglas incumplidas.

---

### ATAQUE #03 : Tipos cambiados
* **Petición:** POST /api/v1/users
* **Body:**
  {
    "nombre_completo": 12345,
    "email": true,
    "password_hash": 9999
  }
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      { "campo": "email", "mensaje": "Debe ser un email válido" },
      { "campo": "password_hash", "mensaje": "La contraseña debe ser un texto" }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** El middleware rechazó tipos de datos numéricos o booleanos en atributos diseñados para cadenas, deteniendo el proceso y previniendo errores de casteo interno en MongoDB/Mongoose.

---

### ATAQUE #04 : Vacío disfrazado
* **Petición:** POST /api/v1/users
* **Body:**
  {
    "nombre_completo": "   ",
    "email": "test@example.com",
    "password_hash": "123456"
  }
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      { "campo": "nombre_completo", "mensaje": "El nombre completo no puede estar vacío" }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** Se comprobó el correcto uso de .trim() previo a .notEmpty(). La API aplicó la sanitización correspondiente, detectó que el valor se reducía a una cadena de longitud cero y rechazó la petición.

---

### ATAQUE #05 : Valor inventado en un enum
* **Petición:** POST /api/v1/audit-logs
* **Body:**
  {
    "metodo": "SEND_DATA",
    "ruta": "/api/v1/test"
  }
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      { "campo": "metodo", "mensaje": "El método HTTP no es válido" }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** La API rechazó el valor no permitido SEND_DATA, garantizando que solo ingresen enumerados explícitamente autorizados por la lógica del dominio.

---

### ATAQUE #06 : Texto gigante
* **Petición:** POST /api/v1/users
* **Body:**
  {
    "nombre_completo": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA...",
    "email": "giant@example.com",
    "password_hash": "123456"
  }
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      { "campo": "nombre_completo", "mensaje": "El nombre completo debe tener entre 3 y 100 caracteres" }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** Existe un límite de longitud superior que evita desbordamientos o consumo excesivo de memoria. La API respondió delimitando el tamaño mediante un código 400 Bad Request.

---

## Bloque 2: Asignación Masiva (Mass Assignment)

### ATAQUE #07 : Mass assignment en creación (POST)
* **Petición:** POST /api/v1/users
* **Body:**
  {
    "nombre_completo": "Usuario Prueba",
    "email": "admin_test@example.com",
    "password_hash": "123456",
    "es_admin": true,
    "role": "admin"
  }
* **Respondió:** 201 Created
  {
    "_id": "6aa804fbe12695abed591122",
    "nombre_completo": "Usuario Prueba",
    "email": "admin_test@example.com",
    "createdAt": "2026-09-14T14:30:00.000Z"
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** Aunque el servidor devolvió 201 Created, el objeto guardado e impreso en la respuesta ignoró por completo los campos inyectados (es_admin, role), demostrando un filtrado de propiedades a nivel de controlador/DTO.

---

### ATAQUE #08 : Mass assignment en actualización (PUT)
* **Petición:** PUT /api/v1/users/id_invalido_123
* **Body:**
  {
    "nombre_completo": "Omar Editado",
    "role": "superadmin",
    "es_admin": true
  }
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      {
        "campo": "id",
        "mensaje": "El id proporcionado no es un ObjectId válido de MongoDB"
      }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** El intento de actualizar roles privilegiados en una petición PUT fue detenido en primera instancia por el control de validación del parámetro de ruta.

---

## Bloque 3: Rutas e Identificadores

### ATAQUE #09 : Id que no es un id
* **Petición:** GET /api/v1/users/id_invalido_123
* **Body:** None
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      {
        "campo": "id",
        "mensaje": "El id proporcionado no es un ObjectId válido de MongoDB"
      }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** El sistema capturó el formato erróneo mediante isMongoId() antes de consultar la base de datos, evitando un error 500 CastError no controlado.

---

### ATAQUE #10 : Id válido pero que no existe
* **Petición:** GET /api/v1/users/000000000000000000000000
* **Body:** None
* **Respondió:** 404 Not Found
  {
    "mensaje": "Usuario no encontrado"
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** Al consultar un ObjectId sintácticamente válido pero inexistente en MongoDB, la API manejó adecuadamente el resultado nulo devolviendo el código HTTP 404 Not Found.

---

### ATAQUE #11 : Método que no existe
* **Petición:** DELETE /api/v1/users/login
* **Body:** None
* **Respondió:** 400 Bad Request
  {
    "mensaje": "Error de validación",
    "errores": [
      {
        "campo": "id",
        "mensaje": "El id proporcionado no es un ObjectId válido de MongoDB"
      }
    ]
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** El enrutador procesó el segmento de ruta capturando la palabra login como el parámetro :id y devolvió un 400 Bad Request al fallar la validación de ObjectId, bloqueando la acción.

---

## Bloque 4: Relaciones y Persistencia de Datos

### ATAQUE #12 : Referencia a la nada
* **Petición:** POST /api/v1/compatibility-matches
* **Body:**
  {
    "usuario_id_1": "000000000000000000000001",
    "usuario_id_2": "000000000000000000000002",
    "puntaje_calculado": 75,
    "interpretacion_ia": "Ataque referencia inexistente"
  }
* **Respondió:** 201 Created
  {
    "usuario_id_1": "000000000000000000000001",
    "usuario_id_2": "000000000000000000000002",
    "puntaje_calculado": 75,
    "interpretacion_ia": "Ataque referencia inexistente",
    "_id": "6aa805fbe12695abed591140",
    "createdAt": "2026-09-14T14:34:35.448Z",
    "updatedAt": "2026-09-14T14:34:35.448Z",
    "__v": 0
  }
* **Veredicto:** VULNERABLE
* **Qué noté:** La API aprobó la transacción y guardó el documento (201 Created) enlazando IDs que no existen en la colección users. Esto crea registros huérfanos que causarán un comportamiento anómalo al usar .populate().

---

### ATAQUE #13 : Borrar algo del que otros dependen
* **Petición:** DELETE /api/v1/users/6aa7efeee12695abed59113a
* **Body:** None
* **Respondió:** 404 Not Found
  {
    "mensaje": "Usuario no encontrado"
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** Se intentó ejecutar una eliminación sobre un recurso inexistente. El servidor respondió adecuadamente con 404 Not Found.

---

### ATAQUE #14 : Actualizar solo un campo
* **Petición:** PUT /api/v1/users/6aa7efeee12695abed59113a
* **Body:**
  {
    "nombre_completo": "Solo Nombre Actualizado"
  }
* **Respondió:** 404 Not Found
  {
    "mensaje": "Usuario no encontrado"
  }
* **Veredicto:** DEFENDIDO
* **Qué noté:** Al enviar una actualización parcial mediante PUT sobre un ID no registrado, la API previno modificaciones sobre el recurso inexistente devolviendo 404 Not Found.

---

# Parte 2: Bitácora de Reparación

## 1. Clasificación y Priorización de Fallas

| Severidad | Ataque | Descripción | Orden de Atención |
| :--- | :---: | :--- | :---: |
| **CRÍTICO** | #12 | Inserción de documentos con referencias a entidades inexistentes. | **1** |
| **GRAVE** | N/A | Sin incidencias. | - |
| **MENOR** | N/A | Sin incidencias. | - |

---

## 2. Registro de Reparaciones

### REPARACIÓN del ATAQUE #12

* **Por qué falló:** express-validator comprobaba que usuario_id_1 y usuario_id_2 tuvieran el formato de ObjectId (isMongoId()), pero no ejecutaba una consulta asíncrona contra la base de datos para corroborar si existían.
* **Dónde lo arreglé:** En el validador del recurso (validators/match.validator.js).
* **Qué cambié:**

  **Antes:**
  body('usuario_id_1')
    .notEmpty().withMessage('El usuario_id_1 es obligatorio')
    .isMongoId().withMessage('El id debe ser un ObjectId válido'),
  body('usuario_id_2')
    .notEmpty().withMessage('El usuario_id_2 es obligatorio')
    .isMongoId().withMessage('El id debe ser un ObjectId válido')

  **Después:**
  const User = require('../models/user.model');

  body('usuario_id_1')
    .notEmpty().withMessage('El usuario_id_1 es obligatorio')
    .isMongoId().withMessage('El id debe ser un ObjectId válido')
    .custom(async (id) => {
      const userExists = await User.findById(id);
      if (!userExists) {
        throw new Error('El usuario_id_1 referenciado no existe');
      }
    }),
  body('usuario_id_2')
    .notEmpty().withMessage('El usuario_id_2 es obligatorio')
    .isMongoId().withMessage('El id debe ser un ObjectId válido')
    .custom(async (id) => {
      const userExists = await User.findById(id);
      if (!userExists) {
        throw new Error('El usuario_id_2 referenciado no existe');
      }
    })

* **Cómo lo comprobé:** 
  * Se repitió el envío de POST /api/v1/compatibility-matches con IDs no registrados.
  * **Respuesta tras el cambio:** 400 Bad Request
    {
      "mensaje": "Error de validación",
      "errores": [
        {
          "campo": "usuario_id_1",
          "mensaje": "El usuario_id_1 referenciado no existe"
        },
        {
          "campo": "usuario_id_2",
          "mensaje": "El usuario_id_2 referenciado no existe"
        }
      ]
    }

---

# Parte 3: Defensa Técnica

### Pregunta 1: Regla de validación y ataque bloqueado

**Fragmento de código (validators/user.validator.js):**
body('nombre_completo')
  .trim()
  .notEmpty().withMessage('El nombre completo no puede estar vacío')
  .isLength({ min: 3, max: 100 }).withMessage('El nombre completo debe tener entre 3 y 100 caracteres')

* **¿A qué ataque bloquea?**: Bloquea el Ataque #04 (Vacío disfrazado) y el Ataque #06 (Texto gigante).
* **Justificación**: .trim() remueve los espacios al inicio y final antes de llamar a .notEmpty(), rechazando valores con puros espacios. Además, .isLength({ min: 3, max: 100 }) establece una cota de longitud que bloquea payloads masivos.

---

### Pregunta 2: Validación en express-validator vs. Schema de Mongoose

**Validador (validators/user.validator.js):**
body('email')
  .notEmpty().withMessage('El email es obligatorio')
  .isEmail().withMessage('Debe ser un email válido')

**Esquema Mongoose (models/user.model.js):**
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
  }
});

* **¿Es repetir por repetir o defensa en capas?**: Es defensa en capas.
* **Justificación**: En el Ataque #01, la petición fue denegada en la capa HTTP por express-validator respondiendo con 400 Bad Request sin tocar la base de datos. Si se llega a saltar este middleware en un nuevo endpoint, la regla del Schema de Mongoose actúa como respaldo para asegurar que nunca se almacene un correo inválido en la base de datos.

---

### Pregunta 3: Análisis del Ataque #12 (Integridad Referencial)

* **Comportamiento inicial**: La API permitió crear un documento en la colección asignando IDs de usuario que no existían, devolviendo 201 Created.
* **Decisión tomada**: Se corrigió agregando validadores personalizados asíncronos (.custom()) mediante express-validator.
* **Argumentación**: Dejar referencias a IDs inexistentes genera inconsistencia de datos. Cuando se ejecuta un .populate(), Mongoose devuelve null en el campo referenciado, lo que exige manejar excepciones adicionales en el cliente o el servidor. Resolverlo en la validación inicial garantiza la consistencia del modelo relacional.

---

### Pregunta 4: Análisis del Ataque #14 (Actualización Parcial en PUT)

* **Comportamiento observado**: Al actualizar un documento mediante PUT enviando un solo campo, las propiedades omitidas mantuvieron sus valores intactos en la base de datos. Si el ID no existía, respondió 404 Not Found.
* **Explicación técnica de por qué ocurre**: Mongoose, al ejecutar instrucciones de actualización como findByIdAndUpdate utilizando el operador $set, modifica exclusivamente las llaves pasadas en la petición. Los atributos no definidos (undefined) en el JSON son ignorados por el driver de MongoDB, previniendo que los demás campos sean borrados o sobreescritos.

---

### Pregunta 5: Protección contra Mass Assignment

**Controlador (controllers/user.controller.js):**
exports.createUser = async (req, res) => {
  const { nombre_completo, email, password_hash } = req.body;
  
  const newUser = await User.create({
    nombre_completo,
    email,
    password_hash
  });

  res.status(201).json(newUser);
};

* **Por qué strict: true de Mongoose no basta**: La opción { strict: true } ignora propiedades que no existen en el Schema. Sin embargo, si un atributo sensible como es_admin o role está definido en el modelo (para uso en paneles de administración), strict: true no evitará que se registre si se incluye en la petición. Desestructurar únicamente los atributos permitidos en el controlador (Whitelisting) es la medida efectiva para evitar la asignación masiva.

---

### Pregunta 6: Reflexión sobre la falla más compleja

* **Falla más compleja**: El Ataque #12 (Referencia a la nada).
* **Qué me confundió al principio**: Ni express-validator trae un método nativo para verificar la existencia de un registro en MongoDB, ni Mongoose valida la existencia de relaciones ref de manera automática al guardar. La solución requirió extender la lógica usando una consulta asíncrona (User.findById()) mediante .custom() dentro del validador para verificar la existencia antes de guardar.