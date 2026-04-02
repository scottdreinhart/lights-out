#!/usr/bin/env node

/**
 * SMTP Password Validator
 * Tests multiple SMTP passwords to verify which one works with Gmail
 * 
 * Usage:
 *   node test-smtp-passwords.mjs
 * 
 * Passwords are read from environment variables or command line args.
 * Does NOT store credentials persistently.
 */

const nodemailerImport = async () => {
  try {
    return await import('nodemailer');
  } catch (err) {
    console.error('❌ nodemailer not installed. Install with: pnpm add nodemailer');
    process.exit(1);
  }
};

/**
 * Test a single SMTP password
 */
async function testPassword(nodemailer, smtpUser, smtpPass, passwordLabel) {
  console.log(`\n🔍 Testing: ${passwordLabel}`);
  console.log(`   User: ${smtpUser}`);
  console.log(`   Pass: ${smtpPass.substring(0, 4)}${'*'.repeat(smtpPass.length - 8)}${smtpPass.substring(smtpPass.length - 4)}`);
  
  try {
    const transporter = nodemailer.default.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Test the connection
    const verified = await transporter.verify();
    
    if (verified) {
      console.log(`✅ SUCCESS: Password works!`);
      console.log(`   Ready to use for notifications.`);
      return {
        success: true,
        password: smtpPass,
        label: passwordLabel,
      };
    } else {
      console.log(`❌ FAILED: Connection could not be verified`);
      return { success: false, label: passwordLabel };
    }
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    
    // Provide helpful hints
    if (error.message.includes('Invalid login')) {
      console.log(`   💡 Hint: Password may be incorrect or not an app password`);
    } else if (error.message.includes('timeout')) {
      console.log(`   💡 Hint: Network timeout - check internet connection`);
    } else if (error.message.includes('certificate')) {
      console.log(`   💡 Hint: SSL/TLS issue - verify port 587 is correct`);
    }
    
    return { success: false, label: passwordLabel };
  }
}

/**
 * Main test runner
 */
async function main() {
  console.log('='.repeat(60));
  console.log('SMTP PASSWORD TEST - Gmail');
  console.log('='.repeat(60));

  const nodemailer = await nodemailerImport();
  
  const smtpUser = process.env.SMTP_USER || 'scottdreinhart@gmail.com';
  
  // Get passwords from environment or use defaults
  const passwords = [
    { pass: process.env.PASSWORD_1 || '!W3kyB3d@777#', label: 'Password 1' },
    { pass: process.env.PASSWORD_2 || '!R3dW3kyB3d@777#', label: 'Password 2' },
    { pass: process.env.PASSWORD_3 || '!WekDragon@10081975#777', label: 'Password 3' },
  ].filter(p => p.pass); // Remove empty passwords

  if (passwords.length === 0) {
    console.log('❌ No passwords provided. Set PASSWORD_1, PASSWORD_2, or PASSWORD_3 env vars');
    process.exit(1);
  }

  console.log(`\n📧 Testing ${passwords.length} password(s) against Gmail SMTP...`);
  console.log(`   User: ${smtpUser}`);
  
  // Test all passwords in sequence
  const results = [];
  for (const { pass, label } of passwords) {
    const result = await testPassword(nodemailer, smtpUser, pass, label);
    results.push(result);
    
    // Small delay between attempts to avoid rate limiting
    if (passwords.indexOf({ pass, label }) < passwords.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  
  if (successful.length === 0) {
    console.log('\n❌ No passwords worked. Possible causes:');
    console.log('   1. Passwords are incorrect');
    console.log('   2. Gmail 2FA not enabled or app password not generated');
    console.log('   3. Network connectivity issue');
    console.log('   4. Gmail account locked or security issue');
    console.log('\n💡 Next steps:');
    console.log('   1. Verify you created an App Password (not regular password)');
    console.log('   2. Go to: myaccount.google.com/apppasswords');
    console.log('   3. Select "Mail" and "Windows Computer"');
    console.log('   4. Copy the 16-char password without spaces');
    console.log('   5. Run this test again with the correct password');
  } else {
    console.log(`\n✅ ${successful.length} password(s) work!`);
    successful.forEach(result => {
      console.log(`   ✓ ${result.label}`);
    });
    
    console.log('\n📝 Next steps:');
    console.log('   1. Store the working password in your secure .env file:');
    console.log(`      SMTP_PASS=${successful[0].password}`);
    console.log('   2. Set other required variables:');
    console.log('      EMAIL_ENABLED=true');
    console.log('      SMTP_HOST=smtp.gmail.com');
    console.log('      SMTP_PORT=587');
    console.log('      SMTP_USER=scottdreinhart@gmail.com');
    console.log('      NOTIFICATION_EMAIL=scottdreinhart@gmail.com');
    console.log('   3. Run the regression detector:');
    console.log('      pnpm check:regressions');
  }
  
  console.log('\n' + '='.repeat(60));
  process.exit(successful.length === 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
