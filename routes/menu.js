const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { isAuth, isAdmin } = require('../middleware/auth');
const MenuModel = require('../models/MenuModel');

router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuModel.fetchAll();
    res.render('menu', {
      pageTitle: 'Our Menu',
      path: '/menu',
      menuItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      pageTitle: 'Error',
      path: '/menu',
      error: 'An error occurred while fetching the menu',
    });
  }
});

router.get(
  '/manage',
  isAuth,
  isAdmin,
  menuController.getManageMenu.bind(menuController)
);
router.post(
  '/add',
  isAuth,
  isAdmin,
  menuController.addMenuItem.bind(menuController)
);
router.post(
  '/edit/:id',
  isAuth,
  isAdmin,
  menuController.editMenuItem.bind(menuController)
);
router.post(
  '/delete/:id',
  isAuth,
  isAdmin,
  menuController.deleteMenuItem.bind(menuController)
);

module.exports = router;
