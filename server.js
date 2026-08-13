const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = 3000;

// Enable CORS for local cross-origin queries (supporting file:// protocol frontend testing)
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// --- IN-MEMORY SESSION STORE ---
const sessions = new Map(); // token -> { user: 'admin', expires: Date }
const SESSION_EXPIRY = 2 * 60 * 60 * 1000; // 2 Hours

// --- INPUT SANITIZATION UTILITY (XSS Prevention) ---
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// --- AUTHENTICATION MIDDLEWARE ---
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token format must be Bearer <token>.' });
  }

  const token = parts[1];
  const session = sessions.get(token);

  if (!session || session.expires < new Date()) {
    if (session) sessions.delete(token); // Cleanup expired
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  // Extend session duration on activity
  session.expires = new Date(Date.now() + SESSION_EXPIRY);
  req.adminUser = session.user;
  next();
}

// --- STATUS NORMALIZATION HELPER ---
const normalizeStatus = (status) => {
  return String(status || '').trim().toLowerCase().replace(/\s+/g, '_');
};


// ==========================================
// 🛡️ PUBLIC ENDPOINTS
// ==========================================

// POST: Admin Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'om_chavan' && password === '123456') {
    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, {
      user: 'om_chavan',
      expires: new Date(Date.now() + SESSION_EXPIRY)
    });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid username or password.' });
});

// POST: Submit Inquiry (Public)
app.post('/api/inquiries', async (req, res) => {
  try {
    // Support both snake_case and camelCase parameters
    const full_name = (req.body.full_name || req.body.fullName || '').trim();
    const phone_number = (req.body.phone_number || req.body.mobileNumber || '').trim();
    const email = (req.body.email || req.body.emailAddress || '').trim();
    const state = (req.body.state || '').trim();
    const district = (req.body.district || '').trim();
    const interested_product = (req.body.interested_product || req.body.interestedProduct || '').trim();
    const crop_type = (req.body.crop_type || req.body.cropType || '').trim();
    const message = (req.body.message || req.body.inquiryMessage || '').trim();

    // Backend Validation
    if (!full_name) return res.status(400).json({ success: false, message: 'Full Name is required.' });
    if (!phone_number) return res.status(400).json({ success: false, message: 'Phone/Mobile Number is required.' });
    if (!state) return res.status(400).json({ success: false, message: 'State is required.' });
    if (!district) return res.status(400).json({ success: false, message: 'District is required.' });
    if (!interested_product) return res.status(400).json({ success: false, message: 'Interested Product is required.' });
    if (!message) return res.status(400).json({ success: false, message: 'Inquiry Message is required.' });

    if (!/^\d{10}$/.test(phone_number)) {
      return res.status(400).json({ success: false, message: 'Mobile number must contain exactly 10 digits.' });
    }

    // Duplicate Check (15 seconds)
    const existingInquiries = await db.getInquiries();
    const now = new Date();
    const isDuplicate = existingInquiries.some(inq => {
      const subTime = new Date(inq.created_at || inq.submissionDateTime);
      const inq_phone = inq.phone_number || inq.mobileNumber || '';
      const inq_name = inq.full_name || inq.fullName || '';
      const inq_msg = inq.message || inq.inquiryMessage || '';
      return (
        inq.is_deleted !== true &&
        inq_phone === phone_number &&
        inq_name.toLowerCase() === full_name.toLowerCase() &&
        inq_msg.toLowerCase() === message.toLowerCase() &&
        (now - subTime) / 1000 < 15
      );
    });

    if (isDuplicate) {
      return res.status(409).json({ success: false, message: 'Duplicate submission detected. Please wait a moment.' });
    }

    // Save using clean sanitized values
    const savedInquiry = await db.addInquiry({
      full_name: sanitizeInput(full_name),
      phone_number: phone_number,
      email: sanitizeInput(email),
      interested_product: sanitizeInput(interested_product),
      state: sanitizeInput(state),
      district: sanitizeInput(district),
      crop_type: sanitizeInput(crop_type),
      message: sanitizeInput(message)
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully.',
      inquiry_id: savedInquiry.id,
      inquiry: savedInquiry
    });

  } catch (err) {
    console.error('Inquiry submission failed:', err); // Log stack trace
    return res.status(500).json({ success: false, message: 'Unable to submit inquiry.' });
  }
});

