# 🐳 Módulo de Asignaturas - Deployment con Docker

Sistema completo de gestión de asignaturas universitarias con **Spring Boot**, **Spring Security**, **JWT** y **MongoDB**, completamente dockerizado para ejecutarse en cualquier sistema operativo.

## 🚀 Inicio Rápido (5 minutos)

### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado
- [Git](https://git-scm.com/) instalado
- 4GB RAM disponible
- 2GB espacio en disco

### Pasos para Cualquier Sistema Operativo

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/modulo-asignaturas.git
cd modulo-asignaturas

# 2. Ejecutar el sistema (elige tu OS)

# Linux/macOS:
chmod +x start.sh
./start.sh

# Windows (PowerShell/CMD):
docker-compose up --build -d

# Windows (Git Bash):
./start.sh
```

### 3. ¡Listo! 🎉

En 3-5 minutos tendrás el sistema completo funcionando:
- **API REST**: http://localhost:8080
- **MongoDB**: localhost:27017
- **Mongo Express**: http://localhost:8081

## 🧪 Verificación Rápida

```bash
# Probar endpoint público
curl http://localhost:8080/api/test/all

# Login de prueba
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## 🌐 Servicios Incluidos

| Servicio | URL/Puerto | Descripción | Estado |
|----------|------------|-------------|--------|
| **API REST** | http://localhost:8080 | Aplicación Spring Boot | ✅ Principal |
| **MongoDB** | localhost:27017 | Base de datos NoSQL | ✅ Requerido |
| **Mongo Express** | http://localhost:8081 | Interfaz web MongoDB | 🔧 Opcional |

## 🔑 Credenciales por Defecto

### API - Usuarios del Sistema
| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| `admin` | `admin123` | ADMINISTRADOR | Acceso completo |
| `coordinador` | `coord123` | COORDINADOR | Gestión académica |
| `profesor` | `prof123` | PROFESOR | Consulta asignaturas |
| `alumno` | `alum123` | ALUMNO | Solo lectura |
| `docker_admin` | `password` | ADMINISTRADOR | Usuario Docker |

### Servicios de Base de Datos
| Servicio | Usuario | Contraseña |
|----------|---------|------------|
| MongoDB | `admin` | `admin123` |
| Mongo Express | `admin` | `admin123` |

## 📚 Guía de Uso de la API

### 1. Autenticación JWT

```bash
# Login
POST http://localhost:8080/api/auth/signin
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

# Respuesta:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "id": "507f1f77bcf86cd799439011",
  "username": "admin",
  "role": "ADMINISTRADOR"
}
```

### 2. Usar Token en Requests

```bash
# Ejemplo: Listar usuarios (solo admins)
curl -X GET http://localhost:8080/api/usuarios \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 3. Endpoints Principales

| Endpoint | Método | Descripción | Roles Requeridos |
|----------|--------|-------------|------------------|
| `/api/test/all` | GET | Endpoint público | Público |
| `/api/auth/signin` | POST | Login | Público |
| `/api/usuarios` | GET | Listar usuarios | Admin |
| `/api/asignaturas` | GET | Listar asignaturas | Profesor+ |
| `/api/asignaturas` | POST | Crear asignatura | Coordinador+ |
| `/api/usuarios/perfil` | GET | Ver mi perfil | Autenticado |

### 4. Ejemplo Completo: Crear Asignatura

```bash
# 1. Login para obtener token
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username": "coordinador", "password": "coord123"}'

# 2. Crear asignatura con el token
curl -X POST http://localhost:8080/api/asignaturas \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "PROG101",
    "nombre": "Programación I",
    "creditos": 4,
    "horasTeoricas": 3,
    "horasPracticas": 1,
    "activa": true,
    "descripcion": "Introducción a la programación"
  }'
```

## 🛠️ Gestión del Sistema

### Scripts Incluidos

```bash
# Iniciar todo el sistema
./start.sh

# Ver logs en tiempo real
./logs.sh

# Detener el sistema
./stop.sh
```

### Comandos Docker Útiles

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs específicos
docker-compose logs app
docker-compose logs mongodb

# Reiniciar servicio específico
docker-compose restart app

# Entrar al contenedor de la aplicación
docker-compose exec app sh

# Conectar a MongoDB
docker-compose exec mongodb mongosh
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Crear archivo `.env` en la raíz para personalizar:

```env
# Puertos
SERVER_PORT=8080
MONGODB_PORT=27017
MONGO_EXPRESS_PORT=8081

# Base de datos
SPRING_DATA_MONGODB_DATABASE=modulo_asignaturas
SPRING_DATA_MONGODB_USERNAME=admin
SPRING_DATA_MONGODB_PASSWORD=admin123

