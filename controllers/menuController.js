const BaseController = require('./baseController');
const MenuModel = require('../models/MenuModel');

class MenuController extends BaseController {
  constructor() {
    super();
  }

  async render(res, view, options = {}) {
    try {
      const menuItems = await MenuModel.fetchAll();
      super.render(res, view, {
        menuItems,
        pageTitle: 'Menu Management',
        path: '/menu',
        ...options,
      });
    } catch (error) {
      this.handleError(error, null, res, null);
    }
  }

  async getManageMenu(req, res) {
    try {
      this.render(res, 'manage-menu');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async addMenuItem(req, res) {
    try {
      console.log(req.body);
      const validationRules = {
        name: {
          required: true,
          minLength: 2,
          maxLength: 50,
        },
        price: {
          required: true,
          type: 'number',
          min: 0,
        },
      };

      const validationErrors = this.validate(req.body, validationRules);
      if (validationErrors.length > 0) {
        return this.render(res, 'manage-menu', { errors: validationErrors });
      }

      const menuItem = new MenuModel({
        name: req.body.name.trim(),
        price: parseFloat(req.body.price),
      });

      await menuItem.save();
      this.redirectWithMessage(
        res,
        '/menu/manage',
        'Menu item added successfully'
      );
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async editMenuItem(req, res) {
    try {
      const validationRules = {
        name: { required: true },
        price: { required: true },
      };

      const validationErrors = this.validate(req.body, validationRules);
      if (validationErrors.length > 0) {
        return this.render(res, 'manage-menu', { errors: validationErrors });
      }

      // Convert price to number and validate
      const price = parseFloat(req.body.price);
      if (isNaN(price) || price <= 0) {
        return this.render(res, 'manage-menu', {
          errors: ['Price must be a valid positive number'],
        });
      }

      const menuItem = new MenuModel({
        id: req.params.id,
        name: req.body.name.trim(),
        price: price,
      });

      await menuItem.save();
      res.redirect('/menu/manage');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async deleteMenuItem(req, res) {
    try {
      await MenuModel.delete(req.params.id);
      res.redirect('/menu/manage');
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getAllMenu(req, res) {
    try {
      const menuItems = await MenuModel.fetchAll();
      res.render('menu', {
        menuItems,
        pageTitle: 'Our Menu',
        path: '/menu',
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}

module.exports = new MenuController();
