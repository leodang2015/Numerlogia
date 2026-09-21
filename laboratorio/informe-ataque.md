# Informe de Ataques Realizados (Ronda 1)

**Atacante:** [Tu Nombre / Usuario]  
**Objetivo (API atacada):** API de Numerología de [Nombre del Compañero]  
**URL del Túnel:** `https://rxwxpjlr-3000.use.devtunnels.ms`  

---

## Resumen Ejecutivo - Ronda 1

* **Total de ataques ejecutados:** 14
* **Defendidos:** 7
* **Vulnerables:** 7

---

## Registro Detallado de Ataques - Ronda 1

### ATAQUE #01: Falta lo obligatorio
* **Petición:** `POST /api/v1/users`
* **Body:** `{}` (Vacío)[cite: 15]
* **Respondió:** `400 Bad Request` — Con un array estructurado detallando los errores de validación de los campos obligatorios (`nombre_completo`, `email`, `password_hash`, `fecha_nacimiento`)[cite: 15].
* **Veredicto:** DEFENDIDO
* **Qué noté:** La API utiliza correctamente `express-validator` para interceptar los campos ausentes y responde con un formato limpio `400` en lugar de reventar con un error interno del servidor[cite: 15].

---

### ATAQUE #02: Body totalmente vacío
* **Petición:** `POST /api/v1/users`
* **Body:** `{}`[cite: 13]
* **Respondió:** `500 Internal Server Error` — `{"mensaje": "Error interno del servidor"}`[cite: 13].
* **Veredicto:** VULNERABLE
* **Qué noté:** Aunque el envío de campos vacíos individuales activa las validaciones, un body completamente vacío sin estructura JSON válida o un payload nulo no controlado genera una excepción interna no atrapada de nivel 500[cite: 13].

---

### ATAQUE #03: Tipos cambiados
* **Petición:** `POST /api/v1/users`
* **Body:**
  ```json
  {
    "nombre_completo": 12345,
    "email": "esto_no_es_un_correo",
    "fecha_nacimiento": "texto-invalido"
  }
  ```[cite: 14]
* **Respondió:** `400 Bad Request` — Detallando que el correo no es válido, la contraseña es obligatoria y el formato de fecha debe ser válido[cite: 14].
* **Veredicto:** DEFENDIDO
* **Qué noté:** Los validadores de tipo rechazan adecuadamente los valores erróneos en la entrada antes de procesarlos[cite: 14].

---

### ATAQUE #04: Vacío disfrazado
* **Petición:** `POST /api/v1/users`
* **Body:**
  ```json
  {
    "nombre_completo": "   ",
    "email": "   ",
    "password_hash": "   ",
    "fecha_nacimiento": "   "
  }
  ```[cite: 12]
* **Respondió:** `500 Internal Server Error` — `{"mensaje": "Error interno del servidor"}`[cite: 12].
* **Veredicto:** VULNERABLE
* **Qué noté:** Al enviar espacios en blanco puros (`"   "`), la sanitización con `.trim()` o las reglas de validación fallan internamente al intentar parsear los datos en el controlador, provocando un error 500[cite: 12].

---

### ATAQUE #05: Valor inventado en un enum
* **Petición:** `POST /api/v1/audit-logs`
* **Body:**
  ```json
  {
    "metodo": "METODO_INVENTADO",
    "endpoint": "/test",
    "status_code": 200
  }
  ```[cite: 12]
* **Respondió:** `500 Internal Server Error` — `{"mensaje": "Error interno del servidor"}`[cite: 12].
* **Veredicto:** VULNERABLE
* **Qué noté:** La API no valida el campo contra una lista cerrada de opciones permitidas (`.isIn()`), provocando que falle en el esquema de la base de datos[cite: 12].

---

### ATAQUE #06: Texto gigante
* **Petición:** `POST /api/v1/users`
* **Body:** Campo `nombre_completo` con una cadena masiva repetida de caracteres `a` (más de 10,000 caracteres)[cite: 11].
* **Respondió:** `400 Bad Request` — `{"mensaje": "El nombre completo debe tener entre 3 y 100 caracteres"}`[cite: 11].
* **Veredicto:** DEFENDIDO
* **Qué noté:** La regla de longitud máxima (`.isLength({ max: 100 })`) bloquea de forma eficiente el desbordamiento de datos[cite: 11].

