const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete() {
    try {
        const product = await prisma.product.findFirst();
        if (product) {
            console.log('Testing delete on product:', product.id);
            await prisma.product.delete({ where: { id: product.id } });
            console.log('Successfully deleted!');
        } else {
            console.log('No product found to delete.');
        }
    } catch (error) {
        console.error('Delete error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDelete();
