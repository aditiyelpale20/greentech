const fs = require('fs/promises');
const path = require('path');

const INQUIRIES_PATH = path.join(__dirname, 'inquiries.json');
const FEEDBACK_PATH = path.join(__dirname, 'feedback.json');
const CONFIG_PATH = path.join(__dirname, 'admin_config.json');
const ACTIVITY_LOG_PATH = path.join(__dirname, 'activity_log.json');
const BACKUPS_DIR = path.join(__dirname, 'backups');

// --- DATABASE UTILITIES ---

async function ensureFileExists(filePath, defaultValue = []) {
  try {
    await fs.access(filePath);
  } catch (err) {
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
  }
}

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (err) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// --- CONFIG & LOG LAYERS ---

async function getConfig() {
  await ensureFileExists(CONFIG_PATH, { trashRetentionDays: 30, autoCleanupEnabled: false });
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading admin config:', err);
    return { trashRetentionDays: 30, autoCleanupEnabled: false };
  }
}

async function saveConfig(config) {
  try {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing admin config:', err);
    throw new Error('Config write failure');
  }
}

async function getActivityLog() {
  await ensureFileExists(ACTIVITY_LOG_PATH, []);
  try {
    const data = await fs.readFile(ACTIVITY_LOG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading activity log:', err);
    return [];
  }
}

async function saveActivityLog(log) {
  try {
    await fs.writeFile(ACTIVITY_LOG_PATH, JSON.stringify(log, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing activity log:', err);
    throw new Error('Log write failure');
  }
}

async function addActivityLogEntry(admin, action, recordType, recordId, prevStatus = '', newStatus = '') {
  const log = await getActivityLog();
  const entry = {
    id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
    admin: admin || 'system',
    action: action, // e.g. 'archived', 'trashed', 'restored', 'deleted_permanently'
    recordType: recordType, // 'feedback' or 'inquiry'
    recordId: recordId,
    prevStatus: prevStatus || 'N/A',
    newStatus: newStatus || 'N/A',
    timestamp: new Date().toISOString()
  };
  log.unshift(entry); // Newest logs first
  await saveActivityLog(log.slice(0, 500)); // Cap logs at 500 entries
  return entry;
}

// --- BACKUP UTILITY ---

async function backupDatabaseBeforeDeletion(type) {
  await ensureDirectoryExists(BACKUPS_DIR);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sourcePath = type === 'feedback' ? FEEDBACK_PATH : INQUIRIES_PATH;
  const backupFilename = `${type}_backup_${timestamp}.json`;
  const destPath = path.join(BACKUPS_DIR, backupFilename);
  
  try {
    await ensureFileExists(sourcePath);
    await fs.copyFile(sourcePath, destPath);
    console.log(`Successfully backed up database: ${backupFilename}`);
    return backupFilename;
  } catch (err) {
    console.error(`Failed to generate database backup for ${type}:`, err);
    throw new Error('Backup creation failed');
  }
}

// --- INQUIRIES DATA LAYER ---

async function getInquiries() {
  await ensureFileExists(INQUIRIES_PATH);
  try {
    const data = await fs.readFile(INQUIRIES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading inquiries database:', err);
    return [];
  }
}

async function saveInquiries(inquiries) {
  try {
    await fs.writeFile(INQUIRIES_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing inquiries to database:', err);
    throw new Error('Database write failure');
  }
}

async function addInquiry(inquiryData) {
  const inquiries = await getInquiries();
  
  const sub_time = new Date().toISOString();
  const newInquiry = {
    id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
    
    // Snake case columns (new)
    full_name: inquiryData.full_name || inquiryData.fullName || '',
    phone_number: inquiryData.phone_number || inquiryData.mobileNumber || '',
    email: inquiryData.email || inquiryData.emailAddress || '',
    state: inquiryData.state || '',
    district: inquiryData.district || '',
    interested_product: inquiryData.interested_product || inquiryData.interestedProduct || '',
    crop_type: inquiryData.crop_type || inquiryData.cropType || '',
    message: inquiryData.message || inquiryData.inquiryMessage || '',
    status: inquiryData.status || 'New',
    admin_notes: inquiryData.admin_notes || inquiryData.notes || '',
    assigned_to: inquiryData.assigned_to || inquiryData.assignedTo || '',

    // Legacy/Helper columns
    fullName: inquiryData.fullName || inquiryData.full_name || '',
    mobileNumber: inquiryData.mobileNumber || inquiryData.phone_number || '',
    emailAddress: inquiryData.emailAddress || inquiryData.email || '',
    interestedProduct: inquiryData.interestedProduct || inquiryData.interested_product || '',
    cropType: inquiryData.cropType || inquiryData.crop_type || '',
    inquiryMessage: inquiryData.inquiryMessage || inquiryData.message || '',
    notes: inquiryData.notes || inquiryData.admin_notes || '',
    assignedTo: inquiryData.assignedTo || inquiryData.assigned_to || '',

    // Data management attributes
    is_deleted: false,
    deleted_at: null,
    deleted_by: null,
    is_archived: false,
    archived_at: null,
    submissionDateTime: sub_time,
    created_at: sub_time,
    updated_at: sub_time
  };

  inquiries.push(newInquiry);
  await saveInquiries(inquiries);
  return newInquiry;
}

async function updateInquiryDetails(id, updates, adminName = 'system') {
  const inquiries = await getInquiries();
  const index = inquiries.findIndex(inq => inq.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const inq = inquiries[index];
  const oldStatus = inq.status;
  const oldIsDeleted = inq.is_deleted;
  const oldIsArchived = inq.is_archived;

  // Normal updates
  if (updates.status !== undefined) {
    const validStatuses = ['New', 'In Progress', 'Contacted', 'Resolved', 'Spam', 'Closed'];
    if (!validStatuses.includes(updates.status)) {
      throw new Error('Invalid status value');
    }
    inq.status = updates.status;
  }
  
  if (updates.notes !== undefined) {
    inq.notes = updates.notes;
    inq.admin_notes = updates.notes;
  }
  if (updates.admin_notes !== undefined) {
    inq.notes = updates.admin_notes;
    inq.admin_notes = updates.admin_notes;
  }
  
  if (updates.assignedTo !== undefined) {
    inq.assignedTo = updates.assignedTo;
    inq.assigned_to = updates.assignedTo;
  }
  if (updates.assigned_to !== undefined) {
    inq.assignedTo = updates.assigned_to;
    inq.assigned_to = updates.assigned_to;
  }

  // Soft-delete states
  if (updates.is_deleted !== undefined) {
    inq.is_deleted = !!updates.is_deleted;
    if (inq.is_deleted) {
      inq.deleted_at = new Date().toISOString();
      inq.deleted_by = adminName;
    } else {
      inq.deleted_at = null;
      inq.deleted_by = null;
    }
  }

  // Archive states
  if (updates.is_archived !== undefined) {
    inq.is_archived = !!updates.is_archived;
    if (inq.is_archived) {
      inq.archived_at = new Date().toISOString();
    } else {
      inq.archived_at = null;
    }
  }
  
  inquiries[index] = inq;
  await saveInquiries(inquiries);

  // Generate audit logs if status or soft state changed
  if (oldStatus !== inq.status) {
    await addActivityLogEntry(adminName, 'status_updated', 'inquiry', id, oldStatus, inq.status);
  }
  if (oldIsDeleted !== inq.is_deleted) {
    const action = inq.is_deleted ? 'moved_to_trash' : 'restored_from_trash';
    await addActivityLogEntry(adminName, action, 'inquiry', id, oldIsDeleted ? 'Deleted' : 'Active', inq.is_deleted ? 'Deleted' : 'Active');
  }
  if (oldIsArchived !== inq.is_archived) {
    const action = inq.is_archived ? 'archived' : 'unarchived';
    await addActivityLogEntry(adminName, action, 'inquiry', id, oldIsArchived ? 'Archived' : 'Active', inq.is_archived ? 'Archived' : 'Active');
  }

  return inq;
}

async function deleteInquiryPermanently(id) {
  const inquiries = await getInquiries();
  const index = inquiries.findIndex(inq => inq.id === id);
  if (index === -1) {
    return false;
  }
  inquiries.splice(index, 1);
  await saveInquiries(inquiries);
  return true;
}


// --- FEEDBACK DATA LAYER ---

async function getFeedback() {
  await ensureFileExists(FEEDBACK_PATH);
  try {
    const data = await fs.readFile(FEEDBACK_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading feedback database:', err);
    return [];
  }
}

async function saveFeedback(feedbackList) {
  try {
    await fs.writeFile(FEEDBACK_PATH, JSON.stringify(feedbackList, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing feedback to database:', err);
    throw new Error('Database write failure');
  }
}

async function addFeedback(feedbackData) {
  const feedbackList = await getFeedback();
  
  const sub_time = new Date().toISOString();
  const newFeedback = {
    id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
    
    // Snake case columns (new)
    customer_name: feedbackData.customer_name || feedbackData.name || '',
    rating: parseInt(feedbackData.rating) || 5,
    product_name: feedbackData.product_name || feedbackData.crop || '',
    message: feedbackData.message || feedbackData.text || '',

    // Legacy/Helper columns
    name: feedbackData.name || feedbackData.customer_name || '',
    mobileNumber: feedbackData.mobileNumber || feedbackData.phone_number || '0000000000',
    phone_number: feedbackData.phone_number || feedbackData.mobileNumber || '0000000000',
    district: feedbackData.district || '',
    crop: feedbackData.crop || feedbackData.product_name || '',
    text: feedbackData.text || feedbackData.message || '',

    // Common metadata fields
    status: 'Pending',
    is_visible: false,
    is_default: false,
    is_deleted: false,
    deleted_at: null,
    deleted_by: null,
    is_archived: false,
    archived_at: null,
    submissionDateTime: sub_time,
    created_at: sub_time,
    updated_at: sub_time,
    
    // Additional preloaded fields
    is_default: feedbackData.is_default || false,
    default_key: feedbackData.default_key || null
  };

  feedbackList.push(newFeedback);
  await saveFeedback(feedbackList);
  return newFeedback;
}

async function updateFeedbackModeration(id, updates, adminName = 'system') {
  const feedbackList = await getFeedback();
  const index = feedbackList.findIndex(fb => fb.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const fb = feedbackList[index];
  const oldStatus = fb.status;
  const oldIsDeleted = fb.is_deleted;
  const oldIsArchived = fb.is_archived;
  
  if (updates.status !== undefined) {
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(updates.status)) {
      throw new Error('Invalid status value');
    }
    fb.status = updates.status;
  }
  
  if (updates.is_visible !== undefined) {
    fb.is_visible = !!updates.is_visible;
  }
  
  if (updates.text !== undefined) {
    fb.text = updates.text;
    fb.message = updates.text;
  }
  if (updates.message !== undefined) {
    fb.text = updates.message;
    fb.message = updates.message;
  }

  // Soft-delete states
  if (updates.is_deleted !== undefined) {
    fb.is_deleted = !!updates.is_deleted;
    if (fb.is_deleted) {
      fb.deleted_at = new Date().toISOString();
      fb.deleted_by = adminName;
    } else {
      fb.deleted_at = null;
      fb.deleted_by = null;
    }
  }

  // Archive states
  if (updates.is_archived !== undefined) {
    fb.is_archived = !!updates.is_archived;
    if (fb.is_archived) {
      fb.archived_at = new Date().toISOString();
    } else {
      fb.archived_at = null;
    }
  }
  
  feedbackList[index] = fb;
  await saveFeedback(feedbackList);

  // Generate audit logs if status or soft state changed
  if (oldStatus !== fb.status) {
    await addActivityLogEntry(adminName, 'status_updated', 'feedback', id, oldStatus, fb.status);
  }
  if (oldIsDeleted !== fb.is_deleted) {
    const action = fb.is_deleted ? 'moved_to_trash' : 'restored_from_trash';
    await addActivityLogEntry(adminName, action, 'feedback', id, oldIsDeleted ? 'Deleted' : 'Active', fb.is_deleted ? 'Deleted' : 'Active');
  }
  if (oldIsArchived !== fb.is_archived) {
    const action = fb.is_archived ? 'archived' : 'unarchived';
    await addActivityLogEntry(adminName, action, 'feedback', id, oldIsArchived ? 'Archived' : 'Active', fb.is_archived ? 'Archived' : 'Active');
  }

  return fb;
}

async function deleteFeedbackPermanently(id) {
  const feedbackList = await getFeedback();
  const index = feedbackList.findIndex(fb => fb.id === id);
  if (index === -1) {
    return false;
  }
  feedbackList.splice(index, 1);
  await saveFeedback(feedbackList);
  return true;
}

// --- AUTO-CLEANUP CRON TASK ---

async function cleanupExpiredTrash(days) {
  if (!days || days <= 0) return 0;
  
  const now = new Date();
  const thresholdMs = days * 24 * 60 * 60 * 1000;
  let deletedCount = 0;

  // 1. Cleanup Feedback
  const feedbackList = await getFeedback();
  const feedbackCleaned = [];
  for (const fb of feedbackList) {
    if (fb.is_deleted && fb.deleted_at) {
      const deletedTime = new Date(fb.deleted_at);
      if (now - deletedTime > thresholdMs) {
        deletedCount++;
        continue; // Exclude permanently
      }
    }
    feedbackCleaned.push(fb);
  }
  if (feedbackList.length !== feedbackCleaned.length) {
    await saveFeedback(feedbackCleaned);
  }

  // 2. Cleanup Inquiries
  const inquiries = await getInquiries();
  const inquiriesCleaned = [];
  for (const inq of inquiries) {
    if (inq.is_deleted && inq.deleted_at) {
      const deletedTime = new Date(inq.deleted_at);
      if (now - deletedTime > thresholdMs) {
        deletedCount++;
        continue; // Exclude permanently
      }
    }
    inquiriesCleaned.push(inq);
  }
  if (inquiries.length !== inquiriesCleaned.length) {
    await saveInquiries(inquiriesCleaned);
  }

  if (deletedCount > 0) {
    await addActivityLogEntry('system', 'auto_cleanup_trash', 'system', 'all', '', `Deleted ${deletedCount} records`);
  }

  return deletedCount;
}

module.exports = {
  getInquiries,
  addInquiry,
  updateInquiryDetails,
  deleteInquiryPermanently,
  getFeedback,
  addFeedback,
  updateFeedbackModeration,
  deleteFeedbackPermanently,
  
  // Data management additions
  getConfig,
  saveConfig,
  getActivityLog,
  addActivityLogEntry,
  backupDatabaseBeforeDeletion,
  cleanupExpiredTrash
};
