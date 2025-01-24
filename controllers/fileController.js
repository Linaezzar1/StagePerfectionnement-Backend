const File = require('../models/file');
const User = require('../models/user');
const moment = require('moment');

exports.getFiles = async (req, res) => {
    try {
        const files = await File.find();
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
        const { name, content, language  } = req.body;
        const userId = req.user._id;  


        // Créez le fichier
        const newFile = new File({
            userId,
            name,
            content: content || '', // Définit un contenu par défaut si non fourni,
            language: language
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
            {content},
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

exports.getFilesCountByUser = async (req, res) => {
    try {
      // Récupérer tous les fichiers et les informations des utilisateurs avec populate
      const files = await File.aggregate([
        {
          $group: {
            _id: "$userId", // Grouper par userId
            totalFiles: { $sum: 1 }, // Compter le nombre de fichiers
          }
        },
        {
          $lookup: {
            from: 'users', // Nom de la collection des utilisateurs
            localField: '_id', // Champ auquel l'ID correspond
            foreignField: '_id', // Champ dans la collection 'users' correspondant à localField
            as: 'userInfo'
          }
        },
        {
          $unwind: "$userInfo" // Décomposé l'objet 'userInfo'
        }
      ]);

      console.log(files);
      // Retourner la réponse avec les utilisateurs et leur nombre de fichiers
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors du comptage des fichiers', error });
    }
};

exports.countByMonth = async(req,res) => {
    try {
        const stats = await File.aggregate([
          {
            $project: {
              month: { $month: '$createdAt' },
            },
          },
          {
            $group: {
              _id: '$month',
              totalFiles: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);
    
        res.status(200).json(stats);
      } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques de fichiers créés', error });
      }
}

exports.modifiedstats = async (req, res) => {
  try {
    const stats = await File.aggregate([
      {
        $match: {
          $expr: { $ne: ['$createdAt', '$updatedAt'] } // Exclure les fichiers non modifiés
        }
      },
      {
        $project: {
          month: { $month: '$updatedAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          totalFiles: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques de fichiers modifiés', error });
  }
};


exports.getCreatedFilesThisWeek = async (req, res) => {
    try {
      const userId = req.user._id; // ID de l'utilisateur connecté

      console.log('User ID:', userId);

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID utilisateur invalide' });
      }
  
      const startOfWeek = moment().startOf('week').toDate(); // Début de la semaine
      const endOfWeek = moment(startOfWeek).endOf('week').toDate(); // Fin de la semaine
      console.log(startOfWeek);
      console.log(endOfWeek);
      
  
      const stats = await File.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId), 
            createdAt: { $gte: startOfWeek, $lte: endOfWeek }, // Filtrer par semaine en cours
          },
        },
        {
          $count: 'totalFiles',
        },
      ]);
  
      res.status(200).json(stats[0] || { totalFiles: 0 });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des fichiers créés cette semaine', error });
    }
  };

  exports.getModifiedFilesThisWeek = async (req, res) => {
  try {
    const userId = req.user._id; // ID de l'utilisateur connecté
    const startOfWeek = moment().startOf('week').toDate(); // Début de la semaine
    const endOfWeek = moment().endOf('week').toDate(); // Fin de la semaine

    const stats = await File.aggregate([
      {
        $match: {
            userId: mongoose.Types.ObjectId(userId),
          updatedAt: { $gte: startOfWeek, $lte: endOfWeek }, // Filtrer par semaine en cours
          $expr: { $ne: ['$createdAt', '$updatedAt'] }, // Exclure les fichiers non modifiés
        },
      },
      {
        $count: 'totalFiles',
      },
    ]);

    res.status(200).json(stats[0] || { totalFiles: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des fichiers modifiés cette semaine', error });
  }
};





