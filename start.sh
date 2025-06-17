#!/bin/bash

# =================================================================
# Script de inicio para Módulo de Asignaturas
# Funciona en Linux, macOS y Windows (Git Bash/WSL)
# =================================================================

echo "🚀 Iniciando Módulo de Asignaturas con Docker..."
echo "=================================================="
echo ""

# =================================================================
# Verificar prerrequisitos
# =================================================================

echo "🔍 Verificando prerrequisitos..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado."
    echo "📥 Por favor instala Docker desde: https://www.docker.com/get-started"
    echo ""
    exit 1
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose no está instalado."
    echo "📥 Por favor instala Docker Compose desde: https://docs.docker.com/compose/install/"
    echo ""
    exit 1
fi

# Verificar que Docker esté ejecutándose
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker no está ejecutándose."
    echo "▶️ Por favor inicia Docker Desktop o el servicio de Docker"
    echo ""
    exit 1
fi

echo "✅ Docker está disponible"
echo "✅ Docker Compose está disponible"
echo ""

# =================================================================
# Preparar entorno
# =================================================================

echo "📁 Preparando entorno..."

# Crear directorios necesarios si no existen
mkdir -p docker/mongo-init
mkdir -p logs

# Verificar que los archivos necesarios existan
echo "🔍 Verificando archivos de configuración..."

required_files=("Dockerfile" "docker-compose.yml" "docker/mongo-init/init-mongo.js")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Error: Faltan archivos necesarios:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "💡 Por favor asegúrate de tener todos los archivos de configuración Docker."
    exit 1
fi

echo "✅ Todos los archivos de configuración están presentes"
echo ""

# =================================================================
# Limpiar instalación anterior
# =================================================================

echo "🧹 Limpiando instalación anterior..."

# Detener contenedores existentes
docker-compose down 2>/dev/null || true

# Limpiar contenedores huérfanos
docker-compose down --remove-orphans 2>/dev/null || true

echo "✅ Limpieza completada"
echo ""

# =================================================================
# Construir e iniciar servicios
# =================================================================

echo "🔨 Construyendo e iniciando servicios..."
echo "⏳ Esto puede tomar varios minutos la primera vez..."
echo ""

# Construir e iniciar en modo detached
if docker-compose up --build -d; then
    echo ""
    echo "✅ Servicios iniciados correctamente"
else
    echo ""
    echo "❌ Error al iniciar los servicios"
    echo "📋 Mostrando logs para diagnóstico..."
    docker-compose logs
    exit 1
fi

# =================================================================
# Esperar a que los servicios estén listos
# =================================================================

echo ""
echo "⏳ Esperando a que los servicios estén listos..."

# Función para verificar si un servicio está listo
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    echo "🔍 Verificando $service_name..."

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            echo "✅ $service_name está listo"
            return 0
        fi

        echo "⏳ Intento $attempt/$max_attempts - Esperando $service_name..."
        sleep 5
        attempt=$((attempt + 1))
    done

    echo "⚠️ $service_name no respondió después de $max_attempts intentos"
    return 1
}

# Esperar a que MongoDB esté listo
echo "⏳ Esperando a que MongoDB esté listo..."
sleep 10

# Esperar a que la aplicación esté lista
wait_for_service "API REST" "http://localhost:8080/api/test/all"

# =================================================================
# Verificar estado de los servicios
# =================================================================

echo ""
echo "📊 Estado de los servicios:"
echo "=========================="
docker-compose ps

echo ""
echo "🔍 Verificación rápida de la API..."

# Probar endpoint público
if curl -f -s http://localhost:8080/api/test/all > /dev/null; then
    echo "✅ API responde correctamente"
else
    echo "⚠️ API no responde - verificando logs..."
    echo ""
    echo "📋 Logs de la aplicación:"
    docker-compose logs --tail=20 app
fi

# =================================================================
# Mostrar información de conexión
# =================================================================

echo ""
echo "🎉 ¡Sistema iniciado exitosamente!"
echo "================================="
echo ""
echo "🌐 Servicios disponibles:"
echo "  📱 API REST:        http://localhost:8080"
echo "  🗄️  MongoDB:        localhost:27017"
echo "  🖥️  Mongo Express:   http://localhost:8081"
echo ""
echo "🔑 Credenciales por defecto:"
echo "  👤 Admin API:       admin / admin123"
echo "  👤 Coordinador:     coordinador / coord123"
echo "  👤 Profesor:        profesor / prof123"
echo "  👤 Alumno:          alumno / alum123"
echo "  👤 Docker Admin:    docker_admin / password"
echo ""
echo "  🗄️  MongoDB Admin:  admin / admin123"
echo "  🖥️  Mongo Express:  admin / admin123"
echo ""
echo "🧪 Pruebas rápidas:"
echo "  curl http://localhost:8080/api/test/all"
echo ""
echo "  curl -X POST http://localhost:8080/api/auth/signin \\"
echo "    -H \"Content-Type: application/json\" \\"
echo "    -d '{\"username\": \"admin\", \"password\": \"admin123\"}'"
echo ""
echo "📋 Comandos útiles:"
echo "  📊 Ver logs:        docker-compose logs -f"
echo "  📊 Ver estado:      docker-compose ps"
echo "  🛑 Detener:         docker-compose down"
echo "  🛑 Detener todo:    ./stop.sh"
echo "  📋 Ver logs:        ./logs.sh"
echo ""
echo "✨ ¡Disfruta desarrollando con el Módulo de Asignaturas!"