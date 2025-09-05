
// Test script to verify data access
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAccess() {
  console.log('Testing data access...\n');

  try {
    // Test contact information
    console.log('📞 Contact Information:');
    const contactAddress = await prisma.siteSetting.findUnique({
      where: { key: 'contact_address' }
    });
    console.log(`Address: ${contactAddress?.value || 'Not found'}`);

    const contactEmail = await prisma.siteSetting.findUnique({
      where: { key: 'contact_email' }
    });
    console.log(`Email: ${contactEmail?.value || 'Not found'}`);

    const contactPhone = await prisma.siteSetting.findUnique({
      where: { key: 'contact_phone' }
    });
    console.log(`Phone: ${contactPhone?.value || 'Not found'}`);

    const contactHours = await prisma.siteSetting.findUnique({
      where: { key: 'contact_hours' }
    });
    console.log(`Hours: ${contactHours?.value || 'Not found'}`);

    console.log('\n🌐 Social Media Links:');
    const socialLinks = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['social_facebook', 'social_instagram', 'social_linkedin', 'social_twitter']
        }
      }
    });

    socialLinks.forEach(link => {
      const platform = link.key.replace('social_', '');
      console.log(`${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${link.value || 'Not found'}`);
    });

    console.log('\n📧 Additional Settings:');
    const jobsEmail = await prisma.siteSetting.findUnique({
      where: { key: 'jobs_email' }
    });
    console.log(`Jobs Email: ${jobsEmail?.value || 'Not found'}`);

    const siteName = await prisma.siteSetting.findUnique({
      where: { key: 'site_name' }
    });
    console.log(`Site Name: ${siteName?.value || 'Not found'}`);

    const siteDescription = await prisma.siteSetting.findUnique({
      where: { key: 'site_description' }
    });
    console.log(`Site Description: ${siteDescription?.value || 'Not found'}`);

    console.log('\n✅ All data access tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing data access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAccess();

 