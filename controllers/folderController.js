const Folder = require('../models/folder'); 
const File = require('../models/file');

// Obtenir tous les dossiers
exports.getFolders = async (req, res) => {
    try {
      const folders = await Folder.find(); 
      res.status(200).json(folders);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des dossiers.', error });
    }
};

// Obtenir un dossier par ID
exports.getFolderById = async (req, res) => {
    const { id } = req.params;

    try {
        const folder = await Folder.findById(id);
        if (!folder) {
            return res.status(404).json({ message: 'Dossier introuvable.' });
        }

        // Récupérer les fichiers associés au dossier
        const files = await File.find({ folder: id });

        res.status(200).json({ folder, files });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du dossier.', error });
    }
};


// Créer un nouveau dossier
exports.createFolder = async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Le nom du dossier est requis.' });
    }
    try {
      const newFolder = new Folder({ name });
      await newFolder.save();
      res.status(201).json(newFolder);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création du dossier.', error });
    }
};

// Mettre à jour un dossier
exports.updateFolder = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Le nom du dossier est requis pour la mise à jour.' });
    }
  
    try {
      const updatedFolder = await Folder.findByIdAndUpdate(id, { name }, { new: true });
      if (!updatedFolder) {
        return res.status(404).json({ message: 'Dossier introuvable.' });
      }
      res.status(200).json(updatedFolder);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour du dossier.', error });
    }
  };

  // Supprimer un dossier et tous ses fichiers
exports.deleteFolder = async (req, res) => {
    const { id } = req.params;
  
    try {
      const folder = await Folder.findById(id);
      if (!folder) {
        return res.status(404).json({ message: 'Dossier introuvable.' });
      }
  
      // Supprimer tous les fichiers associés au dossier
      await File.deleteMany({ folder: id });
  
      // Supprimer le dossier
      await Folder.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Dossier et ses fichiers supprimés avec succès.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression du dossier.', error });
    }
  };
  