const File = require('../models/file');

exports.getFiles = async (req, res) => {
    try {
        const { userId, folderId } = req.query;
        const files = await File.find({ userId, folderId });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des fichiers", error });
    }
};


exports.getFileById = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({ message: "Fichier non trouvé" });
        }

        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du fichier", error });
    }
};


exports.createFile = async (req, res) => {
    try {
        const { userId, folderId, name, content } = req.body;

        // Vérifiez si les données requises sont présentes
        if (!userId || !folderId || !name) {
            return res.status(400).json({ message: "Les champs userId, folderId et name sont requis." });
        }

        // Vérifiez si les identifiants sont au bon format
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(400).json({ message: "userId ou folderId est invalide." });
        }

        // Créez le fichier
        const newFile = new File({
            userId,
            folderId,
            name,
            content: content || '' // Définit un contenu par défaut si non fourni
        });

        // Sauvegardez le fichier dans la base de données
        await newFile.save();

        // Retournez le fichier créé
        res.status(201).json(newFile);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du fichier", error });
    }
};


exports.updateFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const updatedFile = await File.findByIdAndUpdate(
            id,
            content,
            { new: true }
        );
        res.status(200).json(updatedFile);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du fichier", error });
    }
};


exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        await File.findByIdAndDelete(id);
        res.status(200).json({ message: "Fichier supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du fichier", error });
    }
};