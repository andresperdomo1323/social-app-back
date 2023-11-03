const uploadModel = require("../models/upload");
const PUBLIC_URL = process.env.PUBLIC_URL;
/**
 * Obtiene una lista de elementos.
 * @param {object} req
 * @param {object} res
 */
const getItems = async (req, res) => {
    const data = await uploadModel.find({})
    res.send({ data });
};

/**
 * Obtiene un elemento específico.
 * @param {object} req
 * @param {object} res
 */
const getItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        const item = await uploadModel.findById(itemId);

        if (!item) {
            return res.status(404).json({ error: "Elemento no encontrado" });
        }

        res.json({ data: item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el elemento" });
    }
};

/**
 * Crea un nuevo elemento.
 * @param {object} req
 * @param {object} res
 */
const createItem = async (req, res) => {
    const { file } = req
    console.log(file);
  
    if (!file) {
        return res.status(400).json({ error: "No se proporcionó un archivo válido" });
    }

    const fileData = {
        filename: file.key,
        url: `${PUBLIC_URL}/${file.key}`
    }

    const data = await uploadModel.create(fileData);
    res.send({ data });
};

/**
 * Actualiza un elemento existente.
 * @param {object} req
 * @param {object} res
 */
const updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const updateData = req.body;

        const item = await uploadModel.findByIdAndUpdate(itemId, updateData, { new: true });

        if (!item) {
            return res.status(404).json({ error: "Elemento no encontrado" });
        }

        res.json({ data: item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el elemento" });
    }
};

/**
 * Elimina elementos.
 * @param {object} req
 * @param {object} res
 */
const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const result = await uploadModel.findByIdAndDelete(itemId);

        if (!result) {
            return res.status(404).json({ error: "Elemento no encontrado" });
        }

        res.json({ message: "Elemento eliminado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el elemento" });
    }
};


module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
