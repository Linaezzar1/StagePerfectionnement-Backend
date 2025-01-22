const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async(req, res) => {
    let data = req.body;

    try {
        let existingUser = await User.findOne({email: data.email});
        if (existingUser){
            return res.status(400).send('Email déjà utilisé.');
        }

        let user = new User(data);

        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(data.password, salt);

        let savedUser = await user.save();
        res.status(200).send(savedUser);
        
    } catch (error) {
        console.log('Erreur lors de la creation du compte :' , error);
        res.status(500).send('Erreur lors de la création du compte.');

    }
};

exports.login = (req,res) => {
    let data = req.body;
    User.findOne ({email:data.email})
    .then ((user)=> {
        if (!user){
            return res.status(400).send('Mail invalid');
        }
        bcrypt.compare(data.password, user.password , (err,valid) => {
            if (err) return res.status(500).send('Error occurred: ' + err.message);
            if (!valid) return res.status(400).send('Password invalid!');

            let payload = {
                _id: user._id,
                email: user.email,
                name : user.name,
                lastname : user.lastname,
                role: user.role
            };

            let token = jwt.sign(payload, '123456789');
            res.status(200).send({mytoken: token , user:user});
        });
    })
    .catch((err)=> {
        res.status(400).send('Error occurred:' + err.message);
    });
};

exports.getAllUsers = (req, res) => {
    User.find({})
    .then((users) => {
        res.status(200).send(users);
    })
    .catch((err) => {
        res.status(400).send(err);
    });
};

exports.getUserById = (req, res) => {
    const id = req.params.id;

    User.findOne({_id : id})

    User.findOne({_id : id})
    .then((user) => {
        if (!user) return res.status(404).send({message : 'User not found'});
        res.status(200).send(user);
    })
    .catch((err)=> {
        res.status(500).send({error : 'An error occurred while fetching the user'})
    });
}

exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};


exports.resetPassword = async(req,res) => {
    const {currentPassword , newPassword} = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findOne({_id : userId});
        if (!user){
            return res.status(404).json({message : 'Current password is incorrect!'});
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid){
            return res.status(400).json({message : 'Current password is incorrect!'});
        }

        if (currentPassword === newPassword){
            return res.status(400).json({message : 'New password cannot be the same as the current password!'});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.status(200).json({message : 'Password has been reset successfully!'});
        
    } catch (error) {
        console.error('Error while resetting password:' , error);
        return res.status(500).json({message : 'Error while resetting password' , error: error.message})
    }
}

exports.updateActiveStatus = async (req, res) => {
    const { userId, isActive } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.ActiveStatus = isActive ? 'Active' : 'Inactive';
      await user.save();
  
      res.status(200).json({ message: 'Active status updated successfully' });
    } catch (error) {
      console.error('Error updating active status:', error);
      res.status(500).json({ message: 'Error updating active status' });
    }
  };

  