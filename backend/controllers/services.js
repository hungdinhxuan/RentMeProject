const Service = require('../models/services.models');

class ServicesController {
  async getOne(req, res) {
    const id = req.params.id;
    try {
      const service = await Service.findById({ _id: id });
      if (!service) {
        return res
          .status(400)
          .json({ success: false, message: 'Service not found' });
      }
      return res.json({ success: true, message: 'Service found', service });
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
    let services;
    if (page) {
      let skip = (page - 1) * PAGE_SIZE;
      try {
        services = await Service.find().skip(skip).limit(limit);
        return res.json({ success: true, services });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Internal Server Error' });
      }
    }
    try {
      services = await Service.find();
      return res.json({ success: true, services });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }
  async update(req, res) {}

  async create(req, res) {
    let { name, desc, picture } = req.body;
    try {
      const service = await Service.create({ name, desc, picture });
      return res.status(201).json({
        success: true,
        service,
        message: 'created service successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async update(req, res) {
    let { _id, name, desc, picture } = req.body;
    try {
      const service = await Service.findByIdAndUpdate(_id, {
        name,
        desc,
        picture,
      });
    } catch (error) {}
  }
}

module.exports = new ServicesController();
