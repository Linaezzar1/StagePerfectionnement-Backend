const express = require('express');
const folderController = require('../controllers/folderController');

const router = express.Router();
const auth = require('../middleware/auth');


router.get('/getFolders', folderController.getFolders);
router.get('/getFolderById/:id', folderController.getFolderById);


router.post('/addFolder',auth, folderController.createFolder);

router.put('/updateFolder/:id', folderController.updateFolder);


router.delete('/deleteFolder/:id', folderController.deleteFolder);

module.exports = router;