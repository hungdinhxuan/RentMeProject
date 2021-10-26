const User = require('../models/users.models');
const Transaction = require('../models/transactions.models');
const argon2 = require('argon2');
const { multer } = require('../utils/config');
const multerLib = require('multer');
const Transfer = require('../models/transfers.models');
const { cloudinary, upload } = require('../services/multer');
const PlayerProfile = require('../models/player_profiles.models')

/* 
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWOlokKNWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWNKkolOWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWO;.';cld0NWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWN0dlc;'.;OWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWKc,;';olc:cd0NWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWN0dc:clo;';,cKWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWNo,cl:';oxdlc:cdKWWWWWWWWWWWWWWWWWWWWWWWWWWWNKdc:coddo;':lc,oNWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWO;;lll:':dddddl::lONWWWWWWWWWWWWWWWWWWWWWWXkl;:lddxdd:':lll;;OWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWNo,cllol,'ldddxddl:;cxXWWWWWWWWWWWWWWWWWWXxc;:lddddddl',llllc,oNWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWK:;lllll:.;dddddxddl:,:kNWWWWWWWWWWWWWWXk:,:lddxdddxo;':lllll;:KWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWk;;lllllc',oxddddddool;,ck0XNWWWWWWNX0kc,;llodddxdddo,'clllll:;kWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWx,:lllllc'.:odddddxdoll:',:lodxkkxdol:,':lloddxddxxo:.'collll:,xWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWNd,:ollll:'.,oxddddddolc;;ldddoooloodddl;;cloddxddddo,.':lllll:,dNWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWNo':lllllc;';oxdddxdolc;:oddddddddddddddl:;cloddxdxdo;';clllll:'oNWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWd':llllllc;cdxdddddlc;codxddddddddddddddoc;cldddddxdc;cllllll:'dWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWx,;llllll:cdxdxdddlcclddddddddddddddddddddlccldddddxd::llllll;'xWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWO,,llllllloddddddoloddddddddddddddddddddddddoooddddddolllloll,,OWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWK:'clllllddxdddddddddddddddddddddddddddddddxddddddddxddlllllc':KWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWNd';ll:coddddddddxdddddddddddddddddddddddddddxxddddddddoc:ll;'dNWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWO;':::odddddddxdddxddddddddddddddddddddddxdddxdddxdddxdo:::';OWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWNo.':oddddxddddddddddddddddddddxdddddxxddddddxddddddddxdo:'.oNWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWx;:ddddddddddddddddddddddddddddddddxddddddddddddddddddddd:;xWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWNkcldddddddddddddddddddddxddxddddddddddddxxddddddddddddddxddlckNWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWNd:lddddddddddddddddddddddxddxdooooddddddddxdxxddddddddddddxddl:dNWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWXo;ldddxddddddddddddddddddodddddollodddddoddxdddddddddxdddxddxddc;oXWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWXl,cdddddddxxddl:,,,,,,;coolodddoc::codxdolooc;,,,,,,:ldddddddddddc,lXWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWKl':dxddddddxdddlc;'',....';:codol:,,:lodoc:;''...,'';cldddddddddddd:'lKWWWWWWWWWWWWWW
WWWWWWWWWWWWWKl.,odddddddxddddlldoc;,'''...,cc;;;::;;:cc,...''',;codllddxdddddddddo,.lKWWWWWWWWWWWWW
WWWWWWWWWWWWKl..:oddddddddddddc,:lolccc:,...',;coddol;,'...,:ccclol:,cdxddddddddddo:..lXWWWWWWWWWWWW
WWWWWWWWWWWWO,..';;:clooddddddo:'',,;,,...';lodddxddddoc;'..',,;,,'':odxddddoolc:;,'..,OWWWWWWWWWWWW
WWWWWWWWWWWWXx:...''''',:cloddddl:,,'...;;,cddxdddxdddddc,;;...',,:lddddolc;,'''''...:xXWWWWWWWWWWWW
WWWWWWWWWWWWWWXl.'oOkdoc:;,,:coddolc:;,,lo:;oxxddddddddo;:ol,';:cloddoc:,,;:codkOo'.lXWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWO,.cOXKKKKOxoc;;:clllooc,:do;:dddddddxxd:;ldc,coolllc:;;coxOKKKXXOc.,OWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWXl.'xNNNXXXXKK0xl:;clddo:;odl;lddxdddddl;ldl;:odolc;:lx0KXXXXNNNNx'.lXWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWO,.:KMMMWWWNXXXKOdc;:lol;:ddc:llllllol:cdd:;lol:;cdOKXXXNWWWMMMKc.,OWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWNo..dXNNNWWWWWWNXX0xc;cl:;ldo:cx0XX0xc:odl;clc;cx0KXNNWWWWWNNNXd..lNWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWW0:.';;;;::clodkO0KK0d::c::ccxXWWWWWWXxcc::c::d0KK0Oxdolc::;;;;'.:0WWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWKo:,..;odddoollooodkkl;;,;xkdlccccldkx;,::lkkdooolloooddo;..,:oKWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWNKd,'lOKKXXKKK0kdoooc,,dd'........'dd,,looodk0KKXKXXKOl',dKNWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWW0l';dKXXXXXXKKKOxl';Ox'........'xO;'lxOKXKXXXXXXKd;'l0WWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWNk:'cONWWWWWNNXXO;,d0xl:,'',:lx0d,;OXXNNNWWWWNOc':kNWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWXx;,lKWMMMMMWWXklclcloooodolllclkXWWMMMMMWKo,;xXWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWXx;,oKWMMMMMMWXK0koodxxdook0KNWMMMMMMWKo,;dXWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWXx;;oKWMMMMMMWXXK0OOOO0KXXWMMMMMMWKo;;dXWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWXx:;l0NMMMMMWNXKKKXKKXNWMMMMMN0l;:xXWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWNOl;ckXWMMMWNXKKKKXNWMMMWXkc;lONWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWNKdccd0NMMWNXKKXNWMMN0dccdKNWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWN0dlld0NWNXXNWN0dlld0NWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWN0xoooddddooox0NWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWX0kxxk0XWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                                      Author: ĐINH XUÂN HÙNG
*/

