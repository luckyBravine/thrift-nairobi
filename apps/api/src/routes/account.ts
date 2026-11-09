import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { Router } from 'express';
import { db } from '../db/client';
import { AppError } from '../errors/AppError';
import { requireCustomer } from '../middlewares/require-role';
import { orderItems, orders } from '../db/schema/schema';

const accountRouter = Router();

accountRouter.use(...requireCustomer);

accountRouter.get('/me', (req, res) => {
  const user = req.session?.user;
  if (!user) throw new AppError(401, 'Unauthorized');

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

accountRouter.get('/orders', async (req, res) => {
  const userId = req.session?.user.id;
  if (!userId) throw new AppError(401, 'Unauthorized');

  const customerOrders = await db
    .select({
      id: orders.id,
      publicId: orders.publicId,
      status: orders.status,
      totalKes: orders.totalKes,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(and(eq(orders.userId, userId), isNull(orders.archivedAt)))
    .orderBy(desc(orders.createdAt))
    .limit(50);

  const orderIds = customerOrders.map((order) => order.id);
  const items = orderIds.length
    ? await db
        .select({
          orderId: orderItems.orderId,
          title: orderItems.title,
          size: orderItems.size,
          quantity: orderItems.quantity,
          unitPriceKes: orderItems.unitPriceKes,
        })
        .from(orderItems)
        .where(inArray(orderItems.orderId, orderIds))
    : [];
  const itemsByOrder = new Map<string, typeof items>();

  for (const item of items) {
    const orderItemsForOrder = itemsByOrder.get(item.orderId) ?? [];
    orderItemsForOrder.push(item);
    itemsByOrder.set(item.orderId, orderItemsForOrder);
  }

  res.json({
    orders: customerOrders.map((order) => ({
      ...order,
      items: itemsByOrder.get(order.id) ?? [],
    })),
  });
});

export { accountRouter };
