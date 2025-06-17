#!/bin/bash

# =================================================================
# Script para detener el Módulo de Asignaturas
# Funciona en Linux, macOS y Windows (Git Bash/WSL)
# =================================================================

echo "🛑 Deteniendo Módulo de Asignaturas..."
echo "====================================="
echo ""

# =================================================================
# Verificar Docker
# =================================================================

if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose no está disponible."
    exit 1
fi

# =================================================================
# Mostrar estado actual
# =================================================================

echo "📊 Estado actual de los servicios:"
docker-compose ps

echo ""

# =================================================================
# Detener servicios
# =================================================================

echo "🛑 Deteniendo servicios..."

# Detener y remover contenedores
if docker-compose down; then
    echo "✅ Servicios detenidos correctamente"
else
    echo "⚠️ Hubo algún problema al detener los servicios"
fi

echo ""

# =================================================================
# Opciones adicionales de limpieza
# =================================================================

echo "🧹 Opciones de limpieza adicional:"
echo ""

# Preguntar si eliminar volúmenes (datos)
read -p "❓ ¿Deseas eliminar también los DATOS de la base de datos? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Eliminando volúmenes de datos..."
    docker-compose down -v
    docker volume prune -f
    echo "✅ Datos eliminados"
    echo "⚠️ ATENCIÓN: Todos los datos de la base de datos han sido eliminados"
else
    echo "💾 Datos preservados - se mantendrán para el próximo inicio"
fi

echo ""

# Preguntar si eliminar imágenes
read -p "❓ ¿Deseas eliminar las IMÁGENES Docker? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Eliminando imágenes relacionadas..."

    # Eliminar imágenes del proyecto
    docker images | grep modulo-asignaturas | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true

    # Limpiar imágenes sin usar
    docker image prune -f

    echo "✅ Imágenes eliminadas"
    echo "💡 La próxima vez se reconstruirán automáticamente"
else
    echo "💾 Imágenes preservadas - inicio más rápido la próxima vez"
fi

echo ""

# Preguntar si hacer limpieza completa del sistema
read -p "❓ ¿Deseas hacer una limpieza COMPLETA del sistema Docker? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Ejecutando limpieza completa del sistema Docker..."
    echo "⚠️ ATENCIÓN: Esto eliminará TODOS los recursos Docker no utilizados"

    # Confirmación adicional
    read -p "❓ ¿Estás SEGURO? Esto afecta TODO Docker en tu sistema (y/N): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -a -f --volumes
        echo "✅ Limpieza completa del sistema realizada"
        echo "💡 Docker está ahora completamente limpio"
    else
        echo "❌ Limpieza completa cancelada"
    fi
else
    echo "💾 Sistema Docker preservado"
fi

# =================================================================
# Verificar estado final
# =================================================================

echo ""
echo "🔍 Verificando estado final..."

# Verificar que no hay contenedores del proyecto corriendo
project_containers=$(docker ps -q --filter "name=modulo-asignaturas" 2>/dev/null | wc -l)

if [ "$project_containers" -eq 0 ]; then
    echo "✅ No hay contenedores del proyecto ejecutándose"
else
    echo "⚠️ Aún hay $project_containers contenedor(es) del proyecto ejecutándose:"
    docker ps --filter "name=modulo-asignaturas"
fi

# =================================================================
# Mensaje final
# =================================================================

echo ""
echo "✅ Módulo de Asignaturas detenido correctamente"
echo "=============================================="
echo ""
echo "💡 Para volver a iniciar el sistema:"
echo "   ./start.sh"
echo ""
echo "📋 Para ver qué contenedores están ejecutándose:"
echo "   docker ps"
echo ""
echo "🔍 Para ver todos los contenedores (incluidos detenidos):"
echo "   docker ps -a"
echo ""
echo "📊 Para ver el uso de espacio en disco de Docker:"
echo "   docker system df"
echo ""

# Mostrar resumen final
echo "📊 Resumen final:"
if [ "$project_containers" -eq 0 ]; then
    echo "  ✅ Servicios: Detenidos"
else
    echo "  ⚠️ Servicios: Algunos aún ejecutándose"
fi

# Verificar volúmenes
project_volumes=$(docker volume ls -q --filter "name=modulo-asignaturas" 2>/dev/null | wc -l)
if [ "$project_volumes" -gt 0 ]; then
    echo "  💾 Datos: Preservados ($project_volumes volúmenes)"
else
    echo "  🗑️ Datos: Eliminados"
fi

# Verificar imágenes
project_images=$(docker images -q | grep -c . 2>/dev/null || echo "0")
echo "  🖼️ Imágenes Docker: $project_images en el sistema"

echo ""
echo "👋 ¡Hasta la próxima!"