---

### ATAQUE #07: Mass assignment (Creación)
* **Petición:** `POST /api/v1/users`
* **Body:**
  ```json
  {
    "nombre_completo": "Prueba",
    "email": "prueba@test.com",
    "password_hash": "123456",
    "fecha_nacimiento": "2000-01-01",
    "activo": true,
    "rol": "admin"
  }
  ```[cite: 10]
* **Respondió:** `201 Created` — El objeto devuelto incluye `"activo": true` y se guardó exitosamente en la base de datos[cite: 10].
* **Veredicto:** VULNERABLE
* **Qué noté:** La API acepta y persiste campos de control administrativo sensibles (`activo`, `rol`) enviados por el cliente debido a la ausencia de *whitelisting* en el controlador[cite: 10].

---

### ATAQUE #08: Mass assignment (Actualización / PUT)
* **Petición:** `PUT /api/v1/users/6ab1419cacdbb7722b6dd920`
* **Body:**
  ```json
  {
    "activo": true,
    "intentosFallidos": 0
  }
  ```[cite: 15]
* **Respondió:** `401 Unauthorized` — `{"msg": "Token no valido"}`[cite: 15].
* **Veredicto:** DEFENDIDO
* **Qué noté:** Las rutas de modificación de usuarios están protegidas por middleware de autenticación por Token, impidiendo que peticiones sin credenciales válidas ejecuten el cambio[cite: 15].

---

### ATAQUE #09: Id que no es un id
* **Petición:** `GET /api/v1/users/123abc`[cite: 5]
* **Body:** `{}`[cite: 5]
* **Respondió:** `401 Unauthorized` — `{"msg": "Token no valido"}`[cite: 5].
* **Veredicto:** DEFENDIDO
* **Qué noté:** El middleware de seguridad valida la sesión antes de procesar el parámetro de ruta[cite: 5].

---

### ATAQUE #10: Id válido pero que no existe
* **Petición:** `GET /api/v1/users/65a1b2c3d4e5f6a7b8c9d0e1`[cite: 4]
* **Respondió:** `401 Unauthorized` — `{"msg": "Token no valido"}`[cite: 4].
* **Veredicto:** DEFENDIDO
* **Qué noté:** Al requerir autenticación previa, cualquier consulta por ID (exista o no) es interceptada primero por el token[cite: 4].

---

### ATAQUE #11: Método que ne existe (DELETE)
* **Petición:** `DELETE /api/v1/users`[cite: 3]
* **Respondió:** `404 Not Found` (HTML con mensaje `<pre>Cannot DELETE /api/v1/users</pre>`)[cite: 3].
* **Veredicto:** DEFENDIDO
* **Qué noté:** El enrutador de Express maneja correctamente el método HTTP no definido[cite: 3].

---

### ATAQUE #12: Referencia a la nada
* **Petición:** `POST /api/v1/numerology-profiles`
* **Body:**
  ```json
  {
    "usuario_id": "507f1f77b86cd799439011",
    "numero_vida": 5,
    "numero_expresion": 3,
    "numero_alma": 7
  }
  ```[cite: 2]
* **Respondió:** `401 Unauthorized` — `{"msg": "Token no valido"}`[cite: 2].
* **Veredicto:** DEFENDIDO
* **Qué noté:** El endpoint exige un token válido para procesar relaciones referenciadas[cite: 2].

---

### ATAQUE #13: Borrar algo del que otros dependen
* **Petición:** `DELETE /api/v1/users/6ab143c2acdbb7722b6dd922`[cite: 8]
* **Respondió:** `401 Unauthorized` — `{"msg": "Token no valido"}`[cite: 8].
* **Veredicto:** DEFENDIDO
* **Qué noté:** Protegido por el middleware de autenticación[cite: 8].

---

### ATAQUE #14: Actualizar solo un campo
* **Petición:** `PUT /api/v1/users/6ab143c2acdbb7722b6dd922`
* **Body:** `{"nombre_completo": "Leon"}`[cite: 7]
* **Respondió:** `401 Unauthorized` — `{"msg": "Token no valido"}`[cite: 7].
* **Veredicto:** DEFENDIDO
* **Qué noté:** La capa de autenticación bloquea la actualización parcial de recursos sin un token activo[cite: 7].
