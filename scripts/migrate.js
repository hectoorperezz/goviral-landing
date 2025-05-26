const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

// Path to JSON files
const DATA_DIR = path.join(process.cwd(), 'data');
const TRIALS_FILE = path.join(DATA_DIR, 'trials.json');
const PENDING_VERIFICATIONS_FILE = path.join(DATA_DIR, 'pendingVerifications.json');

// Get the token from environment variables
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || '';

// Utility function to upload JSON data to Vercel Blob storage
async function uploadJson(key, data) {
  const jsonString = JSON.stringify(data);
  const { url } = await put(key, jsonString, { 
    access: 'public',
    addRandomSuffix: false, // We want to control our key names exactly
    token: BLOB_TOKEN
  });
  
  return url;
}

// Main migration function
async function migrateToBlob() {
  console.log('Starting migration to Vercel Blob...');
  
  try {
    // Check if files exist
    if (!fs.existsSync(DATA_DIR)) {
      console.log('Data directory does not exist. No data to migrate.');
      return;
    }
    
    // Migrate trials
    if (fs.existsSync(TRIALS_FILE)) {
      await migrateTrials();
    } else {
      console.log('No trials.json file found. Skipping trials migration.');
    }
    
    // Migrate pending verifications
    if (fs.existsSync(PENDING_VERIFICATIONS_FILE)) {
      await migratePendingVerifications();
    } else {
      console.log('No pendingVerifications.json file found. Skipping verifications migration.');
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Migrate trials
async function migrateTrials() {
  console.log('Migrating trials...');
  
  try {
    // Read the trials file
    const trialsData = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
    
    if (!trialsData.trials || !Array.isArray(trialsData.trials)) {
      console.log('No trials found or invalid format. Skipping trials migration.');
      return;
    }
    
    console.log(`Found ${trialsData.trials.length} trials to migrate.`);
    
    // Migrate each trial
    for (const trial of trialsData.trials) {
      if (!trial.email) {
        console.warn('Skipping trial without email:', trial);
        continue;
      }
      
      const key = `trials/${trial.email}.json`;
      const url = await uploadJson(key, trial);
      console.log(`Migrated trial for ${trial.email} to ${url}`);
    }
    
    console.log('Trials migration completed.');
  } catch (error) {
    console.error('Error migrating trials:', error);
    throw error;
  }
}

// Migrate pending verifications
async function migratePendingVerifications() {
  console.log('Migrating pending verifications...');
  
  try {
    // Read the pending verifications file
    const verificationsData = JSON.parse(fs.readFileSync(PENDING_VERIFICATIONS_FILE, 'utf8'));
    
    if (!verificationsData.pendingVerifications || !Array.isArray(verificationsData.pendingVerifications)) {
      console.log('No pending verifications found or invalid format. Skipping verifications migration.');
      return;
    }
    
    console.log(`Found ${verificationsData.pendingVerifications.length} pending verifications to migrate.`);
    
    // Only migrate non-expired verifications
    const now = Date.now();
    const validVerifications = verificationsData.pendingVerifications.filter(
      (v) => v.expiresAt > now
    );
    
    console.log(`${validVerifications.length} verifications are still valid and will be migrated.`);
    
    // Migrate each verification
    for (const verification of validVerifications) {
      if (!verification.email || !verification.createdAt) {
        console.warn('Skipping verification without email or createdAt:', verification);
        continue;
      }
      
      const key = `verifications/${verification.email}-${verification.createdAt}.json`;
      const url = await uploadJson(key, verification);
      console.log(`Migrated verification for ${verification.email} to ${url}`);
    }
    
    console.log('Pending verifications migration completed.');
  } catch (error) {
    console.error('Error migrating pending verifications:', error);
    throw error;
  }
}

// Run the migration
migrateToBlob().catch(console.error); 