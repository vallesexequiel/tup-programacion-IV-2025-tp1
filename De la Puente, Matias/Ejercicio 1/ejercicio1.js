const express = require('express');
const app = express();
const PORT = 3001;


app.use(express.json());

let rectangulos = [];


const calcularPerimetro = (ancho, alto) => 2 * (ancho + alto);
const calcularSuperficie = (ancho, alto) => ancho * alto;
const esCuadrado = (ancho, alto) => ancho === alto;

// GET /rectangulos - Obtener todos
app.get('/rectangulos', (req, res) => {
    const rectangulosConCalculos = rectangulos.map(rect => ({
        id: rect.id,
        ancho: rect.ancho,
        alto: rect.alto,
        perimetro: calcularPerimetro(rect.ancho, rect.alto),
        superficie: calcularSuperficie(rect.ancho, rect.alto),
        tipo: esCuadrado(rect.ancho, rect.alto) ? 'cuadrado' : 'rectángulo'
    }));
    
    res.json(rectangulosConCalculos);
});

// GET /rectangulos/:id - Obtener uno específico
app.get('/rectangulos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const rectangulo = rectangulos.find(rect => rect.id === id);
    
    if (!rectangulo) {
        return res.status(404).json({ error: 'Rectángulo no encontrado' });
    }
    
    res.json({
        id: rectangulo.id,
        ancho: rectangulo.ancho,
        alto: rectangulo.alto,
        perimetro: calcularPerimetro(rectangulo.ancho, rectangulo.alto),
        superficie: calcularSuperficie(rectangulo.ancho, rectangulo.alto),
        tipo: esCuadrado(rectangulo.ancho, rectangulo.alto) ? 'cuadrado' : 'rectángulo'
    });
});

// POST /rectangulos - Crear nuevo
app.post('/rectangulos', (req, res) => {
    const { ancho, alto } = req.body;

    if (!ancho || !alto || ancho <= 0 || alto <= 0) {
        return res.status(400).json({ error: 'Ancho y alto deben ser números positivos' });
    }
    
    const nuevoRectangulo = {
        id: rectangulos.length + 1,
        ancho: parseFloat(ancho),
        alto: parseFloat(alto)
    };
    
    rectangulos.push(nuevoRectangulo);
    
    res.json({
        id: nuevoRectangulo.id,
        ancho: nuevoRectangulo.ancho,
        alto: nuevoRectangulo.alto,
        perimetro: calcularPerimetro(nuevoRectangulo.ancho, nuevoRectangulo.alto),
        superficie: calcularSuperficie(nuevoRectangulo.ancho, nuevoRectangulo.alto),
        tipo: esCuadrado(nuevoRectangulo.ancho, nuevoRectangulo.alto) ? 'cuadrado' : 'rectángulo'
    });
});

// PUT /rectangulos/:id - Actualizar
app.put('/rectangulos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { ancho, alto } = req.body;
    

    if (!ancho || !alto || ancho <= 0 || alto <= 0) {
        return res.status(400).json({ error: 'Ancho y alto deben ser números positivos' });
    }
    
    const indice = rectangulos.findIndex(rect => rect.id === id);
    if (indice === -1) {
        return res.status(404).json({ error: 'Rectángulo no encontrado' });
    }
    
    rectangulos[indice].ancho = parseFloat(ancho);
    rectangulos[indice].alto = parseFloat(alto);
    
    res.json({
        id: rectangulos[indice].id,
        ancho: rectangulos[indice].ancho,
        alto: rectangulos[indice].alto,
        perimetro: calcularPerimetro(rectangulos[indice].ancho, rectangulos[indice].alto),
        superficie: calcularSuperficie(rectangulos[indice].ancho, rectangulos[indice].alto),
        tipo: esCuadrado(rectangulos[indice].ancho, rectangulos[indice].alto) ? 'cuadrado' : 'rectángulo'
    });
});

// DELETE /rectangulos/:id - Eliminar
app.delete('/rectangulos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = rectangulos.findIndex(rect => rect.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ error: 'Rectángulo no encontrado' });
    }
    
    const rectanguloEliminado = rectangulos.splice(indice, 1)[0];
    res.json({ message: 'Rectángulo eliminado', data: rectanguloEliminado });
});

// Ruta de información
app.get('/', (req, res) => {
    res.json({
        message: 'API de Rectángulos - Versión Simplificada',
        endpoints: [
            'GET /rectangulos - Listar todos',
            'GET /rectangulos/:id - Obtener uno',
            'POST /rectangulos - Crear nuevo',
            'PUT /rectangulos/:id - Actualizar',
            'DELETE /rectangulos/:id - Eliminar'
        ]
    });
});
app.listen(PORT, () => {
    console.log(`Servidor Ejercicio 1 (Simplificado) ejecutándose en http://localhost:${PORT}`);
});