// GET: Fetch Public Approved/Visible Feedback
app.get('/api/feedback/public', async (req, res) => {
  try {
    const feedbackList = await db.getFeedback();
    const approvedAndVisible = feedbackList.filter(fb => 
      normalizeStatus(fb.status) === 'approved' && 
      fb.is_visible === true &&
      fb.is_deleted !== true &&
      fb.is_archived !== true
    );
    
    // Sort newest first
    const sorted = approvedAndVisible.sort((a, b) => new Date(b.created_at || b.submissionDateTime) - new Date(a.created_at || a.submissionDateTime));
    
    // Project only safe fields (never expose customer phone numbers publicly)
    const projected = sorted.map(fb => ({
      id: fb.id,
      name: fb.customer_name || fb.name,
      district: fb.district,
      crop: fb.product_name || fb.crop,
      rating: fb.rating,
      text: fb.message || fb.text,
      submissionDateTime: fb.created_at || fb.submissionDateTime,
      is_default: fb.is_default,
      default_key: fb.default_key
    }));

    return res.json(projected);
  } catch (err) {
    console.error('Error in public feedback GET:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: Submit Feedback (Public)
app.post('/api/feedback', async (req, res) => {
  try {
    // Support both snake_case and camelCase parameters
    const customer_name = (req.body.customer_name || req.body.name || '').trim();
    const phone_number = (req.body.phone_number || req.body.mobileNumber || '').trim();
    const district = (req.body.district || '').trim();
    const product_name = (req.body.product_name || req.body.crop || '').trim();
    const rating = req.body.rating;
    const message = (req.body.message || req.body.text || '').trim();

    // Backend Validation
    if (!customer_name) return res.status(400).json({ success: false, message: 'Customer Name is required.' });
    if (!rating) return res.status(400).json({ success: false, message: 'Rating is required.' });
    if (!message) return res.status(400).json({ success: false, message: 'Feedback message is required.' });

    if (phone_number && !/^\d{10}$/.test(phone_number)) {
      return res.status(400).json({ success: false, message: 'Mobile number must contain exactly 10 digits.' });
    }

    const numericRating = parseInt(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    // Duplicate Check (15 seconds)
    const existingFeedback = await db.getFeedback();
    const now = new Date();
    const isDuplicate = existingFeedback.some(fb => {
      const subTime = new Date(fb.created_at || fb.submissionDateTime);
      const fb_phone = fb.phone_number || fb.mobileNumber || '';
      const fb_name = fb.customer_name || fb.name || '';
      const fb_msg = fb.message || fb.text || '';
      return (
        fb.is_deleted !== true &&
        fb_phone === phone_number &&
        fb_name.toLowerCase() === customer_name.toLowerCase() &&
        fb_msg.toLowerCase() === message.toLowerCase() &&
        (now - subTime) / 1000 < 15
      );
    });

    if (isDuplicate) {
      return res.status(409).json({ success: false, message: 'Duplicate submission detected. Please wait a moment.' });
    }

    // Save sanitized values as pending/hidden
    const savedFeedback = await db.addFeedback({
      customer_name: sanitizeInput(customer_name),
      phone_number: phone_number,
      district: sanitizeInput(district),
      product_name: sanitizeInput(product_name),
      rating: numericRating,
      message: sanitizeInput(message)
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted for review.',
      feedback_id: savedFeedback.id,
      feedback: savedFeedback
    });

  } catch (err) {
    console.error('Feedback submission failed:', err); // Log stack trace
    return res.status(500).json({ success: false, message: 'Unable to submit feedback.' });
  }
});


// ==========================================
// 🛡️ SECURE ADMIN ENDPOINTS (Requires Authorization)
// ==========================================

// GET: Summary Statistics
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const feedbackList = await db.getFeedback();
    const inquiries = await db.getInquiries();

    // Soft delete & Archive checks matching database safety defaults (null/undefined = false)
    const isDeleted = (item) => item.is_deleted === true;
    const isArchived = (item) => item.is_archived === true;

    const activeFeedback = feedbackList.filter(fb => !isDeleted(fb));
    const activeInquiries = inquiries.filter(inq => !isDeleted(inq));

    const totalFeedback = activeFeedback.length;
    const pendingFeedback = activeFeedback.filter(fb => normalizeStatus(fb.status) === 'pending').length;
    const approvedFeedback = activeFeedback.filter(fb => normalizeStatus(fb.status) === 'approved').length;
    const hiddenFeedback = activeFeedback.filter(fb => normalizeStatus(fb.status) === 'approved' && fb.is_visible !== true).length;

    const newInquiries = activeInquiries.filter(inq => normalizeStatus(inq.status) === 'new').length;
    
    // Unresolved includes: new, in_progress, contacted
    const unresolvedInquiries = activeInquiries.filter(inq => 
      ['new', 'in_progress', 'contacted'].includes(normalizeStatus(inq.status)) && !isArchived(inq)
    ).length;
    
    const resolvedInquiries = activeInquiries.filter(inq => normalizeStatus(inq.status) === 'resolved').length;

    return res.json({
      totalFeedback,
      pendingFeedback,
      approvedFeedback,
      hiddenFeedback,
      newInquiries,
      unresolvedInquiries,
      resolvedInquiries
    });
  } catch (err) {
    console.error('Error fetching admin statistics:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: View Feedback List (Admin Panel)
app.get('/api/admin/feedback', authenticateAdmin, async (req, res) => {
  try {
    const feedbackList = await db.getFeedback();
    
    const showTrash = req.query.trash === 'true';
    const showArchived = req.query.archived === 'true';

    const isDeleted = (item) => item.is_deleted === true;
    const isArchived = (item) => item.is_archived === true;

    let filtered = [];
    if (showTrash) {
      filtered = feedbackList.filter(fb => isDeleted(fb));
    } else if (showArchived) {
      filtered = feedbackList.filter(fb => isArchived(fb) && !isDeleted(fb));
    } else {
      // Regular active list (excludes archived and deleted)
      filtered = feedbackList.filter(fb => !isDeleted(fb) && !isArchived(fb));
    }

    const sorted = filtered.sort((a, b) => new Date(b.submissionDateTime) - new Date(a.submissionDateTime));
    
    // Unified Response Wrapper
    return res.json({
      success: true,
      records: sorted,
      total: sorted.length
    });
  } catch (err) {
    console.error('Error fetching admin feedback list:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH: Update Feedback Moderation Status / Visibility / Text / Soft state
app.patch('/api/admin/feedback/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, is_visible, text, is_deleted, is_archived } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (is_visible !== undefined) updates.is_visible = is_visible;
    if (text !== undefined) updates.text = sanitizeInput(text);
    if (is_deleted !== undefined) updates.is_deleted = is_deleted;
    if (is_archived !== undefined) updates.is_archived = is_archived;

    const updated = await db.updateFeedbackModeration(id, updates, req.adminUser);
    if (!updated) {
      return res.status(404).json({ error: 'Feedback record not found.' });
    }

    return res.json({
      message: 'Feedback updated successfully.',
      feedback: updated
    });
  } catch (err) {
    console.error('Error updating feedback moderation:', err);
    if (err.message === 'Invalid status value') {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Move single Feedback record to Trash (Soft delete)
app.delete('/api/admin/feedback/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db.updateFeedbackModeration(id, { is_deleted: true }, req.adminUser);
    if (!updated) {
      return res.status(404).json({ error: 'Feedback record not found.' });
    }
    return res.json({ message: 'Feedback moved to trash successfully.' });
  } catch (err) {
    console.error('Error soft deleting feedback:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Permanently erase single record from Trash (Physical delete)
app.delete('/api/admin/trash/:recordType/:recordId', authenticateAdmin, async (req, res) => {
  try {
    const { recordType, recordId } = req.params;

    let dbType = '';
    if (recordType === 'feedback') {
      dbType = 'feedback';
    } else if (recordType === 'inquiry' || recordType === 'inquiries') {
      dbType = 'inquiries';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid record type.' });
    }

    // 1. Fetch records and verify existence and soft-deleted status
    let success = false;
    if (dbType === 'feedback') {
      const feedbackList = await db.getFeedback();
      const record = feedbackList.find(fb => fb.id === recordId);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Record not found.' });
      }
      if (!record.is_deleted) {
        return res.status(400).json({ success: false, message: 'Only items in Trash can be permanently deleted.' });
      }
      
      // Create backup snapshot before permanent deletion
      await db.backupDatabaseBeforeDeletion(dbType);
      
      success = await db.deleteFeedbackPermanently(recordId);
    } else {
      const inquiriesList = await db.getInquiries();
      const record = inquiriesList.find(inq => inq.id === recordId);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Record not found.' });
      }
      if (!record.is_deleted) {
        return res.status(400).json({ success: false, message: 'Only items in Trash can be permanently deleted.' });
      }
      
      // Create backup snapshot before permanent deletion
      await db.backupDatabaseBeforeDeletion(dbType);
      
      success = await db.deleteInquiryPermanently(recordId);
    }

    if (!success) {
      return res.status(500).json({ success: false, message: 'Database error occurred.' });
    }

    // 2. Log activity
    const activityType = dbType === 'feedback' ? 'feedback' : 'inquiry';
    await db.addActivityLogEntry(req.adminUser, 'Permanently Deleted', activityType, recordId);

    return res.json({
      success: true,
      message: 'Record permanently deleted.'
    });

  } catch (err) {
    console.error('Error deleting record permanently:', err);
    return res.status(500).json({ success: false, message: 'Database error occurred.' });
  }
});

// GET: View Inquiries (Admin Panel)
app.get('/api/admin/inquiries', authenticateAdmin, async (req, res) => {
  try {
    const inquiries = await db.getInquiries();
    
    const showTrash = req.query.trash === 'true';
    const showArchived = req.query.archived === 'true';

    const isDeleted = (item) => item.is_deleted === true;
    const isArchived = (item) => item.is_archived === true;

    let filtered = [];
    if (showTrash) {
      filtered = inquiries.filter(inq => isDeleted(inq));
    } else if (showArchived) {
      filtered = inquiries.filter(inq => isArchived(inq) && !isDeleted(inq));
    } else {
      filtered = inquiries.filter(inq => !isDeleted(inq) && !isArchived(inq));
    }

    const sorted = filtered.sort((a, b) => new Date(b.submissionDateTime) - new Date(a.submissionDateTime));
    
    // Unified Response Wrapper
    return res.json({
      success: true,
      records: sorted,
      total: sorted.length
    });
  } catch (err) {
    console.error('Error fetching admin inquiries list:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH: Update Inquiry Status / Notes / Assigned Staff / Soft state
app.patch('/api/admin/inquiries/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo, is_deleted, is_archived } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = sanitizeInput(notes);
    if (assignedTo !== undefined) updates.assignedTo = sanitizeInput(assignedTo);
    if (is_deleted !== undefined) updates.is_deleted = is_deleted;
    if (is_archived !== undefined) updates.is_archived = is_archived;

    const updated = await db.updateInquiryDetails(id, updates, req.adminUser);
    if (!updated) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    return res.json({
      message: 'Inquiry details updated successfully.',
      inquiry: updated
    });
  } catch (err) {
    console.error('Error updating inquiry details:', err);
    if (err.message === 'Invalid status value') {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Move single Inquiry to Trash (Soft delete)
app.delete('/api/admin/inquiries/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db.updateInquiryDetails(id, { is_deleted: true }, req.adminUser);
    if (!updated) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    return res.json({ message: 'Inquiry moved to trash successfully.' });
  } catch (err) {
    console.error('Error soft deleting inquiry:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



// --- BULK ACTION ENDPOINT ---
app.post('/api/admin/bulk-action', authenticateAdmin, async (req, res) => {
  try {
    const { type, action, ids } = req.body;

    if (!type || !['feedback', 'inquiries'].includes(type)) {
      return res.status(400).json({ error: 'Invalid record type.' });
    }
    if (!action || !['archive', 'unarchive', 'trash', 'restore', 'delete_perm'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action type.' });
    }
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No record IDs provided.' });
    }

    let modifiedCount = 0;

    if (action === 'delete_perm') {
      // Verify all target items are already in trash
      if (type === 'feedback') {
        const feedbackList = await db.getFeedback();
        const invalid = ids.some(id => {
          const fb = feedbackList.find(x => x.id === id);
          return !fb || !fb.is_deleted;
        });
        if (invalid) {
          return res.status(400).json({ error: 'Only items in Trash can be permanently deleted.' });
        }
      } else {
        const inquiriesList = await db.getInquiries();
        const invalid = ids.some(id => {
          const inq = inquiriesList.find(x => x.id === id);
          return !inq || !inq.is_deleted;
        });
        if (invalid) {
          return res.status(400).json({ error: 'Only items in Trash can be permanently deleted.' });
        }
      }

      // 1. Back up database before bulk permanent deletion
      await db.backupDatabaseBeforeDeletion(type);

      // 2. Perform deletions
      for (const id of ids) {
        let success = false;
        if (type === 'feedback') {
          success = await db.deleteFeedbackPermanently(id);
        } else {
          success = await db.deleteInquiryPermanently(id);
        }
        if (success) modifiedCount++;
      }
      await db.addActivityLogEntry(req.adminUser, `bulk_permanently_deleted`, type, 'bulk', '', `Deleted ${modifiedCount} items`);
    } else {
      // Process updates (archive, restore, soft-delete)
      const updates = {};
      if (action === 'archive') updates.is_archived = true;
      if (action === 'unarchive') updates.is_archived = false;
      if (action === 'trash') updates.is_deleted = true;
      if (action === 'restore') {
        updates.is_deleted = false;
        updates.is_archived = false;
      }

      for (const id of ids) {
        let updated = null;
        if (type === 'feedback') {
          updated = await db.updateFeedbackModeration(id, updates, req.adminUser);
        } else {
          updated = await db.updateInquiryDetails(id, updates, req.adminUser);
        }
        if (updated) modifiedCount++;
      }
      await db.addActivityLogEntry(req.adminUser, `bulk_${action}d`, type, 'bulk', '', `Updated ${modifiedCount} items`);
    }

    return res.json({
      message: `Bulk operation '${action}' completed successfully.`,
      count: modifiedCount
    });

  } catch (err) {
    console.error('Error processing admin bulk action:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- SETTINGS CONFIG ENDPOINTS ---
app.get('/api/admin/config', authenticateAdmin, async (req, res) => {
  try {
    const config = await db.getConfig();
    return res.json(config);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve configuration.' });
  }
});

app.post('/api/admin/config', authenticateAdmin, async (req, res) => {
  try {
    const { trashRetentionDays, autoCleanupEnabled } = req.body;
    
    const config = {
      trashRetentionDays: parseInt(trashRetentionDays) || 30,
      autoCleanupEnabled: !!autoCleanupEnabled
    };

    await db.saveConfig(config);
    await db.addActivityLogEntry(req.adminUser, 'settings_updated', 'config', 'settings', '', `Retention: ${config.trashRetentionDays} days, Auto: ${config.autoCleanupEnabled}`);
    
    return res.json({ message: 'Settings saved successfully.', config });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save configuration.' });
  }
});

// --- AUDIT ACTIVITY LOG ENDPOINT ---
app.get('/api/admin/activity-log', authenticateAdmin, async (req, res) => {
  try {
    const logs = await db.getActivityLog();
    
    // Unified Response Wrapper
    return res.json({
      success: true,
      records: logs,
      total: logs.length
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch activity log.' });
  }
});

// --- STAFF WORKS & SALARY LOGGER ENDPOINTS ---
app.get('/api/admin/works', authenticateAdmin, async (req, res) => {
  try {
    const works = await db.getWorks();
    return res.json({
      success: true,
      records: works,
      total: works.length
    });
  } catch (err) {
    console.error('Error fetching admin works:', err);
    return res.status(500).json({ error: 'Failed to fetch work log.' });
  }
});

app.post('/api/admin/works', authenticateAdmin, async (req, res) => {
  try {
    const { workerName, workDetails, date, salary, status } = req.body;
    if (!workerName) {
      return res.status(400).json({ error: 'Worker name is required.' });
    }
    const newWork = await db.addWork({ workerName, workDetails, date, salary, status });
    await db.addActivityLogEntry(req.adminUser, 'Work Record Created', 'work', newWork.id, '', `Added work record for ${workerName}`);
    return res.json({ success: true, message: 'Work record created successfully.', record: newWork });
  } catch (err) {
    console.error('Error creating work record:', err);
    return res.status(500).json({ error: 'Failed to create work record.' });
  }
});

app.patch('/api/admin/works/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await db.updateWork(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Work record not found.' });
    }
    await db.addActivityLogEntry(req.adminUser, 'Work Record Updated', 'work', id, '', `Updated work record for ${updated.workerName}`);
    return res.json({ success: true, message: 'Work record updated successfully.', record: updated });
  } catch (err) {
    console.error('Error updating work record:', err);
    return res.status(500).json({ error: 'Failed to update work record.' });
  }
});

app.delete('/api/admin/works/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const works = await db.getWorks();
    const workItem = works.find(w => w.id === id);
    if (!workItem) {
      return res.status(404).json({ error: 'Work record not found.' });
    }
    const success = await db.deleteWork(id);
    if (success) {
      await db.addActivityLogEntry(req.adminUser, 'Work Record Deleted', 'work', id, '', `Deleted work record for ${workItem.workerName}`);
      return res.json({ success: true, message: 'Work record deleted successfully.' });
    }
    return res.status(500).json({ error: 'Failed to delete work record.' });
  } catch (err) {
    console.error('Error deleting work record:', err);
    return res.status(500).json({ error: 'Failed to delete work record.' });
  }
});

// --- GITHUB AUTO-UPDATE WEBHOOK & SYNC ENGINE ---
const { exec } = require('child_process');
const path = require('path');

app.post('/api/webhook/github', (req, res) => {
  console.log('[Auto-Sync] GitHub Webhook triggered! Pulling latest changes...');
  exec('git pull origin main && npm install', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('[Auto-Sync] Git pull error:', error);
      return res.status(500).json({ error: 'Git pull failed', details: stderr });
    }
    console.log('[Auto-Sync] Successfully updated code from GitHub:\n', stdout);
    return res.json({ message: 'Server updated successfully!', output: stdout });
  });
});

// Helper route to trigger manual sync from browser or curl
app.get('/api/git-sync', (req, res) => {
  exec('git pull origin main', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Git sync error', details: stderr });
    }
    return res.json({ message: 'Git sync successful', output: stdout });
  });
});

// --- CLEAN ROUTE ALIASES ---
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'products.html')));
app.get('/farmer-stories', (req, res) => res.sendFile(path.join(__dirname, 'farmer-stories.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));

// Sub-path alias support (e.g., /bhartigreentech and /bhartigreentech/admin)
app.get(['/bhartigreentech', '/bhartigreentech/index.html'], (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get(['/bhartigreentech/admin', '/bhartigreentech/admin.html'], (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get(['/bhartigreentech/products', '/bhartigreentech/products.html'], (req, res) => res.sendFile(path.join(__dirname, 'products.html')));
app.get(['/bhartigreentech/farmer-stories', '/bhartigreentech/farmer-stories.html'], (req, res) => res.sendFile(path.join(__dirname, 'farmer-stories.html')));
app.get(['/bhartigreentech/contact', '/bhartigreentech/contact.html'], (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));

// Start server listening
app.listen(PORT, async () => {
  console.log(`BHARTI GREEN TECH backend server running on http://localhost:${PORT}`);
  
  // Execute auto-cleanup rules on boot
  try {
    const config = await db.getConfig();
    if (config.autoCleanupEnabled) {
      const purged = await db.cleanupExpiredTrash(config.trashRetentionDays);
      console.log(`Auto-cleanup trash task run on startup. Purged ${purged} expired records.`);
    }
  } catch (err) {
    console.error('Startup auto-cleanup error:', err);
  }

  // Periodic Git Auto-Pull Worker (Checks GitHub for updates every 60 seconds)
  setInterval(() => {
    exec('git pull origin main', { cwd: __dirname }, (error, stdout, stderr) => {
      if (!error && stdout && !stdout.includes('Already up to date')) {
        console.log('[Auto-Sync] Detected new commits on GitHub! Auto-pulled updates:\n', stdout);
      }
    });
  }, 60000);
});
