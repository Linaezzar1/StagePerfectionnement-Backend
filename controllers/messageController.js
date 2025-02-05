const Message = require('../models/message');

exports.createMessage = async (req, res) => {
    try {
        const { content, targetUserId } = req.body;

        if (!content) return res.status(400).json({ message: "Le contenu est requis." });

        const newMessage = new Message({
            sender: req.user.id, // User qui envoie
            targetUserId: targetUserId, // Destinataire
            content,
            timestamp: new Date()
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('userId', 'username')
            .populate('targetUserId', 'username')
            .sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMessageByUserId = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const messages = await Message.find({
        $or: [{ sender: userId }, { targetUserId: userId }]
      })
        .populate('sender', 'username')
        .populate('targetUserId', 'username')
        .sort({ timestamp: 1 });
  
      
  
      res.status(200).json(messages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
