const express = require('express');
const router = express.Router();
const FilesController = require('../controllers/files.controllers');

router.post(
  '/users',
  /*  
        #swagger.tags = ['Dev']  
       
    */
  FilesController.insertUsersWithExcel,
);
router.get(
  '/users',
  /*  
        #swagger.tags = ['Dev']  
       
    */
  FilesController.downloadUsersExcel,
);

module.exports = router;
