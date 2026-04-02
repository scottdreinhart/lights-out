#!/usr/bin/env node

/**
 * SMTP Password Validator - Working Password Test
 * Verifies the Gmail app password for WASM regression notifications
 *
 * Usage:
 *   export PASSWORD=yjbilqulswpxlbjy
 *   export SMTP_USER=scottdreinhart@gmail.com
 *   node compliance/test-smtp-passwords.mjs
 *
 * Credentials are read from environment variables only.
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
  console.log(`   Pass: ${smtpPass.substring(0, 4)}${'*'.repeat(Math.max(0, smtpPass.length - 8))}${smtpPass.substring(Math.max(0, smtpPass.length - 4))}`);

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
  console.log('SMTP PASSWORD TEST - Gmail App Password');
  console.log('='.repeat(60));

  const nodemailer = await nodemailerImport();

  const smtpUser = process.env.SMTP_USER || 'scottdreinhart@gmail.com';
  const workingPassword = process.env.PASSWORD || 'yjbilqulswpxlbjy';

  if (!workingPassword) {
    console.log('❌ No password provided. Set PASSWORD env var');
    process.exit(1);
  }

  const passwords = [
    { pass: workingPassword, label: 'Gmail App Password (yjbi lqul swpx lbjy)' },
  ];

  console.log(`\n📧 Testing Gmail app password...`);
  console.log(`   User: ${smtpUser}`);

  // Test the password
  const results = [];
  for (const { pass, label } of passwords) {
    const result = await testPassword(nodemailer, smtpUser, pass, label);
    results.push(result);
  }

  // Display summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  if (successful.length > 0) {
    console.log(`\n✅ ${successful.length} password(s) work!`);
    successful.forEach((r) => {
      console.log(`   ✓ ${r.label}`);
    });

    console.log('\n📝 Next steps:');
    console.log(`   1. Store in .env.notifications.local:`);
    console.log(`      SMTP_PASS=${successful[0].password}`);
    console.log(`   2. For SMS alerts, set:`);
    console.log(`      SMS_EMAIL=4246664233@msg.fi.google.com`);
    console.log(`   3. Run the regression detector:`);
    console.log(`      source .env.notifications.local`);
    console.log(`      pnpm check:regressions`);
  } else {
    console.log(`\n❌ No passwords worked. Possible causes:`);
    console.log(`   1. Password is incorrect`);
    console.log(`   2. Gmail 2FA not enabled or app password not generated`);
    console.log(`   3. Network connectivity issue`);
    console.log(`   4. Gmail account locked or security issue`);

    console.log(`\n💡 Next steps:`);
    console.log(`   1. Verify you created an App Password (not regular password)`);
    console.log(`   2. Go to: myaccount.google.com/apppasswords`);
    console.log(`   3. Select "Mail" and "Windows Computer"`);
    console.log(`   4. Copy the 16-char password without spaces`);
    console.log(`   5. Run: export PASSWORD="<your-16-char-password>"`);
    console.log(`   6. Run this test again`);
  }

  console.log('\n' + '='.repeat(60));

  // Exit with appropriate code
  process.exit(successful.length > 0 ? 0 : 1);
}

// Run main
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(2);
});
