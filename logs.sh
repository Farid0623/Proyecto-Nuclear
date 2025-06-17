#!/bin/bash

# =================================================================
# Script para ver logs del Módulo de Asignaturas
# Funciona en Linux, macOS y Windows (Git Bash/WSL)
# =================================================================

echo "📋 Visualizador de Logs - Módulo de Asignaturas"
echo "=============================================="
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
# Verificar estado de los servicios
# =================================================================

echo "🔍 Verificando estado de los servicios..."
echo ""

# Verificar si hay contenedores ejecutándose
containers=$(docker-compose ps -q 2>/dev/null)

if [ -z "$containers" ]; then
    echo "⚠️ No hay servicios ejecutándose."
    echo "💡 Para iniciar los servicios, ejecuta: ./start.sh"
    echo ""
    exit 1
fi

# Mostrar estado actual
echo "📊 Estado actual de los servicios:"
docker-compose ps
echo ""

# =================================================================
# Menú de opciones para logs
# =================================================================

echo "📋 Opciones de logs disponibles:"
echo ""
echo "1) 📱 Logs de la aplicación (app)"
echo "2) 🗄️ Logs de MongoDB"
echo "3) 🖥️ Logs de Mongo Express"
echo "4) 📊 Logs de todos los servicios"
echo "5) 🔄 Logs en tiempo real (todos)"
echo "6) 🔍 Logs recientes (últimas 50 líneas)"
echo "7) ⚡ Logs en tiempo real (solo app)"
echo "8) 🚨 Logs de errores (solo app)"
echo "9) 🔧 Logs con timestamps"
echo "0) ❌ Salir"
echo ""

read -p "Selecciona una opción (0-9): " option

case $option in
    1)
        echo ""
        echo "📱 Mostrando logs de la aplicación..."
        echo "Presiona Ctrl+C para salir"
        echo "================================="
        docker-compose logs app
        ;;
    2)
        echo ""
        echo "🗄️ Mostrando logs de MongoDB..."
        echo "Presiona Ctrl+C para salir"
        echo "============================="
        docker-compose logs mongodb
        ;;
    3)
        echo ""
        echo "🖥️ Mostrando logs de Mongo Express..."
        echo "Presiona Ctrl+C para salir"
        echo "=================================="
        docker-compose logs mongo-express
        ;;
    4)
        echo ""
        echo "📊 Mostrando logs de todos los servicios..."
        echo "Presiona Ctrl+C para salir"
        echo "=========================================="
        docker-compose logs
        ;;
    5)
        echo ""
        echo "🔄 Mostrando logs en tiempo real (todos los servicios)..."
        echo "Presiona Ctrl+C para salir"
        echo "======================================================="
        docker-compose logs -f
        ;;
    6)
        echo ""
        echo "🔍 Mostrando logs recientes (últimas 50 líneas)..."
        echo "=================================================="
        docker-compose logs --tail=50
        ;;
    7)
        echo ""
        echo "⚡ Mostrando logs en tiempo real (solo aplicación)..."
        echo "Presiona Ctrl+C para salir"
        echo "===================================================="
        docker-compose logs -f app
        ;;
    8)
        echo ""
        echo "🚨 Filtrando logs de errores de la aplicación..."
        echo "==============================================="
        docker-compose logs app | grep -i error
        echo ""
        echo "🔍 Filtrando logs de warnings de la aplicación..."
        docker-compose logs app | grep -i warn
        ;;
    9)
        echo ""
        echo "🔧 Mostrando logs con timestamps..."
        echo "Presiona Ctrl+C para salir"
        echo "================================="
        docker-compose logs -f -t
        ;;
    0)
        echo ""
        echo "👋 ¡Hasta luego!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Opción inválida. Por favor selecciona un número del 0 al 9."
        echo ""
        # Llamar recursivamente al script para mostrar el menú de nuevo
        exec "$0"
        ;;
esac

echo ""
echo "=================================================================="
echo "💡 Comandos útiles para logs:"
echo ""
echo "📋 Ver logs específicos:"
echo "   docker-compose logs [servicio]"
echo ""
echo "🔄 Seguir logs en tiempo real:"
echo "   docker-compose logs -f [servicio]"
echo ""
echo "🔍 Ver últimas N líneas:"
echo "   docker-compose logs --tail=N [servicio]"
echo ""
echo "🔧 Logs con timestamps:"
echo "   docker-compose logs -t [servicio]"
echo ""
echo "🚨 Filtrar errores:"
echo "   docker-compose logs [servicio] | grep -i error"
echo ""
echo "📊 Ver logs de contenedor específico:"
echo "   docker logs [container_id]"
echo ""
echo "🔄 Para ejecutar este script de nuevo:"
echo "   ./logs.sh"
echo ""