# JWT
APP_JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_256_bits
APP_JWT_EXPIRATION_MS=86400000

# Logging
LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY=INFO
```

### Perfiles de Spring

- **docker**: Configuración para contenedores
- **dev**: Desarrollo local
- **prod**: Producción

### Cambiar Puertos

En `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "8080:8080"  # Cambiar primer puerto
  mongodb:
    ports:
      - "27017:27017"
```

## 📊 Datos Incluidos

### Usuarios Pre-creados
- Administrador completo del sistema
- Coordinador académico
- Profesor con permisos de consulta
- Alumno con acceso limitado

### Asignaturas de Ejemplo
- Docker 101 - Introducción a containers
- Spring Boot 201 - Desarrollo avanzado
- MongoDB 301 - Bases de datos NoSQL

### Plan de Estudios Demo
- Ingeniería de Software - Docker Edition
- 8 semestres, 144 créditos totales
- Estructura curricular con asignaturas por semestre

## 🚨 Troubleshooting

### Error: "Puerto ya en uso"

```bash
# Verificar qué usa el puerto
lsof -i :8080  # Linux/Mac
netstat -an | findstr :8080  # Windows

# Solución: Cambiar puerto o terminar proceso
```

### Error: "Cannot connect to MongoDB"

```bash
# Ver logs de MongoDB
docker-compose logs mongodb

# Reiniciar MongoDB
docker-compose restart mongodb

# Verificar conectividad
docker-compose exec app ping mongodb
```

### Error: "Application failed to start"

```bash
# Ver logs detallados
docker-compose logs app

# Reconstruir imagen
docker-compose build --no-cache app
docker-compose up -d app
```

### Error: "Out of disk space"

```bash
# Limpiar Docker
docker system prune -a
docker volume prune

# Verificar espacio
docker system df
```

## 📈 Monitoreo y Logs

### Health Checks Incluidos

- **API**: Endpoint `/api/test/all`
- **MongoDB**: Comando `mongosh ping`
- **Containers**: Docker health checks automáticos

### Logs Estructurados

```bash
# Logs por servicio
./logs.sh  # Menú interactivo

# Logs específicos
docker-compose logs -f app      # Solo aplicación
docker-compose logs mongodb     # Solo MongoDB
docker-compose logs --tail=50   # Últimas 50 líneas
```

### Métricas Disponibles

- **Actuator endpoints**: `/actuator/health`, `/actuator/metrics`
- **MongoDB stats**: A través de Mongo Express
- **Container stats**: `docker stats`

## 🔒 Seguridad

### Para Desarrollo ✅
- Credenciales por defecto incluidas
- JWT con clave fija
- Puertos expuestos para fácil acceso

### Para Producción ⚠️

**CAMBIOS OBLIGATORIOS:**

```bash
# 1. Cambiar todas las credenciales
# 2. Usar secretos de Docker
# 3. Configurar HTTPS/TLS
# 4. Usar imágenes específicas (no latest)
# 5. Limitar recursos de contenedores
# 6. Configurar firewall
# 7. Habilitar logs de auditoría
```

## 🌍 Soporte Multiplataforma

### Windows 10/11 ✅
- Docker Desktop
- PowerShell/CMD
- Git Bash/WSL

### macOS ✅
- Docker Desktop
- Terminal nativo
- Homebrew compatible

### Linux ✅
- Docker Engine
- Docker Compose
- Cualquier distribución

## 📞 Soporte y Problemas

### Logs de Debug

```bash
# Modo verbose
docker-compose up --build

# Logs de construcción
docker-compose build --no-cache --progress=plain

# Estado detallado
docker-compose ps
docker inspect [container_name]
```

### Recursos Útiles

- **Docker Docs**: https://docs.docker.com
- **Spring Boot**: https://spring.io/projects/spring-boot
- **MongoDB**: https://docs.mongodb.com
- **Spring Security**: https://spring.io/projects/spring-security

### Reportar Issues

1. **Incluir versiones**: Docker, OS, logs
2. **Comandos ejecutados**: Qué funcionó/falló
3. **Logs completos**: `docker-compose logs`
4. **Screenshots**: Si hay errores de UI

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver archivo [LICENSE](LICENSE) para detalles.

---

## 🎯 Próximos Pasos

Una vez que tengas el sistema funcionando:

1. **🔍 Explorar la API** con Postman o curl
2. **📊 Ver datos** en Mongo Express
3. **🧪 Probar diferentes roles** y permisos
4. **🔧 Customizar** según tus necesidades
5. **📚 Leer documentación** de cada tecnología

¡Disfruta desarrollando con el Módulo de Asignaturas! 🚀

---

**¿Tienes preguntas?** Abre un issue en GitHub o consulta la documentación de cada tecnología utilizada.