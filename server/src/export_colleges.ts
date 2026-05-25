import { prisma } from './config/prisma';
import fs from 'fs';
import path from 'path';

async function exportColleges() {
  console.log('Fetching colleges from database...');
  const colleges = await prisma.college.findMany({
    include: {
      courses: true
    }
  });

  const cleanColleges = colleges.map(c => {
    return {
      name: c.name,
      shortName: c.shortName,
      description: c.description,
      overview: c.overview,
      city: c.city,
      state: c.state,
      address: c.address,
      collegeType: c.collegeType,
      ownership: c.ownership,
      establishedYear: c.establishedYear,
      approvedBy: c.approvedBy,
      affiliatedTo: c.affiliatedTo,
      accreditation: c.accreditation,
      imageUrl: c.imageUrl,
      officialUrl: c.officialUrl,
      gallery: c.gallery,
      feesMin: c.feesMin,
      feesMax: c.feesMax,
      rating: c.rating,
      reviewCount: c.reviewCount,
      placementAverage: c.placementAverage,
      placementHighest: c.placementHighest,
      examsAccepted: c.examsAccepted,
      popularCourses: c.popularCourses,
      facilities: c.facilities,
      tags: c.tags,
      courses: c.courses.map(course => ({
        name: course.name,
        category: course.category,
        degree: course.degree,
        duration: course.duration,
        fees: course.fees,
        eligibility: course.eligibility,
        examsAccepted: course.examsAccepted,
        seats: course.seats
      }))
    };
  });

  const outputPath = path.join(__dirname, '..', '..', 'colleges_data.json');
  fs.writeFileSync(outputPath, JSON.stringify({ colleges: cleanColleges }, null, 2));
  console.log(`Successfully exported ${cleanColleges.length} colleges to ${outputPath}`);
}

exportColleges()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
