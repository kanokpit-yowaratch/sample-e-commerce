import prisma from "@/lib/prisma";

// Helper function to get category with relations
export async function getCategoryById(id: number) {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
}

export async function getCategoryByName(name: string) {
  const category = await prisma.category.findUnique({
    where: { name },
  });
  return category;
}
