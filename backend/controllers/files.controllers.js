const xlsx = require('xlsx');
const multer = require('multer');
const User = require('../models/users.models');
const argon2 = require('argon2');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.includes('excel') ||
      file.mimetype.includes('spreadsheetml')
    ) {
      cb(null, true);
    } else {
      cb('Please upload only excel file.', false);
    }
  },
});
class FilesController {

  insertUsersWithExcel(req, res) {
      
    upload.single('file')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res
          .status(500)
          .send({ err, message: 'Multer error occurred when uploading' });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).send(err);
      }

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let users = [];
      let user = {};
      console.log(workbook);
      for (let cell in worksheet) {
        const cellAsString = cell.toString();
        // console.log(cellAsString);

        if (cellAsString[0] === 'A') {
          user.username = worksheet[cell].v;
        }
        if (cellAsString[0] === 'B') {
          user.password = await argon2.hash(worksheet[cell].v);
        }
        if (cellAsString[0] === 'C') {
          user.email = worksheet[cell].v;
        }
        if (cellAsString[0] === 'D') {
          user.fullName = worksheet[cell].v;
        }
        if (cellAsString[0] === 'E') {
          user.role = worksheet[cell].v;
          users.push(user);
            user = {};
        }
      }

      console.log(users);
      if (!users) {
        res
          .status(500)
          .json({
            message:
              'Data is not valid, (Colums must be username, password, email, fullName, role)Please check it again',
          });
      }
      /// remove header
      users.shift();
      
      try {
        const value = await User.insertMany(users);
        return res.status(200).send({ message: 'Uploaded', users: value });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Data is not valid, Please check it again',
          err,
        });
      }
    });
  }
  async downloadUsersExcel(req, res) {
    const workBook = xlsx.utils.book_new();
    try {
      const users = await User.find().lean();
      const dataToWrite = [];
      for (let index = 0; index < users.length; index++) {
        let data = [];
        for (let key of Object.keys(users[index])) {
          data.push(users[index][key].toString());
        }
        //   console.log(data);
        dataToWrite.push(data);
      }

      //   console.log(dataToWrite);
      const workSheetName = 'Users';
      const workSheetColumnNames = Object.keys(users[0]);
      const workSheetData = [workSheetColumnNames, ...dataToWrite];
      const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
      xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);

      const buffer = xlsx.write(workBook, { type: 'buffer' });
      // console.log(buffer);
      res.write(buffer);
      res.end();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error || 'Internal Server Erorr',
      });
    }
  }
}

module.exports = new FilesController();
