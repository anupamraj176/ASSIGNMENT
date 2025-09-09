const Lead = require('../models/lead');
const Customer = require('../models/customer');

// Get all leads for the logged-in user
exports.getLeads = async (req, res) => {
  try {
    // Get all customer IDs owned by the user
    const userCustomers = await Customer.find({ ownerId: req.user.id }).select('_id');
    const customerIds = userCustomers.map(c => c._id);

    // Find leads linked to the user's customers
    const leads = await Lead.find({ customerId: { $in: customerIds } });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new lead
exports.createLead = async (req, res) => {
  const { customerId, title, description, status, value } = req.body;

  try {
    // Verify the customer belongs to the user
    const customer = await Customer.findById(customerId);
    if (!customer || customer.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to add lead to this customer' });
    }

    const newLead = new Lead({ customerId, title, description, status, value });
    const lead = await newLead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const customer = await Customer.findById(lead.customerId);
    if (!customer || customer.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const customer = await Customer.findById(lead.customerId);
    if (!customer || customer.ownerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
