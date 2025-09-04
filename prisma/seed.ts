import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin users
  const adminUsers = [
    {
      email: 'admin@upreak.com',
      name: 'Super Admin',
      password: 'admin123',
      role: 'SUPER_ADMIN'
    },
    {
      email: 'editor@upreak.com',
      name: 'Content Editor',
      password: 'editor123',
      role: 'EDITOR'
    },
    {
      email: 'manager@upreak.com',
      name: 'Admin Manager',
      password: 'manager123',
      role: 'ADMIN'
    }
  ];

  for (const adminData of adminUsers) {
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    
    try {
      const admin = await prisma.admin.create({
        data: {
          email: adminData.email,
          name: adminData.name,
          password: hashedPassword,
          role: adminData.role,
          isActive: true
        }
      });
      
      console.log(`Created admin user: ${admin.email} (${admin.role})`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`Admin user ${adminData.email} already exists`);
      } else {
        console.error(`Error creating admin user ${adminData.email}:`, error);
      }
    }
  }

  // Get the first admin user to use as creator for sample pages
  const firstAdmin = await prisma.admin.findFirst();
  if (!firstAdmin) {
    console.log('No admin users found. Skipping sample pages creation.');
    return;
  }

  // Create some sample pages
  const samplePages = [
    {
      title: 'Homepage',
      slug: 'home',
      content: '# Welcome to Upreak\n\nTalent-Sourcing Solutions Partnering to Deliver Exceptional Talent\n\n## Our Mission\n\nWe are committed to connecting businesses with the best talent in the industry.',
      metaTitle: 'Upreak - Talent-Sourcing Solutions',
      metaDescription: 'Partnering to deliver exceptional talent for your business needs.',
      status: 'PUBLISHED',
      createdBy: firstAdmin.id
    },
    {
      title: 'About Us',
      slug: 'about',
      content: '# About Upreak\n\nWe are a leading talent-sourcing company dedicated to connecting businesses with exceptional talent.\n\n## Our Story\n\nFounded with a vision to revolutionize the recruitment industry...',
      metaTitle: 'About Us - Upreak',
      metaDescription: 'Learn about Upreak\'s mission, vision, and commitment to excellence in talent sourcing.',
      status: 'PUBLISHED',
      createdBy: firstAdmin.id
    },
    {
      title: 'Services',
      slug: 'services',
      content: '# Our Services\n\n## IT Recruitment\n\nSpecialized IT talent acquisition for technology companies.\n\n## Healthcare Staffing\n\nComprehensive healthcare staffing solutions for medical institutions.',
      metaTitle: 'Our Services - Upreak',
      metaDescription: 'Explore our comprehensive range of talent-sourcing and recruitment services.',
      status: 'PUBLISHED',
      createdBy: firstAdmin.id
    }
  ];

  for (const pageData of samplePages) {
    try {
      const page = await prisma.page.create({
        data: {
          ...pageData,
          publishedAt: pageData.status === 'PUBLISHED' ? new Date() : null
        }
      });
      
      console.log(`Created page: ${page.title} (${page.slug})`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`Page with slug ${pageData.slug} already exists`);
      } else {
        console.error(`Error creating page ${pageData.title}:`, error);
      }
    }
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });