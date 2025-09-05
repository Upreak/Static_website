import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding pre-fill data for Go-Live...');

  // Get the first admin user to use as updater
  const firstAdmin = await prisma.admin.findFirst();
  if (!firstAdmin) {
    console.log('No admin users found. Please run the seed script first.');
    return;
  }

  console.log(`Using admin user: ${firstAdmin.email} (${firstAdmin.name})`);

  // Pre-fill data based on the provided information
  const prefillSettings = [
    // Contact Information
    {
      key: 'contact_address',
      value: 'UPREAK INDIA PRIVATE LIMITED, 5-3-133,507,1st Floor, 3rd, Neelakanteshwara Colony, Gangavathi, Koppal-583227, Karnataka',
      description: 'Company address for contact page and footer',
      type: 'STRING'
    },
    {
      key: 'contact_email',
      value: 'info@upreak.com',
      description: 'Primary contact email address',
      type: 'STRING'
    },
    {
      key: 'contact_phone',
      value: '+91 99013 81877',
      description: 'Primary contact phone number (WhatsApp only)',
      type: 'STRING'
    },
    {
      key: 'contact_hours',
      value: JSON.stringify([
        { day: 'Monday', hours: '9:30 AM – 6:30 PM' },
        { day: 'Tuesday', hours: '9:30 AM – 6:30 PM' },
        { day: 'Wednesday', hours: '9:30 AM – 6:30 PM' },
        { day: 'Thursday', hours: '9:30 AM – 6:30 PM' },
        { day: 'Friday', hours: '9:30 AM – 6:30 PM' },
        { day: 'Saturday', hours: '9:30 AM – 6:30 PM' },
        { day: 'Sunday', hours: 'Closed' }
      ]),
      description: 'Office hours for contact page',
      type: 'STRING'
    },
    {
      key: 'contact_description',
      value: 'Upreak India Private Limited - Your preferred recruitment business partner delivering exceptional talent through AI, Human expertise, and Data analytics.',
      description: 'Company description for contact page',
      type: 'STRING'
    },

    // Footer Settings
    {
      key: 'footer_address',
      value: 'UPREAK INDIA PRIVATE LIMITED, 5-3-133,507,1st Floor, 3rd, Neelakanteshwara Colony, Gangavathi, Koppal-583227, Karnataka',
      description: 'Company address for footer',
      type: 'STRING'
    },
    {
      key: 'footer_get_in_touch',
      value: 'Get in touch with Upreak for all your recruitment and talent sourcing needs. We are here to help you find exceptional talent for your organization.',
      description: 'Get in touch content for footer',
      type: 'STRING'
    },
    {
      key: 'footer_copyright',
      value: '© {year} Upreak India Private Limited. All rights reserved.',
      description: 'Copyright text for footer',
      type: 'STRING'
    },

    // Social Media Links
    {
      key: 'social_facebook',
      value: 'https://www.facebook.com/upreakofficial',
      description: 'Facebook page URL',
      type: 'STRING'
    },
    {
      key: 'social_instagram',
      value: 'https://www.instagram.com/upreakofficial',
      description: 'Instagram profile URL',
      type: 'STRING'
    },
    {
      key: 'social_linkedin',
      value: 'https://www.linkedin.com/company/upreak',
      description: 'LinkedIn company page URL',
      type: 'STRING'
    },
    {
      key: 'social_twitter',
      value: 'https://x.com/upreakofficial',
      description: 'Twitter/X profile URL',
      type: 'STRING'
    },

    // Secondary Email for Jobs
    {
      key: 'jobs_email',
      value: 'jobs@upreak.com',
      description: 'Jobs and careers email address',
      type: 'STRING'
    },

    // Basic Site Settings
    {
      key: 'site_name',
      value: 'Upreak India Private Limited',
      description: 'Company name for site title and branding',
      type: 'STRING'
    },
    {
      key: 'site_description',
      value: 'Preferred Recruitment Business Partner delivering exceptional talent through AI, Human expertise, and Data analytics.',
      description: 'Site description for meta tags and branding',
      type: 'STRING'
    }
  ];

  let createdCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const setting of prefillSettings) {
    try {
      const result = await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          description: setting.description,
          type: setting.type,
          updatedBy: firstAdmin.id,
          updatedAt: new Date()
        },
        create: {
          key: setting.key,
          value: setting.value,
          description: setting.description,
          type: setting.type,
          updatedBy: firstAdmin.id
        }
      });

      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        console.log(`✅ Created setting: ${setting.key}`);
        createdCount++;
      } else {
        console.log(`🔄 Updated setting: ${setting.key}`);
        updatedCount++;
      }
    } catch (error) {
      console.error(`❌ Error setting ${setting.key}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Created: ${createdCount} settings`);
  console.log(`🔄 Updated: ${updatedCount} settings`);
  console.log(`❌ Errors: ${errorCount} settings`);

  console.log('\n🎉 Pre-fill data addition completed!');
  console.log('\n📋 Added settings:');
  console.log('• Contact Information: Address, Primary Email, Phone, Hours, Description');
  console.log('• Footer Settings: Address, Get in Touch, Copyright');
  console.log('• Social Media: Facebook, Instagram, LinkedIn, Twitter/X');
  console.log('• Jobs Email: jobs@upreak.com');
  console.log('• Site Settings: Company Name, Description');
}

main()
  .catch((e) => {
    console.error('❌ Error adding pre-fill data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });