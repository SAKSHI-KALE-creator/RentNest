const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  getAllUsersAdmin,
  updateUserRole,
  deleteUserAdmin,
  getAllBookingsAdmin
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and 'admin' role
router.use(protect, authorize('admin'));

router.get('/dashboard', getAdminDashboardStats);
router.get('/properties', getAllPropertiesAdmin);
router.put('/properties/:id/status', updatePropertyStatus);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserAdmin);
router.get('/bookings', getAllBookingsAdmin);

module.exports = router;
