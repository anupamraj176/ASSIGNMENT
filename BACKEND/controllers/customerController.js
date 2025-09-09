const Customer = require('../models/customer');
const Lead = require('../models/lead');

// Get all customers for the logged-in user
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ ownerId: req.user.id });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Ensure the customer belongs to the logged-in user
    if (customer.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  const { name, email, phone, company } = req.body;

  try {
    const newCustomer = new Customer({
      name,
      email,
      phone,
      company,
      ownerId: req.user.id,
    });

    const customer = await newCustomer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a customer (and associated leads)
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete associated leads
    await Lead.deleteMany({ customerId: req.params.id });

    await customer.deleteOne();
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get leads for a specific customer
exports.getCustomerLeads = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const leads = await Lead.find({ customerId: req.params.id });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
