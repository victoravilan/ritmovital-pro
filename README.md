# 👑 Equilibrio Vital Pro

**Versión Profesional** - Comparación Avanzada de Biorritmos

## 🌟 Características Pro

### ✨ **Funcionalidades Exclusivas:**
- 👥 **Gestión de múltiples personas** (hasta 3)
- 📊 **Comparación grupal** de biorritmos
- 🎯 **Análisis por tipo** (Físico, Emocional, Intelectual)
- 📋 **Detalles individuales** completos
- 🤝 **Recomendaciones grupales** inteligentes
- ✅ **Sistema de inclusión/exclusión** de personas

### 🎨 **Branding Premium:**
- 👑 Iconos y favicon específicos Pro
- 🎨 Gradientes dorados y efectos premium
- 📱 Manifest optimizado para PWA Pro
- 🌟 Elementos visuales distintivos

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build
```

## 📱 Despliegue en Netlify

### Configuración automática:
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Environment variables**: Ya configuradas en netlify.toml

### Variables de entorno incluidas:
- `NEXT_PUBLIC_APP_VERSION=pro`
- `NEXT_PUBLIC_ENABLE_PRO=true`
- `NODE_VERSION=18`

## 🎯 Estructura del Proyecto

```
ritmovital-pro/
├── app/                    # Páginas Next.js
│   ├── pro/               # Página Pro específica
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes base
├── pro-version/           # Componentes Pro exclusivos
│   ├── components/        # Componentes Pro
│   └── lib/              # Lógica Pro
├── lib/                   # Utilidades base
├── public/               # Assets estáticos Pro
└── netlify.toml          # Configuración Netlify
```

## 🎨 Diferencias Visuales

| Elemento | Descripción |
|---|---|
| **Título** | Gradiente dorado animado |
| **Coronas** | Animación pulse |
| **Background** | Overlay premium con gradientes |
| **Theme** | Amber (#d97706) |
| **Badges** | Doble badge Premium |
| **Favicon** | Específico Pro |

## 📋 Funcionalidades

### 🏠 **Página Principal**
- Dashboard completo con funcionalidades Pro habilitadas
- Botón "Agregar y comparar personas"

### 👥 **Gestión de Personas**
- Agregar hasta 3 personas
- Editar información
- Sistema de activación/desactivación
- Colores únicos por persona

### 📊 **Comparación**
- Gráfico multi-línea
- Selector de tipo de comparación
- Scroll horizontal
- 31 días de análisis

### 📋 **Detalles**
- Vista individual por persona
- Todos los ciclos (Físico, Emocional, Intelectual)
- Información completa con tendencias

### 🎯 **Recomendaciones**
- Análisis grupal inteligente
- Sugerencias personalizadas
- Identificación de líderes y apoyo

---

**Creado por Victor M.F. Avilan** • Versión Pro 1.0.0