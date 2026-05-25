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
