const express = require('express');
const app = express();
const PORT = 3003;


app.use(express.json());


let tareas = [];


app.get('/tareas', (req, res) => {
    const { completada } = req.query;
    let tareasFiltradas = [...tareas];
    
    // Aplicar filtro si se proporciona
    if (completada !== undefined) {
        const esCompletada = completada.toLowerCase() === 'true';
        tareasFiltradas = tareas.filter(tarea => tarea.completada === esCompletada);
    }
    
    res.json(tareasFiltradas);
});

// GET /tareas/:id - Obtener una específica
app.get('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarea = tareas.find(t => t.id === id);
    
    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    res.json(tarea);
});

// POST /tareas - Crear nueva
app.post('/tareas', (req, res) => {
    const { nombre, completada } = req.body;
    
    // Validación básica
    if (!nombre || typeof completada !== 'boolean') {
        return res.status(400).json({ error: 'Nombre y completada (true/false) son requeridos' });
    }
    
    // Verificar si el nombre ya existe
    if (tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase())) {
        return res.status(400).json({ error: 'Ya existe una tarea con ese nombre' });
    }
    
    const nuevaTarea = {
        id: tareas.length + 1,
        nombre: nombre.trim(),
        completada: completada,
        fechaCreacion: new Date().toISOString()
    };
    
    tareas.push(nuevaTarea);
    res.json(nuevaTarea);
});

// PUT /tareas/:id - Actualizar
app.put('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, completada } = req.body;
    
    // Validación básica
    if (!nombre || typeof completada !== 'boolean') {
        return res.status(400).json({ error: 'Nombre y completada (true/false) son requeridos' });
    }
    
    const indice = tareas.findIndex(t => t.id === id);
    if (indice === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    // Verificar si el nombre ya existe (excluyendo la actual)
    if (tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase() && t.id !== id)) {
        return res.status(400).json({ error: 'Ya existe otra tarea con ese nombre' });
    }
    
    tareas[indice].nombre = nombre.trim();
    tareas[indice].completada = completada;
    tareas[indice].fechaModificacion = new Date().toISOString();
    
    res.json(tareas[indice]);
});

// PATCH /tareas/:id/toggle - Cambiar estado
app.patch('/tareas/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = tareas.findIndex(t => t.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    tareas[indice].completada = !tareas[indice].completada;
    tareas[indice].fechaModificacion = new Date().toISOString();
    
    res.json(tareas[indice]);
});

// DELETE /tareas/:id - Eliminar
app.delete('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = tareas.findIndex(t => t.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    const tareaEliminada = tareas.splice(indice, 1)[0];
    res.json({ message: 'Tarea eliminada', data: tareaEliminada });
});

// GET /tareas/completadas - Solo completadas
app.get('/tareas/completadas', (req, res) => {
    const tareasCompletadas = tareas.filter(tarea => tarea.completada === true);
    res.json(tareasCompletadas);
});

// GET /tareas/pendientes - Solo pendientes
app.get('/tareas/pendientes', (req, res) => {
    const tareasPendientes = tareas.filter(tarea => tarea.completada === false);
    res.json(tareasPendientes);
});

// Ruta de información
app.get('/', (req, res) => {
    res.json({
        message: 'API de Tareas - Versión Simplificada',
        endpoints: [
            'GET /tareas - Listar todas (con filtro ?completada=true/false)',
            'GET /tareas/:id - Obtener una específica',
            'POST /tareas - Crear nueva',
            'PUT /tareas/:id - Actualizar',
            'PATCH /tareas/:id/toggle - Cambiar estado',
            'DELETE /tareas/:id - Eliminar',
            'GET /tareas/completadas - Solo completadas',
            'GET /tareas/pendientes - Solo pendientes'
        ]
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor Ejercicio 3 (Simplificado) ejecutándose en http://localhost:${PORT}`);
});
