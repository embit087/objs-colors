#!/usr/bin/env tsx

import { getDatabase } from '../lib/database';

async function addPasswordToDatabase() {
  console.log('🔐 Adding password protection to existing database...');

  try {
    const db = getDatabase();
    
    // Check if password already exists
    const existingPassword = db.get('color-feature-password');
    if (existingPassword) {
      console.log('✅ Password protection already exists in database');
      console.log('🔒 Features will be protected by authentication');
      return;
    }

    // Add the password
    const passwordSet = db.set('color-feature-password', 'objs123abc');
    
    if (passwordSet) {
      console.log('✅ Password protection added successfully!');
      console.log('🔒 Advanced features now require authentication');
      console.log('🔑 Use password "objs123abc" to unlock features');
    } else {
      console.error('❌ Failed to add password protection');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error adding password protection:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  addPasswordToDatabase();
}

export { addPasswordToDatabase };
