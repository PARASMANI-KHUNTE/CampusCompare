import { prisma } from '../config/prisma';
import { slugify } from '../utils/slugify';

export const getColleges = async () => {
  const colleges = await prisma.college.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { courses: true, reviews: true } } },
  });
  return colleges;
};

export const getCourses = async () => {
  const courses = await prisma.course.findMany({
    include: { college: { select: { name: true, shortName: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return courses;
};

export const createCollege = async (data: any) => {
  const slug = slugify(data.name);

  const college = await prisma.college.create({
    data: {
      ...data,
      slug,
      courses: data.courses ? {
        create: data.courses
      } : undefined
    },
  });

  return college;
};

export const updateCollege = async (id: string, data: any) => {
  const updateData = { ...data };
  if (updateData.name) {
    updateData.slug = slugify(updateData.name);
  }

  const college = await prisma.college.update({
    where: { id },
    data: updateData,
  });

  return college;
};

export const deleteCollege = async (id: string) => {
  await prisma.college.delete({
    where: { id },
  });
  return { success: true };
};

export const createCourse = async (data: any) => {
  const course = await prisma.course.create({
    data,
  });
  return course;
};

export const updateCourse = async (id: string, data: any) => {
  const course = await prisma.course.update({
    where: { id },
    data,
  });
  return course;
};

export const deleteCourse = async (id: string) => {
  await prisma.course.delete({
    where: { id },
  });
  return { success: true };
};

export const createNotice = async (collegeId: string, data: any) => {
  const notice = await prisma.notice.create({
    data: {
      ...data,
      collegeId
    },
  });
  return notice;
};

export const deleteNotice = async (id: string) => {
  await prisma.notice.delete({
    where: { id },
  });
  return { success: true };
};

export const bulkCreateColleges = async (colleges: any[]) => {
  const results = [];
  for (const c of colleges) {
    if (!c.name) continue;
    const slug = slugify(c.name);

    // Check if slug already exists
    const existing = await prisma.college.findUnique({ where: { slug } });
    if (existing) {
      results.push({ name: c.name, status: 'skipped', reason: 'College with this slug/name already exists' });
      continue;
    }

    try {
      const created = await prisma.college.create({
        data: {
          name: c.name,
          shortName: c.shortName,
          description: c.description,
          overview: c.overview,
          city: c.city,
          state: c.state,
          address: c.address,
          collegeType: c.collegeType,
          ownership: c.ownership,
          establishedYear: c.establishedYear ? Number(c.establishedYear) : undefined,
          approvedBy: c.approvedBy || [],
          affiliatedTo: c.affiliatedTo,
          accreditation: c.accreditation || [],
          imageUrl: c.imageUrl,
          officialUrl: c.officialUrl,
          gallery: c.gallery || [],
          feesMin: c.feesMin ? Number(c.feesMin) : 0,
          feesMax: c.feesMax ? Number(c.feesMax) : 0,
          rating: c.rating ? Number(c.rating) : 0,
          reviewCount: c.reviewCount ? Number(c.reviewCount) : 0,
          placementAverage: c.placementAverage ? Number(c.placementAverage) : undefined,
          placementHighest: c.placementHighest ? Number(c.placementHighest) : undefined,
          examsAccepted: c.examsAccepted || [],
          popularCourses: c.popularCourses || [],
          facilities: c.facilities || [],
          tags: c.tags || [],
          slug,
          courses: c.courses && Array.isArray(c.courses) ? {
            create: c.courses.map((course: any) => ({
              name: course.name,
              category: course.category,
              degree: course.degree,
              duration: course.duration,
              fees: Number(course.fees || 0),
              eligibility: course.eligibility,
              examsAccepted: course.examsAccepted || [],
              seats: course.seats ? Number(course.seats) : undefined,
            }))
          } : undefined
        }
      });
      results.push({ name: created.name, status: 'created' });
    } catch (err: any) {
      results.push({ name: c.name, status: 'failed', reason: err.message || 'Validation or database insertion error' });
    }
  }
  return results;
};
