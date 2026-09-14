# Bitácora de Reparación de Vulnerabilidades

**Desarrollador / Auditado:** Omar Leonardo Dangond Rueda  
**Fecha:** 14 de Septiembre de 2026  
**Proyecto:** API de Numerología  

---

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