# Defensa Técnica de la API de Numerología

**Desarrollador / Auditado:** Omar Leonardo Dangond Rueda  
**Fecha:** 14 de Septiembre de 2026  
**Proyecto:** API de Numerología  

---

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