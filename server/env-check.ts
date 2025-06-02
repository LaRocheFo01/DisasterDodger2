export function checkRequiredEnvVars() {
  const required = [
    'STRIPE_SECRET_KEY',
    'NODE_ENV',
    'DATABASE_URL' // Add if using external DB
  ];

  const missing: string[] = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease add these to your .env file or Replit secrets');
    process.exit(1);
  }

  console.log('✅ All required environment variables are present');

  // Log non-sensitive env info
  console.log('Environment configuration:');
  console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  - Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`  - Database: ${process.env.DATABASE_URL ? 'External' : 'Local SQLite'}`);
}