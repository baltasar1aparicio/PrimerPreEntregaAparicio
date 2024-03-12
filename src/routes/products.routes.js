import { Router } from "express";
import productModel from "../models/product.js";

const productsRouter = Router()

productsRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query
        const prods = await productModel.find().lean()
        const limite = parseInt(limit)
        if (typeof limite !== 'undefined' && !isNaN(limite) && limite > 0) {
            const prodsLimit = prods.slice(0, limite)
            res.status(200).render('templates/home', {
                mostrarProductos: true,
                productos: prodsLimit,
                css: 'home.css'
            })
        } else {
            res.status(400).send('Error: Por favor, ingrese un valor numérico válido')

        }
    } catch (error) {
        res.status(500).render('templates/error', {
            error: true,
        })
    }
})

productsRouter.get('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const prod = await productModel.findById(idProducto)
        if(prod) {
            res.status(200).send(prod)
        } else {
            res.status(404).send(`Producto no existe`)
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto ${error}`)
    }

})

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        const mensaje = await productModel.create(product)
        res.status(201).send(mensaje)

    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto ${error}`)
    }
})

productsRouter.put('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const updateProduct = req.body
        const prod = await productModel.findByIdAndUpdate(idProducto, updateProduct)
        res.status(200).send(prod)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al actualizar producto ${error}`)
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        const mensaje = await productModel.findByIdAndDelete(idProducto)
        res.status(200).send(mensaje)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto ${error}`)
    }
})

export default productsRouter