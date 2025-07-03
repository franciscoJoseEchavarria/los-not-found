# Configuración del Envío de Correos con EmailJS

Esta aplicación utiliza EmailJS para enviar correos electrónicos directamente desde el frontend, sin necesidad de un servidor backend. Esto permite a los usuarios enviar promociones personalizadas a sus clientes.

## Pasos para configurar EmailJS

### 1. Crear una cuenta en EmailJS

1. Ve a [EmailJS](https://www.emailjs.com/) y regístrate para obtener una cuenta gratuita
2. La versión gratuita te permite enviar 200 correos al mes, lo que es suficiente para pruebas y demostraciones

### 2. Configurar un servicio de correo

1. En tu dashboard de EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona el proveedor de correo que deseas usar (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta de correo
5. Una vez creado, copia el "Service ID" (lo necesitarás más adelante)

### 3. Crear una plantilla de correo

1. En tu dashboard de EmailJS, ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Diseña tu plantilla de correo incluyendo las siguientes variables:
   - `{{to_email}}` - Email del destinatario
   - `{{to_name}}` - Nombre del destinatario
   - `{{subject}}` - Asunto del correo
   - `{{message}}` - Cuerpo del correo (texto plano)
   - `{{html_content}}` - Cuerpo del correo (HTML)
4. Guarda la plantilla y copia el "Template ID" (lo necesitarás más adelante)

### 4. Obtener tu Public Key

1. En tu dashboard de EmailJS, ve a "Account" > "API Keys"
2. Copia tu "Public Key" (lo necesitarás más adelante)

### 5. Configurar la aplicación

1. Abre el archivo `app/utils/emailConfig.ts`
2. Reemplaza los valores por los que copiaste:
   ```typescript
   export const EMAILJS_CONFIG = {
     SERVICE_ID: "tu_service_id", // El Service ID que copiaste en el paso 2
     TEMPLATE_ID: "tu_template_id", // El Template ID que copiaste en el paso 3
     PUBLIC_KEY: "tu_public_key", // La Public Key que copiaste en el paso 4
     
     // Cambia a false cuando estés listo para enviar correos reales
     IS_DEV_MODE: false
   };
   ```

### 6. Modo de desarrollo

- Mientras desarrollas, puedes dejar `IS_DEV_MODE: true` para evitar enviar correos reales
- La aplicación simulará el envío y mostrará los datos del correo en la consola
- Cuando estés listo para probar con correos reales, cambia a `IS_DEV_MODE: false`

## Personalización de la plantilla

Para una mejor experiencia, diseña tu plantilla en EmailJS con un estilo similar al de la aplicación. Puedes usar HTML y CSS en tu plantilla para hacerla visualmente atractiva.

## Solución de problemas

- Si los correos no se envían, verifica la consola del navegador para errores
- Asegúrate de que tus credenciales sean correctas en `emailConfig.ts`
- Si estás en modo de producción (`IS_DEV_MODE: false`), verifica los límites de tu plan de EmailJS

## Planes de EmailJS

- Plan gratuito: 200 correos al mes
- Planes de pago disponibles si necesitas enviar más correos
- Consulta [EmailJS Pricing](https://www.emailjs.com/pricing/) para más detalles 