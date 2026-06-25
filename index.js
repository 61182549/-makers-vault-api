// ============================================
// SERVICIO REST - Maker's Vault API
// Archivo: index.js
// ============================================

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// --- CONEXIÓN A MONGODB ATLAS ---
const MONGO_URI =
  'mongodb+srv://61182549_db_user:9Cqy7AaVQp6KvjBL@cluster0.6rtyzaz.mongodb.net/?appName=Cluster0'

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión:', err))

// --- MODELO DE VAULT_ITEMS ---
const vaultItemSchema = new mongoose.Schema({
  uid_usuario: String,
  nombre: String,
  categoria: String,
  cantidad: Number,
  ubicacion: String,
  precio_unitario: Number,
  descripcion: String,
  fecha_creacion: { type: Date, default: Date.now },
})

const VaultItem = mongoose.model('VaultItem', vaultItemSchema)

// --- MODELO DE USUARIOS ---
const usuarioSchema = new mongoose.Schema({
  uid: String,
  email: String,
  nombre: String,
  fecha_registro: { type: Date, default: Date.now },
})

const Usuario = mongoose.model('Usuario', usuarioSchema)

// --- ENDPOINTS ---

// GET - raíz
app.get('/', (req, res) => {
  res.json({ mensaje: "⚡ Maker's Vault API funcionando" })
})

// POST - login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Campos obligatorios' })
  }
  res.status(200).json({
    status: 'success',
    mensaje: 'Login exitoso',
    uid: 'user_001',
  })
})

// GET - obtener componentes
app.get('/api/vault/items', async (req, res) => {
  try {
    const items = await VaultItem.find()
    res.status(200).json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST - agregar componente
app.post('/api/vault/items', async (req, res) => {
  try {
    const item = new VaultItem(req.body)
    await item.save()
    res.status(201).json({
      status: 'success',
      mensaje: 'Componente registrado exitosamente',
      data: item,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET - obtener usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find()
    res.status(200).json(usuarios)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --- ARRANCAR SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})
