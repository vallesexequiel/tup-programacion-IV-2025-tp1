const express = require('express');
const app = express();
const PORT = 3002;


app.use(express.json());


let alumnos = [];


const calcularPromedio = (notas) => {
    const suma = notas.reduce((total, nota) => total + nota, 0);
    return suma / notas.length;
};

const determinarEstado = (promedio) => {
    if (promedio < 6) return 'reprobado';
    if (promedio < 8) return 'aprobado';
    return 'promocionado';
};

// GET /alumnos - Obtener todos
app.get('/alumnos', (req, res) => {
    const alumnosConCalculos = alumnos.map(alumno => ({
        id: alumno.id,
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio: parseFloat(calcularPromedio(alumno.notas).toFixed(2)),
        estado: determinarEstado(calcularPromedio(alumno.notas))
    }));
    
    res.json(alumnosConCalculos);
});

// GET /alumnos/:id - Obtener uno específico
app.get('/alumnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const alumno = alumnos.find(a => a.id === id);
    
    if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    const promedio = calcularPromedio(alumno.notas);
    res.json({
        id: alumno.id,
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio: parseFloat(promedio.toFixed(2)),
        estado: determinarEstado(promedio)
    });
});

// POST /alumnos - Crear nuevo
app.post('/alumnos', (req, res) => {
    const { nombre, notas } = req.body;
    
    // Validación básica
    if (!nombre || !notas || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'Nombre y 3 notas son requeridos' });
    }
    
    // Verificar si el nombre ya existe
    if (alumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase())) {
        return res.status(400).json({ error: 'Ya existe un alumno con ese nombre' });
    }
    
    const nuevoAlumno = {
        id: alumnos.length + 1,
        nombre: nombre.trim(),
        notas: notas.map(nota => parseFloat(nota))
    };
    
    alumnos.push(nuevoAlumno);
    
    const promedio = calcularPromedio(nuevoAlumno.notas);
    res.json({
        id: nuevoAlumno.id,
        nombre: nuevoAlumno.nombre,
        notas: nuevoAlumno.notas,
        promedio: parseFloat(promedio.toFixed(2)),
        estado: determinarEstado(promedio)
    });
});

// PUT /alumnos/:id - Actualizar
app.put('/alumnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, notas } = req.body;
    
    // Validación básica
    if (!nombre || !notas || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'Nombre y 3 notas son requeridos' });
    }
    
    const indice = alumnos.findIndex(a => a.id === id);
    if (indice === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    // Verificar si el nombre ya existe (excluyendo el actual)
    if (alumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase() && a.id !== id)) {
        return res.status(400).json({ error: 'Ya existe otro alumno con ese nombre' });
    }
    
    alumnos[indice].nombre = nombre.trim();
    alumnos[indice].notas = notas.map(nota => parseFloat(nota));
    
    const promedio = calcularPromedio(alumnos[indice].notas);
    res.json({
        id: alumnos[indice].id,
        nombre: alumnos[indice].nombre,
        notas: alumnos[indice].notas,
        promedio: parseFloat(promedio.toFixed(2)),
        estado: determinarEstado(promedio)
    });
});

// DELETE /alumnos/:id - Eliminar
app.delete('/alumnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = alumnos.findIndex(a => a.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    const alumnoEliminado = alumnos.splice(indice, 1)[0];
    res.json({ message: 'Alumno eliminado', data: alumnoEliminado });
});

// GET /alumnos/estado/:estado - Filtrar por estado
app.get('/alumnos/estado/:estado', (req, res) => {
    const estadoFiltro = req.params.estado.toLowerCase();
    const estadosValidos = ['reprobado', 'aprobado', 'promocionado'];
    
    if (!estadosValidos.includes(estadoFiltro)) {
        return res.status(400).json({ error: 'Estado inválido' });
    }
    
    const alumnosFiltrados = alumnos
        .map(alumno => ({
            id: alumno.id,
            nombre: alumno.nombre,
            notas: alumno.notas,
            promedio: parseFloat(calcularPromedio(alumno.notas).toFixed(2)),
            estado: determinarEstado(calcularPromedio(alumno.notas))
        }))
        .filter(alumno => alumno.estado === estadoFiltro);
    
    res.json(alumnosFiltrados);
});

// Ruta de información
app.get('/', (req, res) => {
    res.json({
        message: 'API de Alumnos - Versión Simplificada',
        endpoints: [
            'GET /alumnos - Listar todos',
            'GET /alumnos/:id - Obtener uno',
            'POST /alumnos - Crear nuevo',
            'PUT /alumnos/:id - Actualizar',
            'DELETE /alumnos/:id - Eliminar',
            'GET /alumnos/estado/:estado - Filtrar por estado'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Ejercicio 2 (Simplificado) ejecutándose en http://localhost:${PORT}`);
});