class UsersController {
  async getOne(req, res) {
    const id = req.params.id;
    if (req.user._id == id) {
      return res.send(req.user);
    }
    try {
      const user = await User.findById({ _id: id });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'User not found' });
      }
      return res.send(user);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }
  async getAll(req, res) {
    const { page, limit } = req.query;
    let { deleted } = req.body;
    deleted = deleted === 'true';
    let users;
    if (page) {
      /// Find all users including deleted

      let skip = (page - 1) * limit;

      try {
        users = deleted
          ? await User.findWithDeleted().skip(skip).limit(limit)
          : await User.find().skip(skip).limit(limit);
        return res.json(users);
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Internal Server Error' });
      }
    }
    try {
      users = deleted ? await User.findWithDeleted() : await User.find();
      return res.send(users);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Some error occurred while retrieving data',
        error,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { password, newPassword } = req.body;

      const { _id } = req.user;
      const user = await User.findOne({ _id });
      const status = await argon2.verify(user.password, password);
      if (status) {
        if (password === newPassword) {
          return res.status(400).json({
            success: false,
            message: 'New Password must be different with old password',
          });
        }
        const hashPassword = await argon2.hash(newPassword);
        await User.findByIdAndUpdate(_id, { password: hashPassword });
        return res.json({
          success: true,
          message: 'Password updated successfully',
        });
      }
      return res.json({
        success: false,
        message: 'Password you typed is incorrect',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }

  async changeAvatar(req, res) {
    upload(
      multer.mimeTypes.image,
      multer.multerError.image,
      multer.multerFileSizeLimit,
    )
      .cloudinary()
      .single('image')(req, res, async (err) => {
      if (err instanceof multerLib.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);

        return res.status(400).json({
          success: false,
          err,
          //   message: "Tổng dung lượng file upload phải nhỏ hơn 10 MB",
          message: `File size limit exceeded please try again, file size must be <= ${multer.multerFileSizeLimit}`,
        });
      } else if (err) {
        // An unknown error occurred when uploading.

        console.log(err);
        return res.status(400).json({
          success: false,
          err,
          message: multer.multerError.image,
          // "Định dạng file không hợp lệ, Chỉ .png, .jpg và .jpeg được cho phép",
        });
      }

      //Check if files exist
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: 'No picture attached!' });
      //map through images and create a promise array using cloudinary upload function

      const { id } = req.params;

      function cloudinaryDone(error, result) {
        if (error) {
          console.log('Error in cloudinary.uploader.upload_stream\n', error);
          return res.status(500).json({
            success: false,
            message: 'Error in cloudinary.uploader.upload_stream',
          });
        }
        User.findByIdAndUpdate(
          req.user._id,
          { avatar: result.secure_url },
          (err, data) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message || 'Internal Server Error',
              });
            }
            return res.json({ success: true, newAvatar: data.avatar });
          },
        );
        console.log(result);
      }
      // console.log(req.file);
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: 'rentme',
            filename_override: `${req.user._id}_avatar`,
            unique_filename: false,
          },
          cloudinaryDone,
        )
        .end(req.file.buffer);
    });
  }

  async changeUserInfo(req, res) {
    const { fullName, nickname, birthDate, gender, province } = req.body;

    console.log(req.body);
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          fullName,
          nickname,
          birthDate: new Date(birthDate),
          gender,
          province,
        },
        { new: true },
      );
      console.log(user);
      return res.json({ success: true, message: 'Update successful', user });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }

  async createUser(req, res) {
    const { username, password, email, fullName, role } = req.body;
    try {
      const hashPassword = await argon2.hash(password);
      const user = await User.create({
        username,
        password: hashPassword,
        email,
        fullName,
        role,
      });
      return res
        .status(201)
        .json({ success: true, message: 'Created user', user });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }

  async softDelete(req, res) {
    const { id } = req.params;
    try {
      if (id == req.user._id) {
        return res
          .status(400)
          .json({ success: false, message: 'You cannot delete yourself !!!' });
      }
      await User.delete({ _id: id });
      return res
        .status(200)
        .json({ success: true, message: `User ${id} is moved to bin !!` });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }
  u;

  // Transactions

  async transact(req, res) {
    const { money, type, paymentMethod } = req.body;
    new Transaction({
      userId: req.user._id,
      money,
      type,
      paymentMethod,
    }).save((err, transaction) => {
      if (err) {
        if (err.message) {
          // error because new Error()
          return res.status(500).json({ success: false, message: err.message });
        }
        return res.status(500).json(err);
      } else {
        return res.status(201).json({
          success: true,
          transaction,
          message: `${type} successfully !!`,
        });
      }
    });
  }
  async getUserTransactions(req, res) {
    try {
      const transactions = await Transaction.find({ userId: req.user._id });
      return res.status(200).json({ success: true, transactions });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }

  async getTransfers(req, res) {
    try {
      const userId = req.user._id;
      const transfers = await Transfer.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate({ path: 'sender', ref: 'users', select: 'fullName' })
        .populate({ path: 'receiver', ref: 'users', select: 'fullName' });
      return res.status(200).send(transfers);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error,
      });
    }
  }
  
}

module.exports = new UsersController();
